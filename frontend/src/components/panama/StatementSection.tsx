"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormSelect } from "@/components/common/form-select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FileSignature } from "lucide-react";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "./constants";
import { createFieldUpdater } from "./utils";
import type { PanamaCertificate, PanamaSectionProps } from "./types";

/**
 * Shared input styling for the statement table value cells.
 */
const CELL_INPUT_CLASS = cn(
  "h-8 w-full bg-white text-sm border border-primary/20 rounded-md px-2",
  "focus:outline-none focus-visible:border-primary dark:bg-input/30"
);

/**
 * Keys for one statement block (examinee or practitioner), so the shared
 * table renderer can read/write the correct fields.
 */
interface StatementBlockKeys {
  name: keyof PanamaCertificate;
  idNumber: keyof PanamaCertificate;
  day: keyof PanamaCertificate;
  month: keyof PanamaCertificate;
  year: keyof PanamaCertificate;
  witness: keyof PanamaCertificate;
}

/**
 * Panama Medical Certificate — Statement section (Section III).
 *
 * Rendered as a bordered table matching the official certificate layout:
 * a left label column and a right value column, with rows for the examinee's
 * name, ID/passport, date (dd/mm/yy), and witness. The authorization line and
 * the approved-practitioner block follow the same table style.
 */
export default function StatementSection({ data, onChange, disabled }: PanamaSectionProps) {
  const update = createFieldUpdater(data, onChange);

  /** A single bordered row: label on the left, value cell on the right. */
  const Row = ({
    label,
    children,
    last,
  }: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
  }) => (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)]",
        !last && "border-b border-primary/30"
      )}
    >
      <div className="border-primary/30 px-3 py-2 text-sm text-foreground sm:border-r">
        {label}
      </div>
      <div className="flex items-center px-3 py-2">{children}</div>
    </div>
  );

  /** The date row shared by both statement blocks. */
  const DateRow = ({
    keys,
    label = "Date (dd/mm/yy):",
    last,
  }: {
    keys: StatementBlockKeys;
    label?: string;
    last?: boolean;
  }) => (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)]",
        !last && "border-b border-primary/30"
      )}
    >
      <div className="border-primary/30 px-3 py-2 text-sm text-foreground sm:border-r">
        {label}
      </div>
      <div className="grid grid-cols-3 items-end gap-2 px-3 py-2">
        <Input
          aria-label="Day"
          type="number"
          value={String(data[keys.day] ?? "")}
          onChange={(event) => update(keys.day, event.target.value)}
          className={cn(CELL_INPUT_CLASS, disabled && "pointer-events-none")}
          placeholder="DD"
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
        />
        <FormSelect
          value={String(data[keys.month] ?? "")}
          onChange={(v) => update(keys.month, v)}
          options={MONTH_OPTIONS}
          disabled={disabled}
          size="md"
        />
        <FormSelect
          value={String(data[keys.year] ?? "")}
          onChange={(v) => update(keys.year, v)}
          options={YEAR_OPTIONS}
          disabled={disabled}
          size="md"
        />
      </div>
    </div>
  );

  /** A text value cell used inside a labelled row. */
  const TextCell = ({
    field,
    ariaLabel,
  }: {
    field: keyof PanamaCertificate;
    ariaLabel: string;
  }) => (
    <Input
      aria-label={ariaLabel}
      value={String(data[field] ?? "")}
      onChange={(event) => update(field, event.target.value)}
      className={cn(CELL_INPUT_CLASS, disabled && "pointer-events-none")}
      readOnly={disabled}
      tabIndex={disabled ? -1 : undefined}
    />
  );

  const examineeKeys: StatementBlockKeys = {
    name: "statement_name",
    idNumber: "statement_id_number",
    day: "statement_day",
    month: "statement_month",
    year: "statement_year",
    witness: "statement_witness_name",
  };

  const practitionerKeys: StatementBlockKeys = {
    name: "statement_practitioner_name",
    idNumber: "statement_practitioner_id_number",
    day: "statement_practitioner_date_day",
    month: "statement_practitioner_date_month",
    year: "statement_practitioner_date_year",
    witness: "statement_practitioner_witness",
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="III. Statement"
        icon={FileSignature}
        subtitle="Certification and authorization"
        banner
      />

      {/* Intro text */}
      <p className="mb-3 text-sm text-foreground">
        I hereby certify that the personal declaration above is a true statement to the best of my knowledge.
      </p>

      {/* Examinee statement table */}
      <div className="overflow-hidden rounded-md border border-primary/30">
        <Row label="Name and signature of person undergoing examination:">
          <TextCell
            field={examineeKeys.name}
            ariaLabel="Name and signature of person undergoing examination"
          />
        </Row>
        <Row label="ID Number or passport">
          <TextCell field={examineeKeys.idNumber} ariaLabel="ID Number or passport" />
        </Row>
        <DateRow keys={examineeKeys} />
        <Row label="Name and signature of Witness (print name):" last>
          <TextCell
            field={examineeKeys.witness}
            ariaLabel="Name and signature of Witness"
          />
        </Row>
      </div>

      {/* Authorization line with the inline "Dr." release field, followed by
          the "(The approved medical practitioner)" note on the same sentence. */}
      <p className="mt-4 text-sm leading-7 text-foreground">
        I hereby authorize the release of all my previous medical records from
        any health professionals, health, institutions, and public authorities
        to Dr.
        <Input
          aria-label="Authorize release of medical records to Dr."
          value={data.statement_release_to_dr}
          onChange={(event) => update("statement_release_to_dr", event.target.value)}
          className={cn(
            "mx-2 inline-block h-7 w-64 max-w-full align-middle bg-white text-sm border border-primary/20 rounded-md px-2",
            "focus:outline-none focus-visible:border-primary dark:bg-input/30",
            disabled && "pointer-events-none"
          )}
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
        />
        <span className="italic">(The approved medical practitioner).</span>
      </p>

      {/* Approved medical practitioner table */}
      <div className="mt-4 overflow-hidden rounded-md border border-primary/30">
        <Row label="Name and signature of person undergoing examination:">
          <TextCell
            field={practitionerKeys.name}
            ariaLabel="Practitioner — name and signature of person undergoing examination"
          />
        </Row>
        <DateRow keys={practitionerKeys} label="Date (day/month/year):" />
        <Row label="Name and signature of Witness (print name):">
          <TextCell
            field={practitionerKeys.witness}
            ariaLabel="Practitioner — name and signature of Witness"
          />
        </Row>
        <Row label="Date and contact details for previous medical examination (if known):" last>
          <TextCell
            field="statement_previous_exam_details"
            ariaLabel="Date and contact details for previous medical examination (if known)"
          />
        </Row>
      </div>
    </div>
  );
}
