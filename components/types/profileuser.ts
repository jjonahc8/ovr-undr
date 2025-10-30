export default interface ProfileUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  banner_link: string | null;
  pfp_link: string | null;
  created_at: string;
}
