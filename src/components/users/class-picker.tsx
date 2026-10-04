import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ClassItem } from "@/services/class.service";

interface ClassPickerProps {
  classes: ClassItem[];
  selectedIds: string[];
  onToggle: (classId: string) => void;
  disabled?: boolean;
}

/**
 * Daftar toggle kelas. Presentational murni — state milik layar
 * pemanggil. Dipakai form create & edit siswa.
 */
export function ClassPicker({
  classes,
  selectedIds,
  onToggle,
  disabled,
}: ClassPickerProps) {
  if (classes.length === 0) {
    return (
      <Text style={styles.hint}>
        Belum ada kelas. Tambahkan dulu lewat Kelola Kelas di web.
      </Text>
    );
  }
  return (
    <View style={styles.list}>
      {classes.map((kelas) => {
        const active = selectedIds.includes(kelas.id);
        return (
          <Pressable
            key={kelas.id}
            style={[styles.classRow, active && styles.classRowActive]}
            onPress={() => onToggle(kelas.id)}
            disabled={disabled}
          >
            <Text style={[styles.className, active && styles.classNameActive]}>
              {kelas.name}
            </Text>
            <Text style={styles.classCheck}>{active ? "✓" : ""}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  hint: {
    fontSize: 13,
    opacity: 0.6,
  },
  classRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  classRowActive: {
    borderColor: "#208AEF",
    backgroundColor: "#208AEF22",
  },
  className: {
    fontSize: 15,
    fontWeight: "500",
  },
  classNameActive: {
    color: "#208AEF",
    fontWeight: "600",
  },
  classCheck: {
    fontSize: 16,
    color: "#208AEF",
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
});
