export const API_ENDPOINTS = {
  AUTH: {
    GET_SESSION: "/api/auth/get-session",
  },
  ADMIN: {
    LIST_USERS: "/api/auth/admin/list-users",
  },
  CLASS: {
    LIST: "/api/class",
    CREATE: "/api/class",
    UPDATE: (id: string) => `/api/class/${id}`,
    DELETE: (id: string) => `/api/class/${id}`,
  },
  ENROLLMENTS: {
    LIST: "/api/enrollments",
    SET_USER_CLASSES: (userId: string) => `/api/enrollments/user/${userId}`,
    REMOVE_USER_CLASS: (userId: string, classId: string) =>
      `/api/enrollments/user/${userId}/class/${classId}`,
  },
  STUDENTS: {
    ME: "/api/students/me",
    DETAIL: (userId: string) => `/api/students/${userId}`,
    REGENERATE_QR: (userId: string) => `/api/students/${userId}/regenerate-qr`,
    RESOLVE_QR: (token: string) =>
      `/api/students/qr/${encodeURIComponent(token)}`,
  },
} as const;
