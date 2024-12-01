import { instance as axios } from "@/utils/instance";

export const groups = {
  getGroups: async () => {
    const response = await axios.get("users/groups/");
    return response.data;
  },

  getGroup: async (id) => {
    const response = await axios.get(`users/groups/${id}/`);
    return response.data;
  },

  createGroup: async (obj) => {
    const response = await axios.post(`/users/groups/`, obj);
    return response.data;
  },

  updateGroup: async (id, obj) => {
    const response = await axios.patch(`/users/groups/${id}/`, obj);
    return response.data;
  },

  deleteGroup: async (id) => {
    const response = await axios.delete(`/users/groups/${id}/`);
    return response.data;
  },
};
