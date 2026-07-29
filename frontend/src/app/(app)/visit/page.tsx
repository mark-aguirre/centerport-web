"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

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
    <PageContainer>
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
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-base">
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
