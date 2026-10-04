import { Tabs } from "expo-router";
import { Host, Icon } from "@expo/ui";
import { DASHBOARD_ICON, SCAN_ICON } from "@/components/app-icons";
import { RoleGuard } from "@/components/guards/role-guard";

export default function AdminTabsLayout() {
  return (
    <RoleGuard allowedRoles={["admin"]} redirectTo="/(student)/dashboard">
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dasbor",
            tabBarIcon: ({ color, size }) => (
              <Host matchContents>
                <Icon name={DASHBOARD_ICON} size={size} color={color} />
              </Host>
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: "Scan",
            tabBarIcon: ({ color, size }) => (
              <Host matchContents>
                <Icon name={SCAN_ICON} size={size} color={color} />
              </Host>
            ),
          }}
        />
      </Tabs>
    </RoleGuard>
  );
}
