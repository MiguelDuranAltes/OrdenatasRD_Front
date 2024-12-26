<template>
  <div v-if="orders" class="container">
    <div>
      <h1>Lista de pedidos</h1>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="order in orders" :key="order.id">
        <OrderCard :order="order" :users="this.users"></OrderCard>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth";
import OrderCard from "./OrderCard.vue";
import OrderRepository from "@/repositories/OrderRepository";
import UsersRepository from "@/repositories/UsersRepository";

export default {
  data() {
    return {
      orders: [],
      users: null,
      isAdmin: auth.isAdmin()
    };
  },
  components: {
    OrderCard
  },
  async mounted() {
    this.orders = await OrderRepository.findAll();
    if (this.isAdmin) {
      this.users = await UsersRepository.findAll();
    }
  }
};
</script>
