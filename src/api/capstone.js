import { uploadInstance as axios } from "@/utils/instance";

export const capstone = {
  get: async (
    page = 0,
    search = "",
    is_best_project = "",
    is_approved = "true",
    is_ip_registered = "",
    course = "",
    specialization = "",
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

    if (course !== "" && course !== null && course !== undefined) {
      endpoint += `&course=${course}`;
    }

    if (
      specialization !== "" &&
      specialization !== null &&
      specialization !== undefined
    ) {
      endpoint += `&specialization=${specialization}`;
    }

    if (sort_by !== "" && sort_by !== null && sort_by !== undefined) {
      endpoint += `&sort_by=${sort_by}`;
    }

    const response = await axios.get(endpoint);
    return response.data;
  },

  getArchives: async (page = 0, search = "") => {
    let endpoint = "/capstone-projects/projects/archived-projects/";
    endpoint += `?page=${page + 1}`;

    if (search !== "" && search !== null && search !== undefined) {
      endpoint += `&search=${search}`;
    }

    const response = await axios.get(endpoint);
    return response.data;
  },

  getByID: async (id) => {
    const response = await axios.get(`/capstone-projects/projects/${id}/`);
    return response.data;
  },

  create: async (obj) => {
    console.log("eto yun", obj);

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

  unarchive: async (id) => {
    const response = await axios.post(
      `/capstone-projects/projects/unarchive-project/`,
      { project_id: id }
    );
    return response.data;
  },

  approve: async (id) => {
    const response = await axios.post(`/capstone-projects/projects/approve/`, {
      project_id: id,
      is_approved: true,
    });
    return response.data;
  },

  reject: async (obj) => {
    const response = await axios.post(
      `/capstone-projects/projects/approve/`,
      obj
    );
    return response.data;
  },

  best_project: async (id) => {
    const response = await axios.post(
      `/capstone-projects/projects/best-project/`,
      {
        project_id: id,
        is_best_project: true,
      }
    );
    return response.data;
  },
  unbest_project: async (id) => {
    const response = await axios.post(
      `/capstone-projects/projects/best-project/`,
      {
        project_id: id,
        is_best_project: false,
      }
    );
    return response.data;
  },
};
