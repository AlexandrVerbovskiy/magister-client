export const isCurrentPath = (currentPath) => {
  if (!link) {
    return currentPath === "/";
  }

  return currentPath === "/" + link || currentPath.includes("/" + link + "/");
};

export const isCurrentAdminPath = (currentPath, link = null) => {
  if (!link) {
    return currentPath === "/admin/";
  }

  return (
    currentPath === "/admin/" + link ||
    currentPath === "/admin/" + link + "/" ||
    currentPath.includes("/admin/" + link + "/")
  );
};
