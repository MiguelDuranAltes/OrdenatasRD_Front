import HTTP from "@/common/http";

const resource = "users";

export default {
  async findAll() {
    const response = await HTTP.get(`${resource}`);
    return response.data;
  },
  async findById(id) {
    const response = await HTTP.get(`${resource}/${id}`);
    return response.data;
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
  }
};
