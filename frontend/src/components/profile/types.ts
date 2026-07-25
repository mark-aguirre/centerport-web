import type { SeafarerProfile } from "@/lib/api";

/**
 * Shared props interface for all profile form section components.
 *
 * Each section receives the full profile data object, a callback
 * to propagate field changes, and a disabled flag controlled by
 * the CRUD form mode (view mode = disabled, edit mode = enabled).
 */
export interface ProfileSectionProps {
  /** Current seafarer profile form data */
  data: SeafarerProfile;
  /** Callback to update the profile state with modified data */
  onChange: (data: SeafarerProfile) => void;
  /** When true, all fields in this section are read-only (view mode) */
  disabled?: boolean;
}
