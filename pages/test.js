import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import ENV from "../env";

const Test = ({
  onClick = () => {},
  height = "400px",
  width = "400px",
  center = {
    lat: 44.076613,
    lng: -98.362239833,
  },
}) => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: ENV.GOOGLE_MAP_API_KEY,
  });

  const onLoad = (map) => {
    new window.google.maps.LatLngBounds(center);
    mapRef.current = map;
  };

  const onUnmount = function callback(map) {
    mapRef.current = null;
  };

  const handleMapClick = (e) => {
    onClick(e.latLng.toJSON());
  };

  if (!isLoaded) return <></>;

  return (
    <div>
      Test
      <GoogleMap
        center={center}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        mapContainerStyle={{ height, width }}
        className="my-map"
      >
        <Marker key="Test" position={{ lat: 40.74, lng: -73.98 }}>
          <div>Test</div>
        </Marker>

        <Marker key="Test2" position={{ lat: 20.74, lng: -53.98 }}>
          <div>Test 2</div>
        </Marker>
      </GoogleMap>
    </div>
  );
};

export default Test;
