<template>
  <div class="product-detail-container">
    <h1 class="text-center my-4">Detalle del producto {{ this.$route.params.productId }}</h1>

    <div v-if="product" class="product-detail">
      <div class="product-info">
        <div class="info-item">
          <span class="label">Nombre:</span>
          <span class="value">{{ product.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">Descripción:</span>
          <span class="value description">{{ product.description }}</span>
        </div>
        <div class="info-item">
          <span class="label">Precio:</span>
          <span class="value">{{ product.price }} €</span>
        </div>
        <div class="info-item">
          <span class="label">Marca:</span>
          <span class="value">{{ product.brand }}</span>
        </div>
        <div class="info-item">
          <span class="label">Stock:</span>
          <span class="value">{{ product.availability }} unidades</span>
        </div>
      </div>

      <div class="action-buttons">
        <button
          v-if="!this.isAdmin && product.availability"
          class="btn btn-success btn-sm"
          @click="addProductToCart"
        >
          Añadir al carrito
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
    <div v-else class="loading">Cargando el producto...</div>
  </div>
</template>

<script>
import ProductRepository from "@/repositories/ProductRepository.js";
import auth from "@/common/auth.js";
import { addToCart } from "@/common/store";

export default {
  data() {
    return {
      product: null,
      isAdmin: auth.isAdmin()
    };
  },
  async mounted() {
    this.product = await ProductRepository.findOne(this.$route.params.productId);
  },
  methods: {
    addProductToCart() {
      addToCart(this.product.id); // Llama a la función para añadir el producto al carrito
      alert(`${this.product.name} añadido al carrito.`); //Se podría no hacer el alert y usar un Toast para ello habría que hacer
      //un componente Toast y llamarlo aquí
    }
  }
};
</script>

<style scoped>
.product-detail-container {
  background-color: #f4f6f9; /* Fondo suave y limpio */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Sombra más suave para profundidad */
  max-width: 900px;
  margin: 40px auto;
  text-align: center;
}

h1 {
  color: #333;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.product-detail {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  color: #555;
}

.label {
  font-weight: bold;
  color: #333;
  width: 40%; /* Etiquetas con mayor ancho */
}

.value {
  color: #007bff;
  font-weight: 500;
  text-align: right;
  width: 55%;
}

.description {
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  line-height: 1.5;
  color: #666;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  color: #fff;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-warning {
  background-color: #ffc107;
  border: none;
  color: #333;
  transition: background-color 0.3s ease;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.loading {
  color: #555;
  font-size: 1.2rem;
  text-align: center;
}
</style>
