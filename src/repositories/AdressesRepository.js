import HTTP from "@/common/http";

const resource = "adresses";

export default {
  async findAll(userId) {
    const response = await HTTP.get(`${resource}/${userId}`);
    return response.data;
  }
};
