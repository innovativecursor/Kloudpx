const isLive = true;

const baseUrls = {
  admin: isLive ? "https://api.admin.kloudpx.com" : "http://localhost:10001",

  pharmacist: isLive
    ? "https://api.pharmacist.kloudpx.com"
    : "http://localhost:10002",
};

export { isLive, baseUrls };
