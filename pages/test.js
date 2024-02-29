import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
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
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

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

  const calculateDistance = (point1, point2) => {
    const R = 6371e3;
    const lat1 = (point1.lat * Math.PI) / 180;
    const lon1 = (point1.lng * Math.PI) / 180;
    const lat2 = (point2.lat * Math.PI) / 180;
    const lon2 = (point2.lng * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
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
        mapContainerStyle={{ height, width }}
        className="my-map"
        onClick={(e) => {
          const newMarker = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
        }}
      >
        {markers.map((marker, index) => (
          <React.Fragment key={index}>
            <Marker
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                setSelectedMarkerIndex(index);
              }}
            />
              <Circle
                center={{ lat: marker.lat, lng: marker.lng }}
                radius={5000}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35,
                  draggable: false,
                  editable: false,
                }}
                onDrag={(e) => {
                  const newCenter = e.latLng.toJSON();
                  const distance = calculateDistance(
                    { lat: marker.lat, lng: marker.lng },
                    newCenter
                  );

                  const newMarkers = [...markers];
                  newMarkers[index] = {
                    ...newMarkers[index],
                    lat: newCenter.lat,
                    lng: newCenter.lng,
                  };
                  setMarkers(newMarkers);
                }}
              />
          </React.Fragment>
        ))}
      </GoogleMap>
    </div>
  );
};

export default Test;
