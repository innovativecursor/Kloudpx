import { baseUrls } from "../../../config/env";

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
    sortBy: (id) => `${baseUrl}/v1/user/sort-by/${id}`,
    priceDiscountFilter: (id) =>
      `${baseUrls.users}/v1/user/price-discount-filter/${id}`,
  },
  details: {
    get: (id) => `${baseUrl}/v1/user/medicine-details/${id}`,
  },
  cart: {
    add: `${baseUrl}/v1/user/add-to-cart-otc`,
    get: `${baseUrl}/v1/user/get-cart`,
    remove: (id) => `${baseUrl}/v1/user/remove-item-cart/${id}`,
    saveForLater: `${baseUrl}/v1/user/save-for-later`,
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
    // get: `${baseUrl}/v1/user/get-branded-medicine`,
    get: `${baseUrl}/v1/user/get-all-brands`,
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
  checkout: {
    get: `${baseUrl}/v1/user/check-out`,
  },
  address: {
    add: `${baseUrl}/v1/user/add-update-address`,
    get: `${baseUrl}/v1/user/get-address`,
  },
  selectedAddress: {
    add: `${baseUrl}/v1/user/select-address`,
  },
  deliveryType: {
    add: `${baseUrl}/v1/user/select-delivery-type`,
  },
  filters: {
    get: `${baseUrl}/v1/user/filter`,
  },
  sorting: {
    get: `${baseUrl}/v1/user/sorting`,
  },
  prescription: {
    upload: `${baseUrl}/v1/user/upload-prescription`,
  },
};

export default endpoints;
