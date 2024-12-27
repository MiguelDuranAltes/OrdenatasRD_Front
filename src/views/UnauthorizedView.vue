<template>
  <div>
    <div>
      <h1>401</h1>

      <h3>Has intentando entrar en una ruta de otro usuario</h3>

      <h2>¡No tienes permisos para esa ruta!</h2>

      <router-link to="/" custom v-slot="{ href }">
        <a type="button" class="btn btn-secondary" :href="href"> Go Home </a>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 30vh;
}
h2,
h3 {
  opacity: 0.6;
}
</style>
