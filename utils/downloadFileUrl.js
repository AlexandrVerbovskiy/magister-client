const downloadFileUrl = (fileUrl, id) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = `inv-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(fileUrl);
};

export default downloadFileUrl;
