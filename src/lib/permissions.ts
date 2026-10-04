import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * CERMIN dari backend `backend-tk/src/lib/permissions.ts`.
 * Harus dijaga selaras manual — bila statement/role backend berubah,
 * salin perubahannya ke sini agar tipe client (mis. role createUser)
 * tetap akurat.
 */
export const statement = {
  ...defaultStatements,
  student: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  student: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
});

export const student = ac.newRole({
  student: ["read"],
  course: ["read"],
});

export const roles = {
  admin,
  student,
};
