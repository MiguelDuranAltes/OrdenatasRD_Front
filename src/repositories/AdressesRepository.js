import HTTP from "@/common/http";

const resource = "adresses";

export default {
  async findAll(login) {
    const response = await HTTP.get(`${resource}/${login}`);
    return response.data;
  }
};
