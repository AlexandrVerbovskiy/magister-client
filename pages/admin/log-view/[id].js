import React, { useState, useEffect, useContext, useRef } from "react";
import Router, { useRouter } from "next/router";

const Logs = () => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const router = useRouter();
  const { id } = router.query;
};

Logs.getInitialProps = async () => ({
  access: "admin",
  type: "admin",
});

export default Logs;
