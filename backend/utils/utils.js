function shortenURL(length) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let newURL = "";
  for (let i = 0; i < length; i++) {
    newURL += chars[Math.floor(Math.random() * chars.length)];
  }
  return newURL;
}

module.exports = {
  shortenURL,
};
