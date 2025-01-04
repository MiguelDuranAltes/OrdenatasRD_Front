<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/products"> OrdenatasRD 2024/2025 </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="store.state.user.logged">
          <li class="nav-item">
            <router-link class="btn btn-success btn-sm" :to="'/products'" style="margin: 5px 20px">
              Lista Productos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              v-if="auth.isAdmin()"
              class="btn btn-success btn-sm"
              :to="'/users'"
              style="margin: 5px 20px"
            >
              Lista Usuarios
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="btn btn-success btn-sm" style="margin: 5px 20px" :to="'/orders/'">
              Lista de pedidos
            </router-link>
          </li>
        </ul>
        <router-link
          class="nav-link"
          to="/cart"
          v-if="store.state.user.logged && !auth.isAdmin()"
          style="margin: 5px 20px"
        >
          <img src="/src/assets/cart.png" alt="cart" width="30" height="30" />
        </router-link>
        <span v-if="store.state.user.logged"> autenticado como {{ store.state.user.login }} </span>
        <ul class="navbar-nav">
          <!-- <li class="nav-item" v-if="!store.state.user.logged">
            <router-link class="nav-link" to="/login" active-class="active">
              Login
            </router-link>
          </li> -->
          <li class="nav-item" v-if="store.state.user.logged">
            <a class="nav-link" @click="desautenticarme()"> Logout </a>
          </li>
        </ul>
        <li class="nav-item">
          <router-link
            style="margin: 5px 20px"
            :to="'/users/' + store.state.user.id"
            v-if="store.state.user.logged"
          >
            <img src="/src/assets/perf.png" alt="perfil" width="30" height="30" />
          </router-link>
        </li>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script>
import { getStore, clearCart } from "./common/store";
import auth from "./common/auth";

export default {
  data() {
    return {
      auth: auth,
      store: getStore()
    };
  },
  methods: {
    desautenticarme() {
      auth.logout();
      clearCart();
      this.$router.push("/");
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}

/* fixing popper warning in bootstrap 5.2: */
.dropdown-menu {
  margin-top: 0px !important;
}
</style>
