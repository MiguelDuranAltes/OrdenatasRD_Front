import HTTP from "@/common/http";

const resource = "users";

function applyDate(order) {
  order.purchaseDate = new Date(order.purchaseDate);
  return order;
}

export default {
  async findAll() {
    const response = await HTTP.get(`${resource}`);
    return response.data;
  },
  async findById(id) {
    const response = await HTTP.get(`${resource}/${id}`);
    return response.data;
  },
  async findOne(id) {
    const response = await HTTP.get(`${resource}/${id}/orders`);
    response.data.orders.forEach(applyDate);
    return response.data.orders;
  },
  async changeBlock(user) {
    if (user.blocked) {
      return (await HTTP.delete(`${resource}/${user.id}/block`)).data;
    } else {
      return (await HTTP.put(`${resource}/${user.id}/block`)).data;
    }
  },
  async delete(id) {
    const response = await HTTP.delete(`${resource}/${id}`);
    return response.data;
  },
  async addProduct(id, productId) {
    const response = await HTTP.post(`${resource}/${id}/wishlist/${productId}`);
    return response.data;
  },
  async removeProduct(id, productId) {
    const response = await HTTP.delete(`${resource}/${id}/wishlist/${productId}`);
    return response.data;
  },
  async getWishlist(id) {
    const response = await HTTP.get(`${resource}/${id}/wishlist`);
    return response.data;
  }
};
