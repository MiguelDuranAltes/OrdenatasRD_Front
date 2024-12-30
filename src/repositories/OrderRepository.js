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
  async findOneWithProducts(id) {
    const response = await HTTP.get(`${resource}/${id}/products`);
    return response.data;
    //return applyDate((await HTTP.get(`${resource}/${id}/products`)).data);
  },
  async create(orderRequest) {
    return applyDate((await HTTP.post(`${resource}`, orderRequest)).data);
  },
  async update(updatedOrder) {
    return applyDate((await HTTP.put(`${resource}/${updatedOrder.id}`, updatedOrder)).data);
  },
  async cancell(cancelation) {
    return applyDate(
      (await HTTP.post(`${resource}/${cancelation.orderId}/cancel`, cancelation)).data
    );
  },
  async return(returnedOrder) {
    return applyDate(
      (await HTTP.post(`${resource}/${returnedOrder.orderId}/return`, returnedOrder)).data
    );
  }
};
