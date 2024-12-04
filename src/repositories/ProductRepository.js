import HTTP from "@/common/http";

const resource = "products";

export default {
  async findAll() {
    const response = await HTTP.get(`${resource}`);
    return response.data;
  },
  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },
  async save(product) {
    return (await HTTP.put(`${resource}/${product.id}`, product)).data;
  }
};
