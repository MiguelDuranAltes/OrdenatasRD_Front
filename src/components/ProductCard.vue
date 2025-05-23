<template>
  <div class="card product-card">
    <div class="card-body">
      <h5 class="card-title">{{ product.name }}</h5>

      <p class="card-text text-muted">
        Marca:
        <router-link :to="{ name: 'ProductListByBrand', params: { brand: product.brand } }">{{
          product.brand
        }}</router-link>
      </p>
      <p class="card-text price">{{ product.price }} €</p>

      <p :class="['card-text', product.availability ? 'text-success' : 'text-danger']">
        {{ product.availability ? "Disponible" : "No disponible" }}
      </p>

      <!-- Botones -->
      <div class="d-flex justify-content-between">
        <router-link
          v-if="showDetailsButton"
          class="btn btn-primary btn-sm"
          :to="'/products/' + product.id"
        >
          Detalles
        </router-link>
        <button
          v-if="!isAdmin && product.availability"
          class="btn btn-success btn-sm"
          @click="addProductToCart"
        >
          Añadir al carrito
        </button>
        <button
          v-if="!productOnList(product.id)"
          class="btn btn-success btn-sm"
          @click="addProductToWishlist"
        >
          Añadir a favoritos
        </button>
        <button
          v-if="productOnList(product.id)"
          class="btn btn-success btn-sm"
          @click="removeProductOffWishlist"
        >
          Borrar de favoritos
        </button>
        <router-link
          v-if="this.isAdmin"
          class="btn btn-warning btn-sm"
          :to="'/products/' + product.id + '/edit'"
        >
          Editar producto
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth";
import { addToCart, getStore } from "@/common/store";
import UsersRepository from "@/repositories/UsersRepository";

export default {
  data() {
    return {
      isAdmin: auth.isAdmin(),
      store: getStore()
    };
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    showDetailsButton: {
      type: Boolean,
      default: true
    },
    userwishlist: {
      type: Object,
      required: true
    }
  },
  methods: {
    addProductToCart() {
      addToCart(this.product.id); // Llama a la función para añadir el producto al carrito
      alert(`${this.product.name} añadido al carrito.`); //Se podría no hacer el alert y usar un Toast para ello habría que hacer
      //un componente Toast y llamarlo aquí
    },
    async addProductToWishlist() {
      UsersRepository.addProduct(this.store.state.user.id, this.product.id);
      this.$emit("update:wishlist");
      alert(`${this.product.name} añadido a la lista de favoritos.`);
    },
    async removeProductOffWishlist() {
      UsersRepository.removeProduct(this.store.state.user.id, this.product.id);
      this.$emit("update:wishlist");
      alert(`${this.product.name} borrado de la lista de favoritos.`);
    },
    productOnList(productId) {
      if (this.userwishlist.wishlist.length === 0) return false;
      return this.userwishlist.wishlist.some((product) => product.id === productId);
    }
  }
};
</script>

<style scoped>
.product-card {
  width: 100%;
  max-width: 18rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
.product-card:hover {
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

.text-success {
  font-weight: bold;
  color: #28a745;
}

.text-danger {
  font-weight: bold;
  color: #dc3545;
}
</style>
