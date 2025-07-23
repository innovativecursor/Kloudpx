const isLive = process.env.NODE_ENV === "production";

const baseUrls = {
  admin: isLive ? "https://api.admin.kloudpx.com" : "http://localhost:10001",
  user: isLive ? "https://api.user.kloudpx.com" : "http://localhost:10003",
  pharmacist: isLive
    ? "https://api.pharmacist.kloudpx.com"
    : "http://localhost:10002",
};

export { isLive, baseUrls };