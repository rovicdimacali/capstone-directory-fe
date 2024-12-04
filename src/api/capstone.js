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
    const formData = new FormData();

    // Append each key in the object to FormData
    for (const key in uploadForm) {
      if (uploadForm[key] !== null && uploadForm[key] !== undefined) {
        if (Array.isArray(uploadForm[key])) {
          // Special handling for arrays
          if (key === "members") {
            // For `members`, append as a single JSON string
            formData.append(key, JSON.stringify(uploadForm[key]));
          } else {
            // For other arrays, append each value separately
            uploadForm[key].forEach((item) =>
              formData.append(`${key}[]`, item)
            );
          }
        } else {
          // Append other fields as single values
          formData.append(key, uploadForm[key]);
        }
      }
    }

    const response = await axios.post("/capstone-projects/projects/", formData);
    return response.data;
  },

  update: async (id, obj) => {
    const formData = new FormData();

    for (const key in uploadForm) {
      if (uploadForm[key] !== null && uploadForm[key] !== undefined) {
        if (Array.isArray(uploadForm[key])) {
          // Special handling for arrays
          if (key === "members") {
            // For `members`, append as a single JSON string
            formData.append(key, JSON.stringify(uploadForm[key]));
          } else {
            // For other arrays, append each value separately
            uploadForm[key].forEach((item) =>
              formData.append(`${key}[]`, item)
            );
          }
        } else {
          // Append other fields as single values
          formData.append(key, uploadForm[key]);
        }
      }
    }

    const response = await axios.patch(
      `/capstone-projects/projects/${id}/`,
      formData
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/capstone-projects/projects/${id}/`);
    return response.data;
  },

  approve: async (id) => {
    const response = await axios.post(`/capstone-projects/projects/approve/`, {
      project_id: id,
      is_approved: true,
    });
    return response.data;
  },

  reject: async (id) => {
    const response = await axios.post(`/capstone-projects/projects/approve/`, {
      project_id: id,
      is_approved: null,
    });
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
};
