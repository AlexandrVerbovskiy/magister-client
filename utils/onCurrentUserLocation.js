const onCurrentUserLocation = (hasNavCallback, noHasNavCallback = null) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      hasNavCallback({ lat, lng });
    });
  } else {
    if (noHasNavCallback) {
      noHasNavCallback();
    }
  }
};

export default onCurrentUserLocation;
