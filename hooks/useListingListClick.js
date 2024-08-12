import { useRouter } from "next/router";
import { IndiceContext } from "../contexts";
import { useContext } from "react";
import { activateAuthPopup } from "../utils";

const useListingListClick = (props) => {
  const { sessionUser } = useContext(IndiceContext);
  const router = useRouter();
  const link = props?.link ?? "/listings/";

  const handleClick = () => {
    if (sessionUser) {
      router.push(link);
    } else {
      activateAuthPopup();
    }
  };

  return { handleClick };
};

export default useListingListClick;
