import ProfileSettingsContent from "@/components/settings/profile/ProfileSettingsContent";
import { getAuthSession } from "@/lib/auth";

const ProfileSettings = async () => {
  const session = await getAuthSession();
  return <ProfileSettingsContent session={session} />;
};

export default ProfileSettings;
