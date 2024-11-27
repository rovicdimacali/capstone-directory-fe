import {
  instance as axios,
  uploadInstance as axiosUpload,
} from "@/utils/instance";

export const users = {
  getUsers: async (page = 0, search = "", course = "", role = "") => {
    let endpoint = `/users/user-view/`;
    endpoint += `?page=${page + 1}`;

    if (search !== "" && search !== null && search !== undefined) {
      endpoint += `&search=${search}`;
    }

    if (course !== "" && course !== null && course !== undefined) {
      endpoint += `&course=${course}`;
    }

    if (role !== "" && role !== null && role !== undefined) {
      endpoint += `&role=${role}`;
    }

    const response = await axios.get(endpoint);
    return response.data;
  },

  uploadUsers: async (obj) => {
    const response = await axiosUpload.post(
      "/users/user-view/upload-users/",
      obj
    );
    return response.data;
  },

  updateUser: async (id, obj) => {
    const response = await axios.patch(`/users/user-view/${id}/`, obj);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`/users/user-view/${id}/`);
    return response.data;
  },
};
