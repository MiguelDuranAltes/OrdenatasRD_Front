<template>
  <div class="container">
    <h1>Carrito de compra</h1>
    <div class="row">
      <div class="product-list">
        <div class="product-card" v-for="product in products" :key="product.id">
          <router-link
            :to="{ name: 'ProductDetail', params: { productId: product.id } }"
            class="list-group-item list-group-item-action"
          >
            {{ product.name }}
          </router-link>
          <p>Precio: {{ product.price }}€</p>
          <input
            type="number"
            class="form-control"
            id="quantity"
            v-model.number="getQuantity(product.id).quantity"
            @input="updateQuantity(product.id, getQuantity(product.id).quantity)"
            min="1"
          />
          <div class="d-flex justify-content-between mt-2">
            <button class="btn btn-danger btn-sm" @click="removeProductFromCart(product.id)">
              Eliminar
            </button>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 text-end">
          <h3>Total: {{ this.total }} €</h3>
        </div>
        <div class="d-flex justify-content-center gap-3">
          <router-link class="btn btn-danger" to="/products"> Cancelar </router-link>
          <button class="btn btn-primary" @click="makeOrder()">Realizar pedido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStore, removeFromCart } from "@/common/store";
import ProductRepository from "@/repositories/ProductRepository";

export default {
  data() {
    return {
      cart: null,
      products: []
    };
  },
  async mounted() {
    this.cart = getStore().state.cart;
    console.log(this.cart);
    const allProducts = await ProductRepository.findAll();
    this.products = allProducts.filter((product) =>
      this.cart.some((cartItem) => cartItem.productId === product.id)
    );
  },
  computed: {
    total() {
      return this.getTotal();
    }
  },
  methods: {
    getQuantity(productId) {
      return this.cart.find((cartItem) => cartItem.productId === productId);
    },
    updateQuantity(productId, newQuantity) {
      const cartItem = this.cart.find((item) => item.productId === productId);
      if (cartItem) {
        cartItem.quantity = newQuantity;
      }
    },
    removeProductFromCart(productId) {
      removeFromCart(productId);
      this.products = this.products.filter((product) => product.id !== productId);
      this.cart = this.cart.filter((cartItem) => cartItem.productId !== productId);
    },
    getTotal() {
      return this.products
        .reduce((total, product) => {
          const cartItem = this.cart.find((item) => item.productId === product.id);
          if (cartItem) {
            total += product.price * cartItem.quantity;
          }
          return total;
        }, 0)
        .toFixed(2);
    },
    makeOrder() {
      console.log("Pedido realizado");
      this.$router.push("/orders/new");
    }
  }
};
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: center; /* Centrar los componentes horizontalmente */
  align-items: flex-start; /* Alinear los componentes con la parte superior */
  gap: 20px; /* Espacio entre las tarjetas */
  margin-top: 40px; /* Separación del componente superior */
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: #f9f9f9;
}

.flex-item {
  flex: 1; /* Ambos elementos ocuparán el mismo espacio */
  max-width: 300px;
}
</style>
