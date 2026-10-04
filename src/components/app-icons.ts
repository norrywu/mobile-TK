import { Icon } from "@expo/ui";

/**
 * Ikon tab Dasbor — SF Symbol di iOS, Material Symbol di Android.
 * Didefinisikan sekali (hoisted) agar tree-shake per platform optimal.
 */
export const DASHBOARD_ICON = Icon.select({
  ios: "house.fill",
  android: import("@expo/material-symbols/home.xml"),
});

/**
 * Ikon tab Scan QR (admin).
 */
export const SCAN_ICON = Icon.select({
  ios: "qrcode.viewfinder",
  android: import("@expo/material-symbols/qr_code_scanner.xml"),
});

/**
 * Ikon tab QR Saya (student).
 */
export const QR_ICON = Icon.select({
  ios: "qrcode",
  android: import("@expo/material-symbols/qr_code.xml"),
});
