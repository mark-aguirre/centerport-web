import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import EmploymentSection from "@/components/profile/EmploymentSection";
import FamilyDataSection from "@/components/profile/FamilyDataSection";
import EducationSection from "@/components/profile/EducationSection";
import WorkExperienceSection from "@/components/profile/WorkExperienceSection";

const emptyProfile = {
  photo_url: "", last_name: "", first_name: "", middle_name: "",
  address: "", city: "", contact_no: "", birthdate: "", age: "",
  gender: "", marital_status: "", place_of_birth: "", religion: "",
  nationality: "", country: "", employer: "", designation: "",
  passport_no: "", seamans_book_no: "", position: "", country_of_destination: "",
  father_name: "", father_occupation: "", mother_name: "", mother_occupation: "",
  no_of_brothers: "", no_of_sisters: "", birth_order: "",
  spouse_name: "", spouse_occupation: "", no_of_children: "",
  elementary: "", high_school: "", college_university: "", course: "",
  highest_level_attended: "", prev_date_started: "", prev_date_end: "",
  prev_length_of_stay: "", prev_company: "", prev_position: "",
  prev_reason_of_leaving: "", remark: ""
};

export default function ProfileForm() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id");

  const [data, setData] = useState(emptyProfile);
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [existingRecord, setExistingRecord] = useState(null);

  useEffect(() => {
    if (editId) {
      base44.entities.SeafarerProfile.filter({ id: editId }).then((results) => {
        if (results.length > 0) {
          setExistingRecord(results[0]);
          setData({ ...emptyProfile, ...results[0] });
        }
        setLoading(false);
      });
    }
  }, [editId]);

  const generateProfileId = async () => {
    const all = await base44.entities.SeafarerProfile.list("-created_date", 1);
    if (all.length === 0) return "CMSI00000001";
    const lastId = all[0].profile_id || "CMSI00000000";
    const num = parseInt(lastId.replace("CMSI", "")) + 1;
    return `CMSI${String(num).padStart(8, "0")}`;
  };

  const handleSave = async () => {
    if (!data.last_name || !data.first_name) {
      toast.error("Please fill in the required fields (Last Name, First Name)");
      return;
    }
    setSaving(true);
    if (editId && existingRecord) {
      const { id, created_date, updated_date, created_by, ...updateData } = data;
      await base44.entities.SeafarerProfile.update(editId, updateData);
      toast.success("Profile updated successfully");
    } else {
      const profileId = await generateProfileId();
      await base44.entities.SeafarerProfile.create({ ...data, profile_id: profileId });
      toast.success("Profile created successfully");
    }
    setSaving(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sections = [
    { component: PersonalInfoSection, key: "personal" },
    { component: EmploymentSection, key: "employment" },
    { component: FamilyDataSection, key: "family" },
    { component: EducationSection, key: "education" },
    { component: WorkExperienceSection, key: "work" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <ProfileHeader
          profileId={existingRecord?.profile_id}
          createdDate={existingRecord?.created_date}
          updatedDate={existingRecord?.updated_date}
        />

        <div className="space-y-3">
          {sections.map(({ component: Section, key }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.25 }}
            >
              <Section data={data} onChange={setData} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mt-5 pt-4 border-t border-primary/10"
        >
          <Button
          
            variant="outline"
            onClick={() => navigate("/")}
            className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {editId ? "Update Profile" : "Save Profile"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}