import { Icons } from "@/components/Icons";
import {
  Settings,
  SettingsContent,
  SettingsGroup,
  SettingsHeader,
  SettingsItem,
} from "@/components/settings/Settings";
import { Button } from "@/components/ui/Button";
import { FC } from "react";

interface AccountSettingsProps {}

const AccountSettings: FC<AccountSettingsProps> = async ({}) => {
  return (
    <Settings className="px-4 md:px-0">
      <SettingsHeader>Account Settings</SettingsHeader>
      <SettingsContent>
        <SettingsGroup groupName="Delete Account">
          <SettingsItem className="justify-end">
            <Button
              className="border border-highlight bg-emphasis font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground active:scale-[.98]"
              size={"sm"}
            >
              <Icons.trash className="mr-2 h-4 w-4" /> Delete Account
            </Button>
          </SettingsItem>
        </SettingsGroup>
      </SettingsContent>
    </Settings>
  );
};

export default AccountSettings;
