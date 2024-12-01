import { uploadInstance as axios } from "@/utils/instance";

export const capstone = {
  get: async (
    page = 0,
    search = "",
    is_best_project = "",
    is_approved = "true",
    is_ip_registered = "",
    course = "",
    sort_by = ""
  ) => {
    let endpoint = "/capstone-projects/projects/";
    endpoint += `?page=${page + 1}`;

    if (search !== "" && search !== null && search !== undefined) {
      endpoint += `&search=${search}`;
    }

    if (
      is_approved !== "" &&
      is_approved !== null &&
      is_approved !== undefined
    ) {
      endpoint += `&is_approved=${is_approved}`;
    }

    if (
      is_ip_registered !== "" &&
      is_ip_registered !== null &&
      is_ip_registered !== undefined
    ) {
      endpoint += `&is_ip_registered=${is_ip_registered}`;
    }

    if (
      is_best_project !== "" &&
      is_best_project !== null &&
      is_best_project !== undefined
    ) {
      endpoint += `&is_best_project=${is_best_project}`;
    }

    if (sort_by !== "" && sort_by !== null && sort_by !== undefined) {
      endpoint += `&sort_by=${sort_by}`;
    }

    if (course !== "" && course !== null && course !== undefined) {
      endpoint += `&course=${course}`;
    }

    const response = await axios.get(endpoint);
    return response.data;
  },

  getByID: async (id) => {
    const response = await axios.get(`/capstone-projects/projects/${id}/`);
    return response.data;
  },

  create: async (obj) => {
    const response = await axios.post("/capstone-projects/projects/", obj);
    return response.data;
  },

  update: async (id, obj) => {
    const response = await axios.patch(
      `/capstone-projects/projects/${id}/`,
      obj
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/capstone-projects/projects/${id}/`);
    return response.data;
  },
};