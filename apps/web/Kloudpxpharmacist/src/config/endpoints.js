// const baseURLLive = "http://localhost:10002";
// const baseURLDev = "http://localhost:10002";

// const isLive = false;
// const baseUrl = isLive ? baseURLLive : baseURLDev;

// const endpoints = {
//   auth: {
//     googleLogin: `${baseUrl}/v1/auth/google/callback/`,
//     googleLoginPharmacist: `${baseUrl}/v1/auth/google/callback/pharmacist`,
//     refresh: `${baseUrl}/v1/auth/refresh`,
//   },
//   Prescriptions: {
//     get: `${baseUrl}/v1/pharmacist/all-prescriptions`,
//   },
//   protected: {
//     basic: `${baseUrl}/api/v1/protected`,
//     admin: `${baseUrl}/api/v1/admin`,
//   },
// };

// export default endpoints;

// const baseURLLive = "http://localhost:10002";
// const baseURLDev = "http://localhost:10002";

// const isLive = false;
// const baseUrl = isLive ? baseURLLive : baseURLDev;

const endpoints = {
  auth: {
    googleLogin: `/v1/auth/google/callback/`,
    googleLoginPharmacist: `/v1/auth/google/callback/pharmacist`,
    refresh: `/v1/auth/refresh`,
  },
  Prescriptions: {
    get: `/v1/pharmacist/all-prescriptions`,
    details: "/v1/pharmacist/prescriptions-details",
    getCart: "/v1/pharmacist/get-prescriptions-cart",
    submitPrescription: "/v1/pharmacist/submit-prescriptions",
  },
  protected: {
    basic: `/api/v1/protected`,
    admin: `/api/v1/admin`,
  },
};

export default endpoints;
