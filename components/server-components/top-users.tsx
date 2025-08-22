import { createClient } from "@/lib/supabase/server";
import TopUsersClient from "../client-components/top-users-client";

export default async function TopUsers({ currentUserId }: { currentUserId: string }) {
  const supabase = await createClient();

  try {
    // Get top 5 users from profiles table, excluding current user
    const { data: topUsers, error } = await supabase
      .from('profiles')
      .select('id, username, first_name, last_name, pfp_link')
      .neq('id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching top users:', error);
      return null;
    }

    if (!topUsers || topUsers.length === 0) {
      return (
        <div className="rounded-xl border-gray-600 border-[0.5px]">
          <h3 className="text-left font-bold text-xl pt-4 pb-2 px-4">
            You might know
          </h3>
          <div className="p-4 text-center text-gray-500">
            No users found
          </div>
        </div>
      );
    }

    // Get current follow relationships
    const { data: followRelationships } = await supabase
      .from('follows')
      .select('followee_id')
      .eq('follower_id', currentUserId)
      .in('followee_id', topUsers.map(u => u.id));

    const followingIds = new Set(followRelationships?.map(f => f.followee_id) || []);

    // Add isFollowing property to each user
    const usersWithFollowStatus = topUsers.map(user => ({
      ...user,
      isFollowing: followingIds.has(user.id)
    }));

    return <TopUsersClient users={usersWithFollowStatus} currentUserId={currentUserId} />;
  } catch (err) {
    console.error('Exception in TopUsers:', err);
    return null;
  }
}