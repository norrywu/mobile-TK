import { Tabs } from "expo-router";
import { Host, Icon } from "@expo/ui";
import { DASHBOARD_ICON, QR_ICON } from "@/components/app-icons";

export default function StudentTabsLayout() {
  return (
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
        name="qr"
        options={{
          title: "QR Saya",
          tabBarIcon: ({ color, size }) => (
            <Host matchContents>
              <Icon name={QR_ICON} size={size} color={color} />
            </Host>
          ),
        }}
      />
    </Tabs>
  );
}
