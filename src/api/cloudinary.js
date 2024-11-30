import axios from "axios";

export const cloudinary = {
  upload: async (obj) => {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      obj
    );
    return response.data;
  },
};
