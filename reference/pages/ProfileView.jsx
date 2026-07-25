import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Loader2, User, Anchor, Users, GraduationCap, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 py-1.5">
      <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider min-w-[140px] flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-card rounded-xl p-6 shadow-sm border border-primary/10"
    >
      <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b-2 border-primary/20">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="text-base font-bold text-primary uppercase tracking-wide">{title}</h2>
      </div>
      <div className="space-y-0.5">{children}</div>
    </motion.div>
  );
}

export default function ProfileView() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get("id");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) {
      base44.entities.SeafarerProfile.filter({ id: profileId }).then((r) => {
        if (r.length > 0) setProfile(r[0]);
        setLoading(false);
      });
    }
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const p = profile;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-24 rounded-lg border-2 border-primary/20 overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
              {p.photo_url ? (
                <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary/30" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {p.last_name}, {p.first_name} {p.middle_name || ""}
              </h1>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-md inline-block mt-1">
                {p.profile_id}
              </span>
              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                {p.created_date && <span>Registered: {format(new Date(p.created_date), "MMM d, yyyy")}</span>}
                {p.updated_date && <span>Updated: {format(new Date(p.updated_date), "MMM d, yyyy")}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")} className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={() => navigate(`/profile/new?id=${p.id}`)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <SectionCard title="Personal Information" icon={User} delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow label="Address" value={p.address} />
              <InfoRow label="City" value={p.city} />
              <InfoRow label="Contact No." value={p.contact_no} />
              <InfoRow label="Birthdate" value={p.birthdate ? format(new Date(p.birthdate), "MMM d, yyyy") : null} />
              <InfoRow label="Age" value={p.age} />
              <InfoRow label="Gender" value={p.gender} />
              <InfoRow label="Marital Status" value={p.marital_status} />
              <InfoRow label="Place of Birth" value={p.place_of_birth} />
              <InfoRow label="Religion" value={p.religion} />
              <InfoRow label="Nationality" value={p.nationality} />
            </div>
          </SectionCard>

          <SectionCard title="Employment Details" icon={Anchor} delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow label="Employer" value={p.employer} />
              <InfoRow label="Designation" value={p.designation} />
              <InfoRow label="Passport No." value={p.passport_no} />
              <InfoRow label="Seaman's Book No." value={p.seamans_book_no} />
              <InfoRow label="Position" value={p.position} />
              <InfoRow label="Country" value={p.country} />
              <InfoRow label="Destination" value={p.country_of_destination} />
            </div>
          </SectionCard>

          <SectionCard title="Family Data" icon={Users} delay={0.16}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow label="Father" value={p.father_name} />
              <InfoRow label="Father's Occupation" value={p.father_occupation} />
              <InfoRow label="Mother" value={p.mother_name} />
              <InfoRow label="Mother's Occupation" value={p.mother_occupation} />
              <InfoRow label="No. of Brothers" value={p.no_of_brothers} />
              <InfoRow label="No. of Sisters" value={p.no_of_sisters} />
              <InfoRow label="Birth Order" value={p.birth_order} />
              <InfoRow label="Spouse" value={p.spouse_name} />
              <InfoRow label="Spouse's Occupation" value={p.spouse_occupation} />
              <InfoRow label="No. of Children" value={p.no_of_children} />
            </div>
          </SectionCard>

          <SectionCard title="Educational History" icon={GraduationCap} delay={0.24}>
            <InfoRow label="Elementary" value={p.elementary} />
            <InfoRow label="High School" value={p.high_school} />
            
            <InfoRow label="College/University" value={p.college_university} />
            <InfoRow label="Course" value={p.course} />
            <InfoRow label="Highest Level" value={p.highest_level_attended} />
          </SectionCard>

          <SectionCard title="Previous Work Experience" icon={Briefcase} delay={0.32}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow label="Date Started" value={p.prev_date_started ? format(new Date(p.prev_date_started), "MMM d, yyyy") : null} />
              <InfoRow label="Date End" value={p.prev_date_end ? format(new Date(p.prev_date_end), "MMM d, yyyy") : null} />
              <InfoRow label="Length of Stay" value={p.prev_length_of_stay} />
              <InfoRow label="Company" value={p.prev_company} />
              <InfoRow label="Position" value={p.prev_position} />
              <InfoRow label="Reason of Leaving" value={p.prev_reason_of_leaving} />
            </div>
            <InfoRow label="Remarks" value={p.remark} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}