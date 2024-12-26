import HTTP from "@/common/http";

const resource = "orders";

function applyDate(order) {
  order.purchaseDate = new Date(order.purchaseDate);
  return order;
}

export default {
  async findAll() {
    const response = await HTTP.get(`${resource}`);
    response.data.forEach(applyDate);
    return response.data;
  },
  async findOne(id) {
    return applyDate((await HTTP.get(`${resource}/${id}`)).data);
  },
  async create(orderRequest) {
    return applyDate((await HTTP.post(`${resource}`, orderRequest)).data);
  }
};
