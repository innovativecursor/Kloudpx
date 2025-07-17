// const baseURLLive = "http://localhost:10003";
// const baseURLDev = "http://localhost:10003";

// const isLive = false;
// const baseUrl = isLive ? baseURLLive : baseURLDev;

const endpoints = {
  auth: {
    googleLogin: `/v1/auth/google/callback/user`,
    getCurrentUser: `/v1/user/get-current-userinfo`,
  },
  medicine: {
    get: `/v1/user/get-medicines`,
  },
  category: {
    getAll: `/v1/user/get-categories-for-user`,
    getItemsByCategory: (id) => `/v1/user/get-items-by-categories/${id}`,
  },
  details: {
    get: (id) => `http://localhost:10003/v1/user/medicine-details/${id}`,
  },
  cart: {
    add: `/v1/user/add-to-cart-otc`,
    get: `/v1/user/get-cart`,
    remove: (id) => `/v1/user/remove-item-cart/${id}`,
  },
  prescriptioncart: {
    add: `/v1/user/add-to-cart-medicine`,
  },
  carousel: {
    get: `/v1/user/get-carousel-img-user`,
  },
  gallery: {
    get: `/v1/user/get-gallery-img-user`,
  },
  branded: {
    get: `/v1/user/get-branded-medicine`,
  },
  twocategory: {
    get: `/v1/user/get-two-categories-for-user`,
  },
  trending: {
    get: `/v1/user/trending-medicines`,
  },
  search: {
    get: (query) => `/v1/user/search-medicine?q=${encodeURIComponent(query)}`,
  },
  prescription: {
    upload: `/v1/user/upload-prescription`,
  },
};

export default endpoints;
