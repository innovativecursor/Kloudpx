const baseURLLive = "http://localhost:10003";
const baseURLDev = "http://localhost:10003";

const isLive = false;
const baseUrl = isLive ? baseURLLive : baseURLDev;

const endpoints = {
  auth: {
    googleLogin: `${baseUrl}/v1/auth/google/callback/user`,
    getCurrentUser: `${baseUrl}/v1/user/get-current-userinfo`,
  },
  medicine:{
    get: `${baseUrl}/v1/user/get-medicines`
  }
};

export default endpoints;