export const profileKeys = {
  all: ["profile"] as const,
  // The signed-in user's one profile: shared by /resume and the interview setup form's toggle.
  detail: () => [...profileKeys.all, "detail"] as const,
  upload: () => [...profileKeys.all, "upload"] as const,
  remove: () => [...profileKeys.all, "remove"] as const,
};
