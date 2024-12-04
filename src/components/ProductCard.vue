<template>
  <div class="card" style="width: 18rem">
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">
        {{ product.name }}
      </h6>
      <p class="card-text">
        {{ product.brand }}
      </p>
      <p class="card-text">
        {{ product.price }}
      </p>
      <p v-if="product.stock" class="card-text">Available</p>
      <p v-if="product.stock" class="card-text">Unavailable</p>

      <router-link v-if="showDetailsButton" class="btn btn-primary" :to="'/products/' + product.id">
        detalles
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    showDetailsButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {}
};
</script>

<style scoped>
h6::after {
  content: "\00a0 ";
}
</style>
