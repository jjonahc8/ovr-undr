import { PostgrestError } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

interface FollowRecord {
  [key: string]: unknown;
}

interface ProfileRecord {
  [key: string]: unknown;
}

interface TestResultData<T> {
  data: T[] | null;
  error: PostgrestError | null;
  columns?: string[] | string;
}

export default interface TestResults {
  followsTable: TestResultData<FollowRecord>;
  profilesTable: TestResultData<ProfileRecord>;
  authUser: {
    data: { user: User | null } | null;
    error: Error | null;
  };
  error?: Error | unknown;
}
