import { useRef } from "react";
import Map from "../GoogleMapItems/Map";
import Marker from "../GoogleMapItems/Marker";
import Circle from "../GoogleMapItems/Circle";

const EditMap = ({
  markerActive,
  setMarkerActive,
  center,
  setCenter,
  lat,
  lng,
  changeCoords,
  radius,
  setRadius,
  height = "300px",
}) => {
  const mapRef = useRef(null);
  const circleRef = useRef(null);
  const markerRef = useRef(null);

  return (
    <div className="form-group">
      <Map
        ref={mapRef}
        center={center}
        onRightClick={() => setMarkerActive(false)}
        onDragEnd={() => {
          if (!mapRef.current || !mapRef.current.center) {
            return;
          }

          const center = mapRef.current.center;
          const lat = center.lat();
          const lng = center.lng();

          setCenter({ lat, lng });
        }}
        onClick={(e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          setMarkerActive(true);
          changeCoords({ lat, lng });
        }}
        height={height}
      >
        <Marker
          ref={markerRef}
          lat={lat}
          lng={lng}
          onClick={() => setMarkerActive(true)}
        />
        <Circle
          ref={circleRef}
          radius={radius}
          lat={lat}
          lng={lng}
          draggable={markerActive}
          editable={markerActive}
          onClick={() => setMarkerActive(true)}
          color="#0ec6c6"
          onRadiusChanged={() => {
            if (!circleRef.current) return;
            setRadius(circleRef.current.state.circle.radius);
          }}
          onCenterChanged={() => {
            if (!circleRef.current) return;

            const center = circleRef.current.state.circle.center;
            const newLat = center.lat();
            const newLng = center.lng();

            if (lat == newLat && lng == newLng) {
              return;
            }

            changeCoords({ lat: newLat, lng: newLng });
          }}
          onDrag={(e) => {
            if (!e) return;
            const newCenter = e.latLng.toJSON();
            changeCoords({ lat: newCenter.lat, lng: newCenter.lng });
          }}
        />
      </Map>
    </div>
  );
};

export default EditMap;
