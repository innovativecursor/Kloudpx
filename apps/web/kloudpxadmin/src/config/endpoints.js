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
  supplier: {
    get: `${baseUrl}/v1/supplier/get-all-supplier`,
    add: `${baseUrl}/v1/supplier/add-supplier`,
  },
  category: {
    get: `${baseUrl}/v1/category/get-all-category`,
    add: `${baseUrl}/v1/category/add-category`,
  },
  medicine: {
    getAll: `${baseUrl}/v1/medicine/get-all-medicine`,
    add: `${baseUrl}/v1/medicine/add-medicine`,
    update: (id) => `${baseUrl}/v1/medicine/update-medicine/${id}`,
    delete: (id) => `${baseUrl}/v1/medicine/delete-medicine/${id}`,
  },
  protected: {
    basic: `${baseUrl}/api/v1/protected`,
    admin: `${baseUrl}/api/v1/admin`,
  },
};

export default endpoints;
