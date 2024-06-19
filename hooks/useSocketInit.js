import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ENV from "../env";

const useSocketInit = ({ authToken }) => {
  const [socketIo, setSocketIo] = useState(null);

  /*useEffect(() => {
    if (authToken) {
      const newSocketIo = io(ENV.SERVER_URL, {
        query: {
          token: authToken,
        },
      });

      newSocketIo.on("get-notification", (data) => console.log(data));

      setSocketIo(newSocketIo);
    } else {
      setSocketIo(null);
    }
  }, [authToken]);*/

  return socketIo;
};

export default useSocketInit;
