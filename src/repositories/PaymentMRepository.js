import HTTP from "@/common/http";

const resource = "paymethods";

export default {
  async findAll(login) {
    const response = await HTTP.get(`${resource}/${login}`);
    return response.data;
  },
  async delete(id) {
    const response = await HTTP.delete(`${resource}/${id}`);
    return response.data;
  },
  async create(paymethod) {
    return (await HTTP.post(`${resource}`, paymethod)).data;
  }
};
