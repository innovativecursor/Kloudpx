import { baseUrls } from "../../../../config/env";

const baseUrl = baseUrls.pharmacist;

const endpoints = {
  auth: {
    googleLogin: `${baseUrl}/v1/auth/google/callback/`,
    googleLoginPharmacist: `${baseUrl}/v1/auth/google/callback/pharmacist`,
    refresh: `${baseUrl}/v1/auth/refresh`,
    getCurrentUser: `${baseUrl}/v1/pharmacist/info`,
  },
  Prescriptions: {
    get: `${baseUrl}/v1/pharmacist/all-prescriptions`,
    details: `${baseUrl}/v1/pharmacist/prescriptions-details`,
    getCart: `${baseUrl}/v1/pharmacist/get-prescriptions-cart`,
    submitPrescription: `${baseUrl}/v1/pharmacist/submit-prescriptions`,
    rejectPrescription: `${baseUrl}/v1/pharmacist/reject-prescriptions`,
  },
  protected: {
    basic: `${baseUrl}/api/v1/protected`,
    admin: `${baseUrl}/api/v1/admin`,
  },
};

export default endpoints;
