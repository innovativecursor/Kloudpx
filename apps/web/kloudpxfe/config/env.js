const isLive = process.env.NODE_ENV === "production";

const baseUrls = {
  users: isLive
    ? process.env.NEXT_PUBLIC_USER_BASE_URL
    : "http://localhost:10003",
};

export { isLive, baseUrls };
