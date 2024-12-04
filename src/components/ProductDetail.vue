<template>
  <div>
    <h1>Detalle de un producto</h1>
    <div v-if="producto">
      <div>
        <span>Nombre: </span>
        <span>{{ producto.nombre }}</span>
      </div>
      <div>
        <span>Descripcion: </span>
        <span>{{ producto.description }}</span>
      </div>
      <div>
        <span>Precio: </span>
        <span>{{ producto.price }}</span>
      </div>
      <div>
        <span>Brand: </span>
        <span>{{ producto.brand }}</span>
      </div>
      <div>
        <span>Stock: </span>
        <span>{{ producto.availability }}</span>
      </div>
    </div>
    <div v-else>Cargando el producto...</div>
  </div>
</template>

<script>
import ProductRepository from "@/repositories/ProductRepository.js";
import auth from "@/common/auth.js";

export default {
  data() {
    return {
      producto: null,
      isAdmin: auth.isAdmin()
    };
  },
  async mounted() {
    console.log("Este es el id", this.$route.params.productId);
    this.producto = await ProductRepository.findOne(this.$route.params.productId);
    console.log("Este es el producto", this.producto);
  }
};
</script>
