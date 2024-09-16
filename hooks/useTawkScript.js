import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useIsMobile from "./useIsMobile";
import { IndiceContext } from "../contexts";

const tawkScriptId = "tawk-script";

const useTawkScript = (type) => {
  const firstActionRef = useRef(true);
  const router = useRouter();
  const interval = useRef(null);
  const isMobile = useIsMobile();

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
          s1.src = process.env.NEXT_PUBLIC_TAWK_PATH;
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

    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      const frames = document.querySelectorAll(".widget-visible iframe");
      const hasFooter = !!document.querySelector(".mobile-footer");

      if (isMobile && hasFooter) {
        if (frames.length >= 3) {
          frames[0].style.bottom = "60px";
          frames[1].style.bottom = "130px";
          frames[2].style.bottom = "130px";
        }

        if (frames.length == 4) {
          frames[3].style.bottom = "70px";
        }
      } else {
        if (frames.length >= 3) {
          frames[0].style.bottom = "20px";
          frames[1].style.bottom = "90px";
          frames[2].style.bottom = "100px";
        }

        if (frames.length == 4) {
          frames[3].style.bottom = "30px";
        }
      }
    }, 100);
  }, [router.asPath, type, isMobile]);

  return null;
};

export default useTawkScript;
