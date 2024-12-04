import { instance as axios } from "@/utils/instance";

export const notification = {
  get: async () => {
    const response = await axios.get("/notifications/");
    return response.data;
  },

  mark_read: async (id) => {
    const response = await axios.post("/notifications/mark-as-read/", {
      notification_id: id,
    });
    return response.data;
  },
};
