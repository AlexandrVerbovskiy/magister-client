import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";
import ENV from "../../env";
import React, { useRef } from "react";

const defaultMarker = require("../../public/images/maps/default-marker.svg")
  .default.src;

const hoveredMarker = require("../../public/images/maps/hovered-marker.svg")
  .default.src;

const MultyMarkersMap = ({
  markers = [],
  onMouseOver = () => {},
  onMouseOut = () => {},
}) => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: ENV.GOOGLE_MAP_API_KEY,
  });

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onUnmount = function callback(map) {
    mapRef.current = null;
  };

  if (!isLoaded) return <></>;

  return (
    <GoogleMap
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapContainerStyle={{ height: "100%", width: "100%" }}
      className="my-map"
      center={{ lat: 53.390044, lng: -2.59695 }}
    >
      {markers.map((marker) => (
        <React.Fragment key={marker.id}>
          <Marker
            onMouseOver={() => onMouseOver(marker.id)}
            onMouseOut={() => onMouseOut(marker.id)}
            position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
            icon={marker.active ? hoveredMarker : defaultMarker}
          />
          <Circle
            center={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
            radius={marker.radius}
            onMouseOver={() => onMouseOver(marker.id)}
            onMouseOut={() => onMouseOut(marker.id)}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: marker.active ? 1 : 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: marker.active ? 0.5 : 0.35,
            }}
          />
        </React.Fragment>
      ))}
    </GoogleMap>
  );
};

export default MultyMarkersMap;
