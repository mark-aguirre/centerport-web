"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ship } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { landingRoute } from "@/lib/roles";
import { PageTitle } from "@/components/common/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DefaultValuesView } from "@/components/default-values/DefaultValuesView";
import { ClinicalChemistryView } from "@/components/clinical-chemistry/ClinicalChemistryView";
import { TumorImmunologyView } from "@/components/tumor-immunology/TumorImmunologyView";

/**
 * Default Values page — manage laboratory report reference / "normal" values
 * in one place, split across two tabs:
 *  - Hematology: Laboratory Report (Hematology) normal values.
 *  - Clinical Chemistry: Clinical Chemistry & Serology/Immunology reference
 *    values (S.I. + Conventional units).
 *
 * Each tab is a self-contained CRUD list (create / read / update / delete).
 *
 * Access is restricted to Laboratory staff (and ADMIN). The backend enforces
 * this on `/api/default-values/**` and `/api/clinical-chemistry/**`; this
 * client-side gate mirrors the rule so a user without the role is redirected to
 * their landing route instead of rendering the views and firing 403s. The gate
 * is UX only — the backend remains the authoritative check.
 */
export default function DefaultValuesPage() {
  const { loading, roles, canRoute } = useAuth();
  const router = useRouter();

  const allowed = canRoute("/default-values");

  useEffect(() => {
    if (loading || allowed) {
      return;
    }
    router.replace(landingRoute(roles));
  }, [loading, allowed, roles, router]);

  if (loading || !allowed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Ship className="h-8 w-8 animate-pulse" />
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Default Values"
        description="Laboratory report reference / normal values used to pre-fill report forms."
      />

      <Tabs defaultValue="hematology">
        <TabsList>
          <TabsTrigger value="hematology" className="cursor-pointer">
            Hematology
          </TabsTrigger>
          <TabsTrigger value="clinical-chemistry" className="cursor-pointer">
            Clinical Chemistry
          </TabsTrigger>
          <TabsTrigger value="tumor-immunology" className="cursor-pointer">
            Tumor/Immunological
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hematology">
          <DefaultValuesView />
        </TabsContent>

        <TabsContent value="clinical-chemistry">
          <ClinicalChemistryView />
        </TabsContent>

        <TabsContent value="tumor-immunology">
          <TumorImmunologyView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
