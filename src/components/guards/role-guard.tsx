import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { authClient } from "@/lib/auth-client";

type UserRole = "admin" | "student";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo: Href;
}

/**
 * Penjaga role per layar (cadangan; saat ini tidak dipakai di layout grup).
 *
 * ATURAN PAKAI — dibaca sebelum memakai:
 * `redirectTo` HARUS rute yang pasti ter-mount saat guard ini tampil
 * (satu grup yang sama). JANGAN arahkan lintas grup kondisional
 * (mis. dari (admin) ke (student)): target belum tentu ada di pohon
 * navigasi karena gate akar me-mount tepat satu grup. <Redirect> yang
 * dirender ke rute hantu akan menembak berulang → crash
 * "Maximum update depth exceeded" (pernah kejadian Okt 2026).
 * Pemilihan grup ditangani gate akar (_layout.tsx); keamanan data
 * sesungguhnya tetap di backend (requireAdmin dkk).
 *
 * Implementasi sengaja effect-based (bukan <Redirect> di render) agar
 * navigasi hanya terjadi sekali per perubahan status, bukan per render.
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo,
}: RoleGuardProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string | null } | undefined)?.role;
  const denied =
    !isPending &&
    (!session || !role || !allowedRoles.includes(role as UserRole));

  useEffect(() => {
    if (denied) {
      router.replace(redirectTo);
    }
  }, [denied, redirectTo, router]);

  if (isPending || denied) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
