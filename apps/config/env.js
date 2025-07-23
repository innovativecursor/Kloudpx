const isLive = process.env.NODE_ENV === "production";

const baseUrls = {
  admin: isLive
    ? process.env.NEXT_PUBLIC_ADMIN_BASE_URL
    : "http://localhost:10001",
  pharmacist: isLive
    ? process.env.NEXT_PUBLIC_PHARMACIST_BASE_URL
    : "http://localhost:10002",
};

export { isLive, baseUrls };



