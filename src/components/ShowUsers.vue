<template>
  <div class="container">
    <h1>Lista de Usuarios</h1>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col-md-4" v-for="user in users" :key="user.id">
        <div class="card mb-4">
          <div class="card-body text-center">
            <h5 class="card-title" style="color: blue">
              {{ user.login }}
            </h5>
          </div>
        </div>
        <button v-if="!user.blocked" class="btn btn-bloquear" @click="changeBlocked(user)">
          Bloquear
        </button>
        <button v-if="user.blocked" class="btn btn-bloquear" @click="changeBlocked(user)">
          Desbloquear
        </button>
        <button class="btn btn-eliminar" @click="eliminar(user.id)">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script>
import UsersRepository from "../repositories/UsersRepository";
import { getStore } from "@/common/store";

export default {
  data() {
    return {
      users: [],
      store: getStore()
    };
  },
  async mounted() {
    try {
      this.users = await UsersRepository.findAll();
    } catch (error) {
      console.log(error);
    }
    this.users = this.users.filter((user) => user.id !== this.store.state.user.id);
  },
  methods: {
    async changeBlocked(user) {
      try {
        await UsersRepository.changeBlock(user);
        this.users = await UsersRepository.findAll();
        this.users = this.users.filter((user) => user.id !== this.store.state.user.id);
      } catch (error) {
        console.log(error);
      }
    },
    async eliminar(id) {
      try {
        await UsersRepository.delete(id);
        this.users = this.users.filter((user) => user.id !== id);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.btn-eliminar {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px 20px;
  margin-top: 1px;
  margin-bottom: 30px;
}
.btn-bloquear {
  background-color: hwb(209 20% 5%);
  color: white;
  border: none;
  /*padding para dimensiones del botón*/
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  /*front-size para tamaño de la letra del botón y el botón en general*/
  font-size: 16px;
  margin: 10px 20px;
  margin-top: 1px;
  margin-bottom: 30px;
}
</style>
