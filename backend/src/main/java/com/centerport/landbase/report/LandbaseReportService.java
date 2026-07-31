package com.centerport.landbase.report;

import com.centerport.common.exception.NotFoundException;
import com.centerport.landbase.LandbasePeme;
import com.centerport.landbase.LandbasePemeRepository;
import com.centerport.profile.SeafarerProfile;

import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service responsible for generating PDF reports for Landbase PEME records.
 *
 * Compiles JRXML templates from the classpath, caches compiled reports for
 * performance, fills them with entity data, and exports to PDF byte arrays.
 *
 * @see LandbaseReportType
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class LandbaseReportService {

    private static final String TEMPLATE_PATH = "reports/landbase/";

    private final LandbasePemeRepository repository;
    private final ConcurrentHashMap<String, JasperReport> compiledReportCache = new ConcurrentHashMap<>();

    public LandbaseReportService(LandbasePemeRepository repository) {
        this.repository = repository;
    }

    /**
     * Generate a PDF report for the given PEME record and report type.
     *
     * @param pemeId     UUID of the landbase PEME record
     * @param reportType the type of report to generate
     * @return PDF content as a byte array
     * @throws NotFoundException if the PEME record does not exist
     */
    public byte[] generateReport(UUID pemeId, LandbaseReportType reportType) {
        log.info("Generating {} report for PEME ID: {}", reportType.getDisplayName(), pemeId);

        LandbasePeme peme = repository.findWithProfileById(pemeId)
                .orElseThrow(() -> new NotFoundException("LandbasePeme", pemeId));

        try {
            JasperReport jasperReport = getCompiledReport(reportType.getTemplateName());
            Map<String, Object> parameters = buildParameters(peme);

            // Use an empty datasource since all data is passed via parameters
            JRBeanCollectionDataSource emptyDataSource =
                    new JRBeanCollectionDataSource(Collections.singletonList(new Object()));

            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    jasperReport, parameters, emptyDataSource);

            byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);
            log.info("Successfully generated {} report ({} bytes) for PEME: {}",
                    reportType.getTemplateName(), pdfBytes.length, peme.getPemeId());
            return pdfBytes;

        } catch (JRException e) {
            log.error("Failed to generate report {} for PEME {}: {}",
                    reportType.getTemplateName(), pemeId, e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage(), e);
        }
    }

    /**
     * Compile (or retrieve from cache) the JRXML template.
     */
    private JasperReport getCompiledReport(String templateName) throws JRException {
        return compiledReportCache.computeIfAbsent(templateName, name -> {
            try {
                String resourcePath = TEMPLATE_PATH + name + ".jrxml";
                ClassPathResource resource = new ClassPathResource(resourcePath);

                if (!resource.exists()) {
                    throw new IllegalStateException("Report template not found: " + resourcePath);
                }

                try (InputStream is = resource.getInputStream()) {
                    log.debug("Compiling JRXML template: {}", resourcePath);
                    return JasperCompileManager.compileReport(is);
                }
            } catch (IOException | JRException e) {
                throw new RuntimeException("Failed to compile report template: " + name, e);
            }
        });
    }

    /**
     * Build the parameter map from the PEME entity and its linked profile.
     * All fields are converted to String for display in the report.
     */
    private Map<String, Object> buildParameters(LandbasePeme peme) {
        Map<String, Object> params = new HashMap<>();
        SeafarerProfile profile = peme.getSeafarerProfile();

        // Identity - from SeafarerProfile
        params.put("pemeId", nullSafe(peme.getPemeId()));
        params.put("lastName", profile != null ? nullSafe(profile.getLastName()) : "");
        params.put("firstName", profile != null ? nullSafe(profile.getFirstName()) : "");
        params.put("middleName", profile != null ? nullSafe(profile.getMiddleName()) : "");
        params.put("gender", profile != null ? nullSafe(profile.getGender()) : "");
        params.put("civilStatus", profile != null ? nullSafe(profile.getMaritalStatus()) : "");
        params.put("address", profile != null ? nullSafe(profile.getAddress()) : "");
        params.put("contactNo", profile != null ? nullSafe(profile.getContactNo()) : "");
        params.put("birthdate", profile != null ? nullSafe(profile.getBirthdate()) : "");
        params.put("age", profile != null ? nullSafe(profile.getAge()) : "");
        params.put("placeOfBirth", profile != null ? nullSafe(profile.getPlaceOfBirth()) : "");
        params.put("passportNo", profile != null ? nullSafe(profile.getPassportNo()) : "");
        params.put("seamansBookNo", profile != null ? nullSafe(profile.getSeamansBookNo()) : "");
        params.put("religion", profile != null ? nullSafe(profile.getReligion()) : "");
        params.put("nationality", profile != null ? nullSafe(profile.getNationality()) : "");
        params.put("employer", profile != null ? nullSafe(profile.getEmployer()) : "");
        params.put("position", profile != null ? nullSafe(profile.getPosition()) : "");
        params.put("countryOfDestination", profile != null ? nullSafe(profile.getCountryOfDestination()) : "");
        params.put("photoUrl", profile != null ? nullSafe(profile.getPhotoUrl()) : "");

        // DOH / Certificate identifiers
        params.put("dohAccreditationNo", nullSafe(peme.getDohAccreditationNo()));
        params.put("refNo", nullSafe(peme.getRefNo()));

        // Medical history (JSONB map serialized to readable text)
        params.put("medicalHistory", formatMedicalHistory(peme.getMedicalHistory()));
        params.put("medicalHistoryOthers", nullSafe(peme.getMedicalHistoryOthers()));
        params.put("consultedDoctor", peme.getConsultedDoctor() != null && peme.getConsultedDoctor() ? "Yes" : "No");
        params.put("maintenanceMedications", nullSafe(peme.getMaintenanceMedications()));

        // Physical Examination - Vital Signs
        params.put("peWeight", nullSafe(peme.getPeWeight()));
        params.put("peHeight", nullSafe(peme.getPeHeight()));
        params.put("peBmi", nullSafe(peme.getPeBmi()));
        params.put("pePulseRate", nullSafe(peme.getPePulseRate()));
        params.put("peBloodPressure", nullSafe(peme.getPeBloodPressure()));
        params.put("peRespiration", nullSafe(peme.getPeRespiration()));
        params.put("peBodyTemperature", nullSafe(peme.getPeBodyTemperature()));

        // Vision Acuity
        params.put("visionFarOdUncorrected", nullSafe(peme.getVisionFarOdUncorrected()));
        params.put("visionFarOsUncorrected", nullSafe(peme.getVisionFarOsUncorrected()));
        params.put("visionFarOdCorrected", nullSafe(peme.getVisionFarOdCorrected()));
        params.put("visionFarOsCorrected", nullSafe(peme.getVisionFarOsCorrected()));
        params.put("visionNearOdUncorrected", nullSafe(peme.getVisionNearOdUncorrected()));
        params.put("visionNearOsUncorrected", nullSafe(peme.getVisionNearOsUncorrected()));
        params.put("visionNearOdCorrected", nullSafe(peme.getVisionNearOdCorrected()));
        params.put("visionNearOsCorrected", nullSafe(peme.getVisionNearOsCorrected()));
        params.put("visionColorAdequate",
                peme.getVisionColorAdequate() != null && peme.getVisionColorAdequate() ? "Adequate" : "Defective");

        // Hearing Audiometry
        params.put("hearingAd", nullSafe(peme.getHearingAd()));
        params.put("hearingAs", nullSafe(peme.getHearingAs()));

        // Physical Exploration - Column A
        params.put("peSkin", peValueToCheckmark(peme.getPeSkin()));
        params.put("peSkinFindings", nullSafe(peme.getPeSkinFindings()));
        params.put("peHeadScalp", peValueToCheckmark(peme.getPeHeadScalp()));
        params.put("peHeadScalpFindings", nullSafe(peme.getPeHeadScalpFindings()));
        params.put("peEyesExternal", peValueToCheckmark(peme.getPeEyesExternal()));
        params.put("peEyesExternalFindings", nullSafe(peme.getPeEyesExternalFindings()));
        params.put("pePupils", peValueToCheckmark(peme.getPePupils()));
        params.put("pePupilsFindings", nullSafe(peme.getPePupilsFindings()));
        params.put("peEars", peValueToCheckmark(peme.getPeEars()));
        params.put("peEarsFindings", nullSafe(peme.getPeEarsFindings()));
        params.put("peNoseSinuses", peValueToCheckmark(peme.getPeNoseSinuses()));
        params.put("peNoseSinusesFindings", nullSafe(peme.getPeNoseSinusesFindings()));
        params.put("peMouthThroat", peValueToCheckmark(peme.getPeMouthThroat()));
        params.put("peMouthThroatFindings", nullSafe(peme.getPeMouthThroatFindings()));

        // Physical Exploration - Column B
        params.put("peNeckLymphNodes", peValueToCheckmark(peme.getPeNeckLymphNodes()));
        params.put("peNeckLymphNodesFindings", nullSafe(peme.getPeNeckLymphNodesFindings()));
        params.put("peBreastAxilla", peValueToCheckmark(peme.getPeBreastAxilla()));
        params.put("peBreastAxillaFindings", nullSafe(peme.getPeBreastAxillaFindings()));
        params.put("peChestLungs", peValueToCheckmark(peme.getPeChestLungs()));
        params.put("peChestLungsFindings", nullSafe(peme.getPeChestLungsFindings()));
        params.put("peHeart", peValueToCheckmark(peme.getPeHeart()));
        params.put("peHeartFindings", nullSafe(peme.getPeHeartFindings()));
        params.put("peAbdomen", peValueToCheckmark(peme.getPeAbdomen()));
        params.put("peAbdomenFindings", nullSafe(peme.getPeAbdomenFindings()));
        params.put("peBack", peValueToCheckmark(peme.getPeBack()));
        params.put("peBackFindings", nullSafe(peme.getPeBackFindings()));

        // Physical Exploration - Column C
        params.put("peAnusRectum", peValueToCheckmark(peme.getPeAnusRectum()));
        params.put("peAnusRectumFindings", nullSafe(peme.getPeAnusRectumFindings()));
        params.put("peGenitoUrinary", peValueToCheckmark(peme.getPeGenitoUrinary()));
        params.put("peGenitoUrinaryFindings", nullSafe(peme.getPeGenitoUrinaryFindings()));
        params.put("peInguinalsGenitals", peValueToCheckmark(peme.getPeInguinalsGenitals()));
        params.put("peInguinalsGenitalsFindings", nullSafe(peme.getPeInguinalsGenitalsFindings()));
        params.put("peExtremities", peValueToCheckmark(peme.getPeExtremities()));
        params.put("peExtremitiesFindings", nullSafe(peme.getPeExtremitiesFindings()));
        params.put("peReflexes", peValueToCheckmark(peme.getPeReflexes()));
        params.put("peReflexesFindings", nullSafe(peme.getPeReflexesFindings()));
        params.put("peDental", peValueToCheckmark(peme.getPeDental()));
        params.put("peDentalFindings", nullSafe(peme.getPeDentalFindings()));

        // Ancillary examinations
        params.put("xrayNo", nullSafe(peme.getXrayNo()));
        params.put("chestXray", enumToString(peme.getChestXray()));
        params.put("cbc", enumToString(peme.getCbc()));
        params.put("cec", enumToString(peme.getCec()));
        params.put("pregnancyTest", enumToString(peme.getPregnancyTest()));
        params.put("urinalysis", enumToString(peme.getUrinalysis()));
        params.put("stoolExam", enumToString(peme.getStoolExam()));
        params.put("hbsag", enumToString(peme.getHbsag()));
        params.put("hivAidsTest", enumToString(peme.getHivAidsTest()));
        params.put("apb", enumToString(peme.getApb()));
        params.put("bloodType", enumToString(peme.getBloodType()));
        params.put("drugTest", enumToString(peme.getDrugTest()));
        params.put("psychologicalTest", enumToString(peme.getPsychologicalTest()));
        params.put("additionalTests", nullSafe(peme.getAdditionalTests()));

        // Remarks
        params.put("remarks", nullSafe(peme.getRemarks()));

        // Results
        params.put("basicPemeResult", enumToString(peme.getBasicPemeResult()));
        params.put("additionalLabResult", enumToString(peme.getAdditionalLabResult()));
        params.put("flagMedicalLabResult", enumToString(peme.getFlagMedicalLabResult()));

        // Recommendation
        params.put("recommendation", enumToString(peme.getRecommendation()));
        params.put("dateInitialPeme", nullSafe(peme.getDateInitialPeme()));
        params.put("dateOfFitness", nullSafe(peme.getDateOfFitness()));
        params.put("validUntil", nullSafe(peme.getValidUntil()));
        params.put("authorizedPhysician", nullSafe(peme.getAuthorizedPhysician()));
        params.put("medicalCertificationNo", nullSafe(peme.getMedicalCertificationNo()));
        params.put("medicalDirector", nullSafe(peme.getMedicalDirector()));

        return params;
    }

    private String nullSafe(String value) {
        return value != null ? value : "";
    }

    private String enumToString(Enum<?> value) {
        if (value == null) return "";
        // Convert enum name to a more readable form (e.g. WITH_FINDINGS -> With Findings)
        String name = value.name();
        if (name.isEmpty()) return "";
        return name.substring(0, 1).toUpperCase() +
               name.substring(1).toLowerCase().replace('_', ' ');
    }

    /**
     * Convert PhysicalExplorationValue to a checkmark symbol for the report.
     * NORMAL displays a checkmark; ABNORMAL displays empty (findings column has details).
     */
    private String peValueToCheckmark(com.centerport.common.enums.PhysicalExplorationValue value) {
        if (value == null || value == com.centerport.common.enums.PhysicalExplorationValue.NORMAL) {
            return "\u2611"; // checked box
        }
        return "\u2610"; // unchecked box
    }

    /**
     * Format the medical history JSONB map into a readable string for the report.
     * Each entry with value "true" or "yes" is listed as a checked condition.
     */
    private String formatMedicalHistory(java.util.Map<String, String> medicalHistory) {
        if (medicalHistory == null || medicalHistory.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (java.util.Map.Entry<String, String> entry : medicalHistory.entrySet()) {
            String val = entry.getValue();
            if (val != null && (val.equalsIgnoreCase("true") || val.equalsIgnoreCase("yes"))) {
                if (sb.length() > 0) sb.append(", ");
                // Convert key from camelCase/snake_case to readable form
                String key = entry.getKey().replace("_", " ");
                sb.append(key);
            }
        }
        return sb.toString();
    }
}
