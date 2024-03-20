export const isCurrentPath = (currentPath) => {
  if (!link) return currentPath === "/admin/";
  return currentPath.includes("/admin/" + link);
};

export const isCurrentAdminPath = (currentPath, link = null) => {
  if (!link) return currentPath === "/admin/";
  return currentPath.includes("/admin/" + link);
};
