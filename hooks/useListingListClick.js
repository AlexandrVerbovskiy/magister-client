import { useRouter } from "next/router";
import { IndiceContext } from "../contexts";
import { useContext } from "react";
import { activateAuthPopup } from "../utils";

const useListingListClick = () => {
  const { sessionUser } = useContext(IndiceContext);
  const router = useRouter();

  const handleClick = () => {
    if (sessionUser) {
      router.push("/listings/");
    } else {
      activateAuthPopup();
    }
  };

  return { handleClick };
};

export default useListingListClick;
