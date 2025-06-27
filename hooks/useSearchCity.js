import React, { useContext, useState } from "react";
import { IndiceContext } from "../contexts";

const useSearchCity = () => {
  const [tipsPopupActive, setTipsPopupActive] = useState(false);
  const cities = ["London", "Paris"];
  const [cityTips, setCityTips] = useState([]);

  const { error } = useContext(IndiceContext);

  const openCityTipsPopup = (baseValue = "") => {
    setTipsPopupActive(true);
    updateCityTips(baseValue);
  };

  const closeCityTipsPopup = () => setTipsPopupActive(false);

  const updateCityTips = async (search) => {
    try {
      const tips = cities.filter((city) =>
        city.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
      setCityTips(tips);
    } catch (e) {
      error.set(e.message);
    }
  };

  return {
    cityTipsPopupActive: tipsPopupActive,
    cityTips,
    openCityTipsPopup,
    closeCityTipsPopup,
    updateCityTips,
  };
};

export default useSearchCity;
