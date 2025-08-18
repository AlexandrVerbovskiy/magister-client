import React, { useEffect, useRef } from "react";
import Map from "../GoogleMapItems/Map";
import Marker from "../GoogleMapItems/Marker";
import Circle from "../GoogleMapItems/Circle";
import { onCurrentUserLocation } from "../../utils";
import STATIC from "../../static";

const defaultMarker = require("../../public/images/maps/default-marker.svg")
  .default.src;

const hoveredMarker = require("../../public/images/maps/hovered-marker.svg")
  .default.src;

const userMarker = require("../../public/images/maps/user-marker.svg").default
  .src;

const MultyMarkersMap = ({
  markers = [],
  onMouseOver = () => {},
  onMouseOut = () => {},
  baseCenter = null,
  userLocation = null,
  setUserLocation = null,
  center,
  setCenter = null,
  defaultLocation = null,
}) => {
  const mapRef = useRef(null);

  if (baseCenter) {
    baseCenter = { lat: Number(baseCenter.lat), lng: Number(baseCenter.lng) };
  } else {
    baseCenter = STATIC.DEFAULTS.CITY_COORDS;
  }

  useEffect(() => {
    if (defaultLocation) {
      const defaultCoords = {
        lat: Number(defaultLocation.lat),
        lng: Number(defaultLocation.lng),
      };

      if (setUserLocation) {
        setUserLocation(defaultCoords);
      }

      if (!baseCenter && setCenter) {
        return setCenter(defaultCoords);
      }
    } else {
      if (baseCenter && setCenter) {
        return setCenter(baseCenter);
      }

      onCurrentUserLocation(
        ({ lat, lng }) => {
          if (setUserLocation) {
            setUserLocation({ lat, lng });
          }

          if (!baseCenter && setCenter) {
            return setCenter({ lat, lng });
          }
        },
        () => {
          if (setUserLocation) {
            setUserLocation(null);
          }

          if (setCenter) {
            return setCenter(baseCenter);
          }
        }
      );
    }
  }, []);

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
            color="#0ec6c6"
            strokeOpacity={marker.active ? 0.35 : 0.35}
            fillOpacity={marker.active ? 0.25 : 0.15}
          />
        </React.Fragment>
      ))}
    </Map>
  );
};

export default MultyMarkersMap;
