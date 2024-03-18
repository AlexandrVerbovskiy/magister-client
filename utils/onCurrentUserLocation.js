const onCurrentUserLocation = (hasNavCallback, noHasNavCallback = null) => {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      hasNavCallback({ lat, lng });
    },
    function (err) {
      if (noHasNavCallback) {
        noHasNavCallback(err.message);
      }
    }
  );
};

export default onCurrentUserLocation;
