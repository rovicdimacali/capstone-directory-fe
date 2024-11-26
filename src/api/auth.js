import { instance as axios } from "@/utils/instance";

export const auth = {
  login: async (obj) => {
    const response = await axios.post("/users/login/", obj);
    return response.data;
  },
};
