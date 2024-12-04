<template>
  <div class="container">
    <h1>Lista de productos</h1>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="product in products" :key="product.id">
        <ProductCard :product="product"></ProductCard>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "./ProductCard.vue";
import ProductRepository from "../repositories/ProductRepository";

export default {
  data() {
    return {
      products: []
    };
  },
  components: { ProductCard },
  async mounted() {
    this.products = await ProductRepository.findAll();
  }
};
</script>
