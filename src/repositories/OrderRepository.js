import HTTP from "@/common/http";

const resource = "orders";

export default {
  async findAll() {
    const response = await HTTP.get(`${resource}`);
    return response.data;
  },
  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },
  async create(orderRequest) {
    return (await HTTP.post(`${resource}`, orderRequest)).data;
  }
};
