<template>
  <div v-if="order" class="card order-card">
    <div class="card-body">
      <router-link class="card-title" :to="{ name: 'OrderDetail', params: { orderId: order.id } }">
        Pedido {{ order.id }}
      </router-link>

      <p v-if="this.isAdmin && this.users && order.userLogin" class="card-text text-muted">
        Owner
        <router-link
          :to="{ name: 'UserOrderList', params: { userId: getUserId(order.userLogin) } }"
          >{{ order.userLogin }}</router-link
        >
      </p>
      <p class="card-text price">Price: {{ order.price }} €</p>

      <p class="card-text">Date: {{ order.purchaseDate.toLocaleDateString() }}</p>

      <p class="card-text">Status: {{ order.status }}</p>

      <p class="card-text">
        {{ order.adress.street }}, {{ order.adress.door }} {{ order.adress.portal }}
      </p>

      <p class="card-text">
        {{ order.paymentMethod.hiddenCardNumber }}
      </p>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth";

export default {
  data() {
    return {
      isAdmin: auth.isAdmin()
    };
  },
  props: {
    order: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      required: false
    }
  },
  async mounted() {},
  methods: {
    getUserId(login) {
      if (!this.users) {
        return null; // Maneja el caso en que users no esté disponible
      }
      const user = this.users.find((user) => user.login === login);
      return user ? user.id : null; // Retorna el id o null si no se encuentra
    }
  }
};
</script>

<style scoped>
.order-card {
  width: 100%;
  max-width: 18rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.order-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #007bff;
}

.btn-sm {
  font-size: 0.9rem;
}
</style>
