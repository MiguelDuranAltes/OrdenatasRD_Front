<template>
  <div class="container">
    <h1>Lista de Usuarios</h1>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col-md-4" v-for="user in users" :key="user.id">
        <div class="card mb-4">
          <div class="card-body text-center">
            <h5 class="card-title" style="color: blue">
              <router-link class="card-link" :to="'/user/' + user.id">
                {{ user.login }}
              </router-link>
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersRepository from "../repositories/UsersRepository";

export default {
  data() {
    return {
      users: []
    };
  },
  async mounted() {
    this.users = await UsersRepository.findAll();
  }
};
</script>

<style scoped>
/* Estilo para el fondo oscuro */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que el modal esté sobre el contenido */
}
/*Estilo para la caja blanca en el centro*/
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}
/* Estilo para los botones */
.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.btn-aceptar {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
.btn-aceptar:hover {
  background-color: darkred;
}
.btn-cancelar {
  background-color: grey;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
.btn-cancelar:hover {
  background-color: darkgray;
}
</style>
