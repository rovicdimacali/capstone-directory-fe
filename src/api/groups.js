import { instance as axios } from "@/utils/instance";

export const groups = {
  getGroups: async (search, course, academic_year) => {
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    if (course) {
      params.append("course", course);
    }

    if (academic_year) {
      params.append("academic_year", academic_year);
    }

    const endpoint = `/users/groups/?${params.toString()}`;
    const response = await axios.get(endpoint);
    return response.data;
  },

  getGroup: async (id) => {
    const response = await axios.get(`/users/groups/${id}/`);
    return response.data;
  },

  createGroup: async (obj) => {
    const response = await axios.post(`/users/groups/`, obj);
    return response.data;
  },

  assignMembers: async (obj) => {
    const response = await axios.post(`/users/groups/bulk-assign/`, obj);
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
