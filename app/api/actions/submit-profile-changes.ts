import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function submitProfileChanges(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const { data: authUserData, error: authUserError } =
    await supabase.auth.getClaims();

  if (authUserError || !authUserData?.claims) {
    console.error("Error fetching authentication");
    redirect("/auth/login");
  }
  const authUser = authUserData?.claims;
  const authUserID = authUser?.sub;

  const { data: profileData, error: profileDataError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUserID);

  if (profileDataError) {
    console.error("Error fetching current profile: ", profileDataError);
  }

  let firstName = formData.get("firstName")
    ? formData.get("firstName")
    : profileData?.[0].first_name;
  let lastName = formData.get("lastName")
    ? formData.get("lastName")
    : profileData?.[0].last_name;
  let bio = formData.get("bio") ? formData.get("bio") : profileData?.[0].bio;

  const { data: profileUpdateData, error: profileUpdateError } = await supabase
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName, bio: bio })
    .eq("id", authUserID);

  if (profileUpdateError) {
    console.error("Error updating profile: ", profileUpdateError);
  } else {
    console.log(profileUpdateData);
  }
}

export default submitProfileChanges;
