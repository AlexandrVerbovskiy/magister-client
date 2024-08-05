import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocketInit = ({ authToken }) => {
  const [socketIo, setSocketIo] = useState(null);

  useEffect(() => {
    if (authToken) {
      const newSocketIo = io(process.env.NEXT_PUBLIC_SERVER_URL, {
        query: {
          token: authToken,
        },
      });

      setSocketIo(newSocketIo);
    } else {
      setSocketIo(null);
    }
  }, [authToken]);

  return socketIo;
};

export default useSocketInit;
