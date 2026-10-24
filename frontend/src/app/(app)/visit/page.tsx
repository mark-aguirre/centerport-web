"use client";

import { Suspense } from "react";
import { Loader2, Users } from "lucide-react";

import { PageBanner } from "@/components/common/page-banner";
import { PageContainer } from "@/components/common/page-container";
import { VisitList } from "@/components/visit/VisitList";
import { PatientSearchDialog } from "@/components/visit/PatientSearchDialog";
import { VisitRegistrationForm } from "@/components/visit/VisitRegistrationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useVisit } from "@/hooks/use-visit";

/**
 * Visit page content.
 *
 * Flow:
 * 1. Today's list is always visible
 * 2. "New Patient" opens the search dialog
 * 3. From search: select existing patient or register new
 * 4. Registration form opens in a separate dialog
 */
function VisitPageContent() {
  const {
    searchDialogOpen,
    openSearchDialog,
    closeSearchDialog,
    formDialogOpen,
    closeFormDialog,
    todayVisits,
    listLoading,
    refreshList,
    data,
    setData,
    editing,
    saving,
    isExistingRecord,
    purposeOfVisit,
    setPurposeOfVisit,
    sirb,
    setSirb,
    handleSelectPatient,
    handleRegisterNew,
    handleEdit,
    handleCancel,
    handleSave,
    handleSelectVisit,
    firstFieldRef,
  } = useVisit();

  return (
    // `/visit` is one of the zero-gutter routes in AppLayout so that PageBanner
    // can run edge to edge. The content below it still needs breathing room, so
    // the gutter lives here instead — in px, because the banner cancels it with
    // a matching negative margin and `html` sits at 90% font size. Keep
    // `px-[24px]` here and `-mx-[24px]` in PageBanner in step.
    <PageContainer className="space-y-3 px-[24px]">
      <PageBanner
        title="Visit Management"
        subtitle="View patients and manage today's clinic visits."
        icon={Users}
      />

      {/* Today's visits list */}
      <VisitList
        visits={todayVisits}
        loading={listLoading}
        onRefresh={refreshList}
        onNewPatient={openSearchDialog}
        onSelectVisit={handleSelectVisit}
      />

      {/* Step 1: Patient search dialog */}
      <PatientSearchDialog
        open={searchDialogOpen}
        onOpenChange={(open) => { if (!open) closeSearchDialog(); }}
        onSelectPatient={handleSelectPatient}
        onRegisterNew={handleRegisterNew}
      />

      {/* Step 2: Registration form dialog */}
      <Dialog open={formDialogOpen} onOpenChange={(open) => { if (!open) closeFormDialog(); }}>
        <DialogContent className="max-h-[90vh] max-w-4xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b border-border px-5 py-4 pr-14">
            <DialogTitle className="text-lg">
              {isExistingRecord ? "Patient Record" : "New Patient Registration"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isExistingRecord
                ? "View or edit the patient's registration details."
                : "Fill in the patient's information to register a new visit."}
            </DialogDescription>
          </DialogHeader>
          <VisitRegistrationForm
            data={data}
            onChange={setData}
            editing={editing}
            saving={saving}
            isExistingRecord={isExistingRecord}
            purposeOfVisit={purposeOfVisit}
            onPurposeChange={setPurposeOfVisit}
            sirb={sirb}
            onSirbChange={setSirb}
            onSave={handleSave}
            onCancel={handleCancel}
            onEdit={handleEdit}
            onNew={openSearchDialog}
            firstFieldRef={firstFieldRef}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

/**
 * Visit page route — Patient Registration and Today's Visits.
 */
export default function VisitPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <VisitPageContent />
    </Suspense>
  );
}
