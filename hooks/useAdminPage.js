import React, { useEffect, useState } from "react";

const useAdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document
      .querySelector("body")
      .classList.add(
        "font-inter",
        "antialiased",
        "bg-slate-100",
        "dark:bg-slate-900",
        "text-slate-600",
        "dark:text-slate-400",
        "sidebar-expanded"
      );

    return () => {
      document
        .querySelector("body")
        .classList.remove(
          "font-inter",
          "antialiased",
          "bg-slate-100",
          "dark:bg-slate-900",
          "text-slate-600",
          "dark:text-slate-400",
          "sidebar-expanded"
        );
    };
  }, []);

  return { sidebarOpen, setSidebarOpen };
};

export default useAdminPage;
