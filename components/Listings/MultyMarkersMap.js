import Map from "../GoogleMapItems/Map";
import Marker from "../GoogleMapItems/Marker";
import Circle from "../GoogleMapItems/Circle";

import React, { useEffect, useRef, useState } from "react";
import STATIC from "../../static";

const defaultMarker = require("../../public/images/maps/default-marker.svg")
  .default.src;

const hoveredMarker = require("../../public/images/maps/hovered-marker.svg")
  .default.src;

const userMarker = require("../../public/images/maps/user-marker.svg").default
  .src;

const defaultCenter = STATIC.cityCoords[Object.keys(STATIC.cityCoords)[0]];

const MultyMarkersMap = ({
  markers = [],
  onMouseOver = () => {},
  onMouseOut = () => {},
}) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setCenter({ lat, lng });
      });
    } else {
      setUserLocation(null);
    }
  }, [navigator.geolocation]);

  return (
    <Map
      ref={mapRef}
      height="100%"
      width="100%"
      center={center}
      className="my-map"
    >
      {userLocation && (
        <Marker
          lat={Number(userLocation.lat)}
          lng={Number(userLocation.lng)}
          icon={userMarker}
        />
      )}
      {markers.map((marker) => (
        <React.Fragment key={marker.id}>
          <Marker
            onMouseOver={() => onMouseOver(marker.id)}
            onMouseOut={() => onMouseOut(marker.id)}
            lat={marker.lat}
            lng={marker.lng}
            icon={marker.active ? hoveredMarker : defaultMarker}
          />
          <Circle
            lat={marker.lat}
            lng={marker.lng}
            radius={marker.radius}
            onMouseOver={() => onMouseOver(marker.id)}
            onMouseOut={() => onMouseOut(marker.id)}
            color="#FF0000"
            strokeOpacity={marker.active ? 1 : 0.8}
            fillOpacity={marker.active ? 0.5 : 0.35}
          />
        </React.Fragment>
      ))}
    </Map>
  );
};

export default MultyMarkersMap;
