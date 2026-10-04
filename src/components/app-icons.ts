import { Icon } from "@expo/ui";

/**
 * Ikon tab Dasbor — SF Symbol di iOS, Material Symbol di Android.
 * Didefinisikan sekali (hoisted) agar tree-shake per platform optimal.
 */
export const DASHBOARD_ICON = Icon.select({
  ios: "house.fill",
  android: import("@expo/material-symbols/home.xml"),
});
