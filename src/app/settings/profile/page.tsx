import ProfileSettingsContent from "@/components/settings/profile/ProfileSettingsContent";
import { getAuthSession } from "@/lib/auth";
import { FC } from "react";

interface ProfileSettingsProps {}

const ProfileSettings: FC<ProfileSettingsProps> = async ({}) => {
  const session = await getAuthSession();
  return <ProfileSettingsContent session={session} />;
};

export default ProfileSettings;
