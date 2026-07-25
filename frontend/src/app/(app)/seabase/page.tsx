import { PageContainer } from "@/components/common/page-container";
import { SearchBar } from "@/components/common/search-bar";
import { EmptyStateCard } from "@/components/common/empty-state-card";

/** Vessel and maritime operations management page placeholder. */
export default function SeabasePage() {
  return (
    <PageContainer>
      <SearchBar />
      <EmptyStateCard message="Seabase Module - Coming Soon" />
    </PageContainer>
  );
}
