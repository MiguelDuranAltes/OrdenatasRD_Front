<template>
  <div class="user-info-container">
    <!--IMAGEN-->

    <div class="user-image">
      <img :src="userImage" alt="User Image" class="profile-image" />
    </div>

    <div class="user-info">
      <div class="user-detail">
        <div class="info-item flex-column align-items-start">
          <div class="label">Login:</div>
          <div class="value">{{ this.login }}</div>
        </div>
      </div>
    </div>

    <div class="d-flex">
      <div v-if="adresses && adresses.length" class="card pay-Adress-card flex-item">
        <div class="card-body">
          <!-- Desplegable -->
          <label for="adress-select" class="form-label">Direcciones</label>
          <select id="adress-select" v-model="selectedAdressId" class="form-select">
            <option v-for="adress in adresses" :key="adress.id" :value="adress.id">
              {{ adress.street }}, {{ adress.door }} {{ adress.portal }}
            </option>
          </select>
          <span
            v-if="selectedAdressId && !isAdmin"
            @click="borrarAdress"
            style="
              cursor: pointer;
              color: red;
              text-decoration: underline;
              margin-top: 10px;
              display: inline-block;
            "
          >
            Delete
          </span>
          <button v-if="!isAdmin" class="btn btn-primary btn-sm" @click="addNewAddress">
            Add New
          </button>
        </div>
      </div>

      <div v-if="payMethods && payMethods.length" class="card pay-Adress-card flex-item">
        <div class="card-body">
          <!-- Desplegable -->
          <label for="adress-select" class="form-label">Métodos de Pago</label>
          <select id="adress-select" v-model="selectedMethodId" class="form-select">
            <option v-for="method in payMethods" :key="method.id" :value="method.id">
              {{ method.hiddenCardNumber }}
            </option>
          </select>
          <span
            v-if="selectedMethodId && !isAdmin"
            @click="borrarMethod"
            style="
              cursor: pointer;
              color: red;
              text-decoration: underline;
              margin-top: 10px;
              display: inline-block;
            "
          >
            Delete
          </span>
          <button v-if="!isAdmin" class="btn btn-primary btn-sm" @click="addNewMethod">
            Add New
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth.js";
import AdressesRepository from "@/repositories/AdressesRepository";
import PaymentMRepository from "@/repositories/PaymentMRepository";
import UserRepository from "@/repositories/UsersRepository";
import { getStore } from "@/common/store";
import defaultImage from "@/assets/logo.png";

export default {
  data() {
    return {
      login: null,
      user: null,
      payMethods: [],
      adresses: [],
      selectedAdressId: null,
      userImage: defaultImage,
      isAdmin: auth.isAdmin()
    };
  },
  async mounted() {
    if (this.isAdmin) {
      this.user = await UserRepository.findById(this.$route.params.userId);
      this.login = this.user.login;
    } else {
      this.login = getStore().state.user.login;
    }
    this.payMethods = await PaymentMRepository.findAll(this.login);
    this.adresses = await AdressesRepository.findAll(this.login);
    if (this.adresses.length > 0) {
      this.selectedAdressId = this.adresses[0].id;
    }
    if (this.payMethods.length > 0) {
      this.selectedMethodId = this.payMethods[0].id;
    }
  },
  computed: {
    // Obtener la dirección seleccionada basada en el ID
    selectedAdress() {
      return this.adresses.find((adress) => adress.id === this.selectedAdressId) || {};
    },
    selectedMethod() {
      return this.payMethods.find((method) => method.id === this.selectedMethodId) || {};
    }
  },
  methods: {
    borrarAdress() {
      AdressesRepository.delete(this.selectedAdressId);
      this.adresses = this.adresses.filter((adress) => adress.id !== this.selectedAdressId);
      this.selectedAdressId = this.adresses.length > 0 ? this.adresses[0].id : null;
      //this.selectedAdressId = this.adresses[0].id;
    },
    borrarMethod() {
      PaymentMRepository.delete(this.selectedMethodId);
      this.payMethods = this.payMethods.filter((method) => method.id !== this.selectedMethodId);
      this.selectedMethodId = this.payMethods.length > 0 ? this.payMethods[0].id : null;
      //this.selectedMethodId = this.payMethods[0].id;
    }
  }
};
</script>
<style scoped>
.user-image {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.profile-image {
  width: 150px; /* Tamaño de la imagen */
  height: 150px;
  border-radius: 50%; /* Imagen redonda */
  object-fit: cover; /* Ajustar la imagen */
  border: 2px solid #ccc;
}

.d-flex {
  display: flex;
  justify-content: center; /* Centrar los componentes horizontalmente */
  align-items: flex-start; /* Alinear los componentes con la parte superior */
  gap: 20px; /* Espacio entre las tarjetas */
  margin-top: 40px; /* Separación del componente superior */
}

.flex-item {
  flex: 1; /* Ambos elementos ocuparán el mismo espacio */
  max-width: 300px;
}
.user-info-container {
  background-color: #f4f6f9; /* Fondo suave y limpio */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Sombra más suave para profundidad */
  max-width: 900px;
  margin: 40px auto;
  text-align: center;
}

.user-info {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 250px;
  margin: 0 auto;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pay-Adress-card {
  width: 100%;
  max-width: 18rem;
  border: 1px solid #0fcc71;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.info-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.1rem;
  color: #555;
  gap: 8px;
}

.label {
  font-weight: bold;
  color: #333;
  width: 40%; /* Etiquetas con mayor ancho */
}

.value {
  color: #007bff;
  font-weight: 300;
  width: 40%;
}

.btn-sm {
  font-size: 0.9rem;
  margin: 10px 10px;
}
</style>
