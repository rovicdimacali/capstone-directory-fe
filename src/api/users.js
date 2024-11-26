import {
  instance as axios,
  uploadInstance as axiosUpload,
} from "@/utils/instance";

export const users = {
  getUsers: async (page = 0, search = "") => {
    let endpoint = `/users/user-view/`;
    endpoint += `?page=${page + 1}`;

    if (search !== "" && search !== null && search !== undefined) {
      endpoint += `&search="${search}"`;
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
};
