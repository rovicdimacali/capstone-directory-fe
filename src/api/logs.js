import { instance as axios } from "@/utils/instance";

export const logs = {
  get: async (page = 0, search = "") => {
    let endpoint = `/activity-logs/logs/`;
    endpoint += `?page=${page + 1}`;

    if (search !== "" && search !== null && search !== undefined) {
      endpoint += `&search=${search}`;
    }
    const response = await axios.get(endpoint);
    return response.data;
  },
};
