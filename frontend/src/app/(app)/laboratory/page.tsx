import { PageContainer } from "@/components/common/page-container";
import { SearchBar } from "@/components/common/search-bar";
import { EmptyStateCard } from "@/components/common/empty-state-card";

/** Laboratory tests and diagnostics page placeholder. */
export default function LaboratoryPage() {
  return (
    <PageContainer>
      <SearchBar />
      <EmptyStateCard message="Laboratory Module - Coming Soon" />
    </PageContainer>
  );
}
