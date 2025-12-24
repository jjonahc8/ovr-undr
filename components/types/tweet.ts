export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  author: string;
  file_link: string | null;
  parent_id?: string | null;
}

export interface ParentTweet {
  id: string | null;
  text: string | null;
  created_at: string;
  user_id: string | null;
  author: string | null;
  file_link: string | null;
  parent_id?: string | null;
}
