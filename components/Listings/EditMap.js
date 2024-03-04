import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";
import ENV from "../../env";
import { useRef } from "react";

const EditMap = ({
  markerActive,
  setMarkerActive,
  center,
  setCenter,
  lat,
  setLat,
  lng,
  setLng,
  radius,
  setRadius,
}) => {
  const mapRef = useRef(null);
  const circleRef = useRef(null);
  const markerRef = useRef(null);

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
    <div className="form-group">
      <GoogleMap
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerStyle={{ height: "500px", width: "100%" }}
        className="my-map"
        onRightClick={() => setMarkerActive(false)}
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
          
          setMarkerActive(true);
          setLat(lat);
          setLng(lng);
        }}
      >
        <Marker
          ref={markerRef}
          position={{ lat: lat, lng: lng }}
          onClick={() => setMarkerActive(true)}
        />
        <Circle
          center={{ lat: lat, lng: lng }}
          radius={radius}
          ref={circleRef}
          onClick={() => setMarkerActive(true)}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            draggable: markerActive,
            editable: markerActive,
          }}
          onRadiusChanged={() => {
            if (!circleRef.current) return;
            setRadius(circleRef.current.state.circle.radius);
          }}
          onCenterChanged={() => {
            if (!circleRef.current) return;

            const center = circleRef.current.state.circle.center;
            const newLat = center.lat();
            const newLng = center.lng();

            if ((lat == newLat, lng == newLng)) {
              return;
            }

            setLat(lat);
            setLng(lng);
          }}
          onDrag={(e) => {
            if (!e) return;
            const newCenter = e.latLng.toJSON();
            setLat(newCenter.lat);
            setLng(newCenter.lng);
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default EditMap;
