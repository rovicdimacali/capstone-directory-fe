import { uploadInstance as axios } from "@/utils/instance";

export const capstone = {
  get: async () => {
    const response = await axios.post("/capstone-projects/projects");
    return response.data;
  },

  create: async (obj) => {
    const response = await axios.post("/capstone-projects/projects/", obj);
    return response.data;
  },

  update: async (id, obj) => {
    const response = await axios.post(
      `/capstone-projects/projects/${id}/`,
      obj
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.post(`/capstone-projects/projects/${id}/`);
    return response.data;
  },
};
