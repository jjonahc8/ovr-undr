export interface TweetAuthorParentView {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  author_username: string;
  author_pfp_link: string | null;
  file_link: string | null;
  parent_id: string | null;
  parent_tweet_id: string | null;
  parent_text: string | null;
  parent_created_at: string | null;
  parent_user_id: string | null;
  parent_author_username: string | null;
  parent_author_pfp_link: string | null;
  parent_file_link: string | null;
}
