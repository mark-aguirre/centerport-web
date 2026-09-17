"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import type { MedicalPersonnelRecord } from "@/lib/api";
import { PersonnelTable } from "@/components/personnel/PersonnelTable";
import { AssignmentMatrix } from "@/components/personnel/AssignmentMatrix";

/**
 * Super Admin — Medical Personnel Management.
 *
 * The single source of truth for medical personnel, their licensing data,
 * signatures, and module/role assignments. Two tabs:
 *  - Personnel: searchable/filterable/sortable roster with full CRUD +
 *    deactivate/reactivate.
 *  - Assignments: the module × role matrix whose selections become the default
 *    signatories automatically loaded into report forms.
 *
 * Access is ADMIN-only (enforced by the backend and mirrored here for UX).
 */
export default function MedicalPersonnelPage() {
  const { roles, loading: authLoading } = useAuth();
  const isAdmin = roles.includes("ADMIN");

  // Personnel are lifted to the page so the assignment matrix pickers reflect
  // the latest roster after any create/edit/deactivate in the table tab.
  const [personnel, setPersonnel] = useState<MedicalPersonnelRecord[]>([]);
  const [personnelVersion, setPersonnelVersion] = useState(0);

  const handlePersonnelChanged = useCallback(
    (records: MedicalPersonnelRecord[]) => {
      setPersonnel(records);
      setPersonnelVersion((v) => v + 1);
    },
    []
  );

  // Seed the matrix pickers even before the table tab is opened.
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    void (async () => {
      try {
        const page = await api.MedicalPersonnel.listAdmin({ size: 200 });
        if (!cancelled) {
          setPersonnel(page.content);
          setPersonnelVersion((v) => v + 1);
        }
      } catch {
        // The table tab surfaces its own load error; ignore here.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <PageContainer className="max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <ShieldAlert className="h-10 w-10 text-destructive/60" />
          <p className="text-sm font-medium text-foreground/70">
            Administrator access required
          </p>
          <p className="text-xs text-muted-foreground">
            This page is restricted to Super Admin users.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-7xl">
      <PageTitle
        title="Medical Personnel"
        description="Manage signatories, licensing, signatures, and module assignments in one place."
      />

      <Tabs defaultValue="personnel">
        <TabsList>
          <TabsTrigger value="personnel" className="cursor-pointer">
            Personnel
          </TabsTrigger>
          <TabsTrigger value="assignments" className="cursor-pointer">
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personnel">
          <PersonnelTable onPersonnelChanged={handlePersonnelChanged} />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentMatrix
            personnel={personnel}
            personnelVersion={personnelVersion}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
