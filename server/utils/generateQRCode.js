const generateQRCode = (url) => {
  // Uses a public API to generate a QR Code simply for demonstration.
  // We recommend using 'qrcode' npm package for production offline generation.
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
};

module.exports = generateQRCode;
