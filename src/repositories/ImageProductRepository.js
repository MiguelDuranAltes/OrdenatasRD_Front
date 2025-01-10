import HTTP from "@/common/http";

const resource = "products";

export default {
  async getImage(id) {
    const response = await HTTP.get(`${resource}/${id}/imagen`);
    return response.data;
  },
  async saveImage(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await HTTP.post(`${resource}/${id}/imagen`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  },
  async deleteImage(id) {
    const response = await HTTP.delete(`${resource}/${id}/imagen`);
    return response.data;
  }
};
