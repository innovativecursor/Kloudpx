import { baseUrls } from "./env";

const baseUrl = baseUrls.users;

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
  details: {
    get: (id) => `${baseUrl}/v1/user/medicine-details/${id}`,
  },
  cart: {
    add: `${baseUrl}/v1/user/add-to-cart-otc`,
    get: `${baseUrl}/v1/user/get-cart`,
    remove: (id) => `${baseUrl}/v1/user/remove-item-cart/${id}`,
  },
  prescriptioncart: {
    add: `${baseUrl}/v1/user/add-to-cart-medicine`,
  },
  carousel: {
    get: `${baseUrl}/v1/user/get-carousel-img-user`,
  },
  gallery: {
    get: `${baseUrl}/v1/user/get-gallery-img-user`,
  },
  branded: {
    get: `${baseUrl}/v1/user/get-branded-medicine`,
  },
  twocategory: {
    get: `${baseUrl}/v1/user/get-two-categories-for-user`,
  },
  trending: {
    get: `${baseUrl}/v1/user/trending-medicines`,
  },
  feature: {
    get: `${baseUrl}/v1/user/get-feature-products`,
  },
  popular: {
    get: `${baseUrl}/v1/user/popular-medicines`,
  },
  search: {
    get: (query) =>
      `${baseUrl}/v1/user/search-medicine?q=${encodeURIComponent(query)}`,
  },
  prescription: {
    upload: `${baseUrl}/v1/user/upload-prescription`,
  },
};

export default endpoints;
