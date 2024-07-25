const byteConverter = (bytes) => {
  const gigabytes = Math.floor(bytes / (1024 * 1024 * 1024));
  const megabytes = Math.floor(bytes / (1024 * 1024));
  const kilobytes = Math.floor(bytes / 1024);

  if (gigabytes > 0) {
    return gigabytes + " gigabytes";
  }

  if (megabytes > 0) {
    return megabytes + " megabytes";
  }

  if (kilobytes > 0) {
    return kilobytes + " kilobytes";
  }

  return bytes + " bytes";
};

export default byteConverter;
