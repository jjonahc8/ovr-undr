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
  let banner = formData.get("banner");
  let pfp = formData.get("pfp");

  if (banner) {
    const bannerID = uuidv4();
    const { data: uploadBannerData, error: uploadBannerError } =
      await supabase.storage
        .from("banner")
        .upload(authUserID + "/" + bannerID, banner);

    if (uploadBannerError) {
      console.error("File upload error:", uploadBannerError);
      return;
    }
    const banner_image_link = `https://qzewmoffplkvyftuarjb.supabase.co/storage/v1/object/public/banner/${authUserID}/${bannerID}`;

    const { data: profileUpdateData, error: profileUpdateError } =
      await supabase
        .from("profiles")
        .update({ banner_link: banner_image_link })
        .eq("id", authUserID);

    if (profileUpdateError) {
      console.error("Error updating profile: ", profileUpdateError);
    }
  }

  if (pfp) {
    const pfpID = uuidv4();
    const { data: uploadPFPData, error: uploadPFPError } =
      await supabase.storage.from("pfp").upload(authUserID + "/" + pfpID, pfp);

    if (uploadPFPError) {
      console.error("File upload error:", uploadPFPError);
      return;
    }
    const pfp_image_link = `https://qzewmoffplkvyftuarjb.supabase.co/storage/v1/object/public/pfp/${authUserID}/${pfpID}`;

    const { data: profileUpdateData, error: profileUpdateError } =
      await supabase
        .from("profiles")
        .update({ pfp_link: pfp_image_link })
        .eq("id", authUserID);

    if (profileUpdateError) {
      console.error("Error updating profile: ", profileUpdateError);
    }
  }

  const { data: profileUpdateData, error: profileUpdateError } = await supabase
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName, bio: bio })
    .eq("id", authUserID);

  if (profileUpdateError) {
    console.error("Error updating profile: ", profileUpdateError);
  }
}

export default submitProfileChanges;
