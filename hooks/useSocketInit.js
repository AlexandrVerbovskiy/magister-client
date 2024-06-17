import { useRef } from "react";
import io from "socket.io-client";
import ENV from "../env";

const useSocketInit = ({ authToken }) => {
  const socketIoRef = useRef(null);

  useEffect(() => {
    if (authToken) {
      socketIoRef.current = io(ENV.SERVER_URL, {
        query: {
          token: authToken,
        },
      });

      socketIoRef.current.on("get-notification", (data) => console.log(data));
    } else {
      socketIoRef.current = null;
    }
  }, [authToken]);

  return socketIoRef.current;
};

export default useSocketInit;
