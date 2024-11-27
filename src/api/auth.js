import { instance as axios } from "@/utils/instance";

export const auth = {
  login: async (obj) => {
    const response = await axios.post("/users/login/", obj);
    return response.data;
  },

  me: async () => {
    const response = await axios.get("/users/me/");
    return response.data;
  },

  forgotpassword: async (obj) => {
    const response = await axios.post("/users/forgot-password/", obj);
    return response.data;
  },

  resetPassword: async (obj) => {
    const response = await axios.post("/users/reset-password/", obj);
    return response.data;
  },

  changePassword: async (obj) => {
    const response = await axios.post("/users/change-password/", obj);
    return response.data;
  },
};
