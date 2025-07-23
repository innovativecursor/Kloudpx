const isLive = process.env.NODE_ENV === "production";

const baseUrls = {
  users: isLive ? "https://api.user.kloudpx.com" : "http://localhost:10003",
};

export { isLive, baseUrls };
