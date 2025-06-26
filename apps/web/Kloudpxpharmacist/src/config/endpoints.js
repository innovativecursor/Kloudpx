const baseURLLive = "http://localhost:10002";
const baseURLDev = "http://localhost:10002";

const isLive = false;
const baseUrl = isLive ? baseURLLive : baseURLDev;

const endpoints = {
  auth: {
    googleLogin: `${baseUrl}/v1/auth/google/callback/`,
    googleLoginPharmacist: `${baseUrl}/v1/auth/google/callback/pharmacist`,
    refresh: `${baseUrl}/v1/auth/refresh`,
  },
  Prescriptions: {
    get: `${baseUrl}/v1/pharmacist/all-prescriptions`,
  },
  protected: {
    basic: `${baseUrl}/api/v1/protected`,
    admin: `${baseUrl}/api/v1/admin`,
  },
};

export default endpoints;
