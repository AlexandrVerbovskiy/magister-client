import { Circle as GoogleCircle } from "@react-google-maps/api";
import { forwardRef } from "react";

const Circle = forwardRef(
  (
    {
      radius,
      lat,
      lng,
      onClick,
      color = "#594FBF",
      onRadiusChanged = () => {},
      onCenterChanged = () => {},
      onDrag = () => {},
      draggable = false,
      editable = false,
      onMouseOver = () => {},
      onMouseOut = () => {},
      strokeOpacity = 0.8,
      fillOpacity = 0.35,
    },
    ref
  ) => {
    return (
      <GoogleCircle
        center={{ lat: Number(lat), lng: Number(lng) }}
        radius={radius}
        ref={ref}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        options={{
          strokeColor: color,
          strokeOpacity,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity,
          draggable,
          editable,
        }}
        onRadiusChanged={onRadiusChanged}
        onCenterChanged={onCenterChanged}
        onDrag={onDrag}
      />
    );
  }
);

export default Circle;
