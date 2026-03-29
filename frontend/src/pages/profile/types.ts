export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;

  date_of_birth?: string;
  passport_number?: string;

  country?: {
    id: number;
    name: string;
  };
}
