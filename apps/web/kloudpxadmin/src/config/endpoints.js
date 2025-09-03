import { baseUrls } from "../../../../config/env";

const baseUrl = baseUrls.admin;

const endpoints = {
  auth: {
    googleLogin: `${baseUrl}/v1/auth/google/callback`,
    refresh: `${baseUrl}/v1/auth/refresh`,
    getCurrentUser: `${baseUrl}/v1/admin/admin-info`,
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
  categoryIcons: {
    get: `${baseUrl}/v1/category/get-all-category-icon`,
  },
  assignIcon: {
    add: `${baseUrl}/v1/category/assign-icon`,
  },
  medicine: {
    getAll: `${baseUrl}/v1/medicine/get-all-medicine`,
    add: `${baseUrl}/v1/medicine/add-medicine`,
    update: (id) => `${baseUrl}/v1/medicine/update-medicine/${id}`,
    delete: (id) => `${baseUrl}/v1/medicine/delete-medicine/${id}`,
    search: `${baseUrl}/v1/medicine/search-medicine`,
  },
  pwd: {
    getAll: `${baseUrl}/v1/admin/pending-pwds`,
    getone: (id) => `${baseUrl}/v1/admin/pwd/${id}`,
    verify: `${baseUrl}/v1/admin/verify-pwd`,
  },
  seniorcitizen: {
    getAll: `${baseUrl}/v1/admin/senior`,
    getone: (id) => `${baseUrl}/v1/admin/senior/${id}`,
  },
  prescription: {
    getAll: `${baseUrl}/v1/admin/prescription-summary`,
    getone: (id) => `${baseUrl}/v1/admin/prescriptions/history/${id}`,
  },
  itemimage: {
    add: `${baseUrl}/v1/itemimage/add-itemimage`,
    delete: (id) => `${baseUrl}/v1/itemimage/delete-itemimage/${id}`,
  },
  carousel: {
    get: `${baseUrl}/v1/carousel/get-all-carousel-img`,
    add: `${baseUrl}/v1/carousel/add-carousel-img`,
    updateStatus: (id) => `${baseUrl}/v1/carousel/update-status/${id}`,
    delete: (id) => `${baseUrl}/v1/carousel/delete-carousel-img/${id}`,
  },
  userCount: {
    get: `${baseUrl}/v1/admin/admin-dash-userinfo`,
  },
  medicineCount: {
    get: `${baseUrl}/v1/admin/admin-dash-medicinecount`,
  },
  gallery: {
    get: `${baseUrl}/v1/gallery/get-all-gallery-img`,
    add: `${baseUrl}/v1/gallery/add-gallery-img`,
    updateStatus: (id) => `${baseUrl}/v1/gallery/update-status/${id}`,
    delete: (id) => `${baseUrl}/v1/gallery/delete-gallery-img/${id}`,
  },
  uploadExcel: {
    add: `${baseUrl}/v1/excel/upload-excel`,
  },
  admininfo: {
    get: `${baseUrl}/v1/admin/admin-info`,
  },
  download: {
    get: `${baseUrl}/v1/excel/download-excel`,
  },
  allorders: {
    get: `${baseUrl}/v1/admin/order-history`,
  },
  orderdetails: {
    get: (id) => `${baseUrl}/v1/admin/order-details/${id}`,
  },
  updateOrder: {
    put: (id) => `${baseUrl}/v1/admin/update-order-details/${id}`,
  },
  regionSettings: {
    getAll: `${baseUrl}/v1/admin/get-region-settings`,
    upsert: `${baseUrl}/v1/admin/region-settings`,
  },
  protected: {
    basic: `${baseUrl}/api/v1/protected`,
    admin: `${baseUrl}/api/v1/admin`,
  },
};

export default endpoints;
