import { useEffect, useRef } from "react";
import STATIC from "../static";

const tawkScriptId = "tawk-script";

const useTawkScript = (type) => {
  const firstActionRef = useRef(true);

  useEffect(() => {
    const widgetVisible = document.querySelector(".widget-visible");

    if (type == "admin") {
      if (widgetVisible) {
        widgetVisible.style.setProperty("display", "none", "important");
      }
    } else {
      if (firstActionRef.current) {
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();

        (() => {
          const s1 = document.createElement("script");
          s1.id = tawkScriptId;
          const s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = STATIC.TAWK_PATH;
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();

        firstActionRef.current = false;
      } else {
        if (widgetVisible) {
          widgetVisible.style.removeProperty("display");
        }
      }
    }
  }, [type]);

  return null;
};

export default useTawkScript;
