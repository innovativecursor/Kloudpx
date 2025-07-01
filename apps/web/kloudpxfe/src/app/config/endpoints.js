const baseURLLive = "http://localhost:10003";
const baseURLDev = "http://localhost:10003";

const isLive = false;
const baseUrl = isLive ? baseURLLive : baseURLDev;

const endpoints = {
  auth: {
    googleLogin: `${baseUrl}/v1/auth/google/callback/user`,
    getCurrentUser: `${baseUrl}/v1/user/get-current-userinfo`,
  },
  medicine: {
    get: `${baseUrl}/v1/user/get-medicines`,
  },
  category: {
    getAll: `${baseUrl}/v1/user/get-categories-for-user`,
    getItemsByCategory: (id) =>
      `${baseUrl}/v1/user/get-items-by-categories/${id}`,
  },
  cart: {
    add: `${baseUrl}/v1/user/add-to-cart`,
    get: `${baseUrl}/v1/user/get-cart`,
    remove: (id) => `${baseUrl}/v1/user/remove-item-cart/${id}`,
  },
};

export default endpoints;
