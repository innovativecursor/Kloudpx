const baseURLLive = "http://localhost:10001";
const baseURLDev = "http://localhost:10001";

const isLive = false;
const baseUrl = isLive ? baseURLLive : baseURLDev;

const endpoints = {
  auth: {
    googleLogin: `${baseUrl}/v1/auth/google/callback`,
    refresh: `${baseUrl}/v1/auth/refresh`,
  },
  generic: {
    get: `${baseUrl}/v1/generic/get-generic`,
    add: `${baseUrl}/v1/generic/add-generic`,
  },
  protected: {
    basic: `${baseUrl}/api/v1/protected`,
    admin: `${baseUrl}/api/v1/admin`,
  },
};

export default endpoints;
