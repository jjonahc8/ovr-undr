import { createClient } from "@/lib/supabase/server";

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

    return (
      <div className="rounded-xl border-gray-600 border-[0.5px]">
        <h3 className="text-left font-bold text-xl pt-4 pb-2 px-4">
          You might know
        </h3>
        {topUsers.map((user) => (
          <div
            key={user.id}
            className="hover:bg-white/10 p-4 flex justify-between items-center last:rounded-b-xl transition duration-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full flex-none">
                {user.pfp_link ? (
                  <img 
                    src={user.pfp_link} 
                    alt={user.username || 'User'} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-neutral-600 rounded-full"></div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-sm text-white">
                  {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                </div>
                <div className="text-gray-500 text-xs">
                  @{user.username}
                </div>
              </div>
            </div>
            <form action="/api/actions/follow-user" method="POST">
              <input type="hidden" name="followingId" value={user.id} />
              <button 
                type="submit"
                className="rounded-full px-4 py-2 bg-white text-neutral-950 font-semibold hover:bg-gray-200 transition duration-200"
              >
                Follow
              </button>
            </form>
          </div>
        ))}
      </div>
    );
  } catch (err) {
    console.error('Exception in TopUsers:', err);
    return null;
  }
}