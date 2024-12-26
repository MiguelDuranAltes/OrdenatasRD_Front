<template>
  <div v-if="orders && user" class="container">
    <div>
      <h1>Lista de pedidos de {{ user.login }}</h1>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="order in orders" :key="order.id">
        <OrderCard :order="order"></OrderCard>
      </div>
    </div>
  </div>
</template>

<script>
import UsersRepository from "@/repositories/UsersRepository";
import OrderCard from "./OrderCard.vue";

export default {
  data() {
    return {
      orders: [],
      user: null
    };
  },
  components: {
    OrderCard
  },
  async mounted() {
    this.user = await UsersRepository.findById(this.$route.params.userId);
    this.orders = await UsersRepository.findOne(this.$route.params.userId);
  }
};
</script>
