import type { SeafarerProfile } from "@/lib/api";

/**
 * Shared props interface for all profile form section components.
 *
 * Each section receives the full profile data object and a callback
 * to propagate field changes back to the parent form state.
 */
export interface ProfileSectionProps {
  /** Current seafarer profile form data */
  data: SeafarerProfile;
  /** Callback to update the profile state with modified data */
  onChange: (data: SeafarerProfile) => void;
}
