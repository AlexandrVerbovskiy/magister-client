import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { forwardRef } from "react";

const Map = forwardRef(
  (
    {
      children,
      center,
      height = "500px",
      width = "100%",
      className = "my-map",
      zoom = 13,
      onRightClick = () => {},
      onClick = () => {},
      onDragEnd = () => {},
    },
    ref
  ) => {
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    });

    const onLoad = (map) => {
      ref.current = map;
    };

    const onUnmount = function callback(map) {
      ref.current = null;
    };

    if (!isLoaded) return <></>;

    return (
      <GoogleMap
        mapTypeId="hybrid"
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerStyle={{ height, width }}
        className={className}
        onRightClick={onRightClick}
        onDragEnd={onDragEnd}
        onClick={onClick}
      >
        {children}
      </GoogleMap>
    );
  }
);

export default Map;
