<template>
  <div class="container">
    <h1>Lista de Usuarios</h1>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col-md-4" v-for="user in users" :key="user.id">
        <div class="card mb-4">
          <div class="card-body text-center">
            <h5 class="card-title" style="color: blue">
              <router-link class="card-link" :to="'/users/' + user.id">
                {{ user.login }}
              </router-link>
              <button v-if="!user.blocked" class="btn btn-aceptar" @click="changeBlocked(user)">
                Bloquear
              </button>
              <button v-if="user.blocked" class="btn btn-cancelar" @click="changeBlocked(user)">
                Desloquear
              </button>
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
  },
  methods: {
    async changeBlocked(user) {
      await UsersRepository.changeBlock(user);
      this.users = await UsersRepository.findAll();
    }
  }
};
</script>

<style scoped>
.btn-aceptar {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px 20px;
}
.btn-cancelar {
  background-color: grey;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px 20px;
}
</style>
