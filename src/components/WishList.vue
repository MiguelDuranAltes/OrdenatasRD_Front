<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Lista de productos</h1>

      <div>
        <router-link class="btn btn-outline-primary" :to="'/products/new'" style="margin: 5px 20px">
          Crear Producto
        </router-link>
      </div>
      <!-- Menú desplegable para ordenar -->
      <div class="dropdown">
        <button
          class="btn btn-outline-primary dropdown-toggle"
          type="button"
          id="sortDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Ordenar por
        </button>
        <ul class="dropdown-menu" aria-labelledby="sortDropdown">
          <!-- Opciones de ordenamiento -->
          <li>
            <button class="dropdown-item" @click="this.sort = 'Asc-Price'">
              Precio Ascendente
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="this.sort = 'Desc-Price'">
              Precio Descendente
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="this.sort = 'Asc-Name'">Nombre Ascendente</button>
          </li>
          <li>
            <button class="dropdown-item" @click="this.sort = 'Desc-Name'">
              Nombre Descendente
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="product in orderedProducts" :key="product.id">
        <ProductCard :product="product" :userwishlist="this.userWishlist"></ProductCard>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "./ProductCard.vue";
import UsersRepository from "@/repositories/UsersRepository";
import { getStore } from "@/common/store";

export default {
  data() {
    return {
      userWishlist: {
        wishlist: []
      },
      sort: "Normal",
      store: getStore()
    };
  },
  computed: {
    orderedProducts() {
      const productos = [...this.userWishlist.wishlist];
      if (this.sort === "Asc-Price") {
        return productos.sort((a, b) => a.price - b.price);
      }
      if (this.sort === "Desc-Price") {
        return productos.sort((a, b) => b.price - a.price);
      }
      if (this.sort === "Asc-Name") {
        return productos.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (this.sort === "Desc-Name") {
        return productos.sort((a, b) => b.name.localeCompare(a.name));
      }
      return productos;
    }
  },
  components: { ProductCard },
  async mounted() {
    this.userWishlist = await UsersRepository.getWishlist(this.store.state.user.id);
    console.log(this.userWishlist);
  }
};
</script>

<style scoped>
.container {
  position: relative;
}

/* Estilo para el dropdown */
.dropdown {
  position: relative;
}

.dropdown-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.dropdown-item {
  padding: 10px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #e9ecef;
  color: #000;
}
</style>
