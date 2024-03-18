import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";


import ENV from "../env";

const MapElem = ({
  updateMarker,
  marker,
  index,
  selectedMarkerIndex,
  setSelectedMarkerIndex,
}) => {
  const circleRef = useRef(null);
  const markerRef = useRef(null);

  return (
    <>
      <Marker
        ref={markerRef}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={() => {
          setSelectedMarkerIndex(index);
        }}
      />
      <Circle
        center={{ lat: marker.lat, lng: marker.lng }}
        radius={marker.radius}
        ref={circleRef}
        onClick={() => {
          setSelectedMarkerIndex(index);
        }}
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          draggable: index === selectedMarkerIndex,
          editable: index === selectedMarkerIndex,
        }}
        onRadiusChanged={() => {
          if (!circleRef.current) return;

          updateMarker(
            {
              radius: circleRef.current.state.circle.radius,
            },
            index
          );
        }}
        onCenterChanged={() => {
          if (!circleRef.current) return;

          const center = circleRef.current.state.circle.center;
          const lat = center.lat();
          const lng = center.lng();

          if ((marker.lat == lat, lng == marker.lng)) {
            return;
          }

          updateMarker({ lat, lng }, index);
        }}
        onDrag={(e) => {
          if (!e) return;
          const newCenter = e.latLng.toJSON();

          updateMarker(
            {
              lat: newCenter.lat,
              lng: newCenter.lng,
            },
            index
          );
        }}
      />
    </>
  );
};

const Test = ({
  height = "400px",
  width = "400px",
  initCenter = {
    lat: 44.076613,
    lng: -98.362239833,
  },
}) => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [center, setCenter] = useState(initCenter);

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

  const updateMarker = (data, index) => {
    const newMarkers = [...markers];

    newMarkers[index] = {
      ...newMarkers[index],
      ...data,
    };

    setMarkers(newMarkers);
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
        onRightClick={() => setSelectedMarkerIndex(null)}
        onDragEnd={() => {
          if (!mapRef.current) return;
          const center = mapRef.current.center;
          const lat = center.lat();
          const lng = center.lng();

          setCenter({ lat, lng });
        }}
        onClick={(e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          const newMarker = { lat, lng, radius: 5000 };
          const newIndex = markers.length;
          setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
          setSelectedMarkerIndex(newIndex);

          getPlaceName(lat, lng);
        }}
      >
        {markers.map((marker, index) => (
          <MapElem
            updateMarker={updateMarker}
            markers={markers}
            setMarkers={setMarkers}
            marker={marker}
            index={index}
            selectedMarkerIndex={selectedMarkerIndex}
            setSelectedMarkerIndex={setSelectedMarkerIndex}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Test;
