import { Marker as GoogleMarker } from "@react-google-maps/api";
import { forwardRef } from "react";

const defaultMarker = require("../../public/images/maps/default-marker.svg")
  .default.src;

const Marker = forwardRef(
  (
    {
      onClick = () => {},
      onMouseOver = () => {},
      onMouseOut = () => {},
      icon = null,
      lat,
      lng,
    },
    ref
  ) => {
    if (!icon) icon = defaultMarker;

    return (
      <GoogleMarker
        position={{ lat: Number(lat), lng: Number(lng) }}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        icon={icon}
      />
    );
  }
);

export default Marker;
