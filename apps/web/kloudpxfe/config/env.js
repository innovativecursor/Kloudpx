const isLive = false;

const baseUrls = {
  users: isLive ? "https://api.user.kloudpx.com" : "http://localhost:10003",
};

export { isLive, baseUrls };
