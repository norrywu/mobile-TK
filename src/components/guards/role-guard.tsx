import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect, type Href } from "expo-router";
import { authClient } from "@/lib/auth-client";

type UserRole = "admin" | "student";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo: Href;
}

/**
 * Penjaga role per layar/grup (padanan RoleGuard di frontend web).
 * Keamanan data sesungguhnya tetap di backend (requireAdmin dkk).
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo,
}: RoleGuardProps) {
  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as { role?: string | null } | undefined)?.role;

  if (isPending) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session || !role || !allowedRoles.includes(role as UserRole)) {
    return <Redirect href={redirectTo} />;
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
