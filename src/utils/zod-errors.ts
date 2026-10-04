import { z } from "zod";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Pengganti @hookform/resolvers untuk proyek ini: memetakan hasil
 * `safeParse` yang gagal menjadi error per-field RHF.
 * Dipakai karena rantai dependensi resolvers resmi bertengkar versi
 * zod dengan better-auth (v4 vs v3) — lihat riwayat proyek.
 */
export function applyZodErrors<T extends FieldValues>(
  error: z.ZodError,
  setError: UseFormSetError<T>,
): void {
  const flat = error.flatten();
  for (const [field, messages] of Object.entries(flat.fieldErrors)) {
    const message = Array.isArray(messages) ? messages[0] : undefined;
    if (message) {
      setError(field as Path<T>, { type: "manual", message });
    }
  }
}
