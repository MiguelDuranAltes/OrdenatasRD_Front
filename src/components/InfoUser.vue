<template>
  <div class="user-info-container">
    <!--Imagen-->
    <div class="user-image">
      <img :src="userImage" alt="User Image" class="profile-image" />
    </div>
    <div v-if="store.state.user.id === parseInt(this.$route.params.userId)" class="fixed-buttons">
      <button
        class="btn btn-primary"
        @click.prevent="iniciarSubidaFichero()"
        style="margin-right: 10px"
      >
        Cambiar Imagen
      </button>
      <input ref="inputOculto" class="d-none" type="file" @change="actualizarImagen()" />
      <button class="btn btn-primary" @click="borrarImagen()">Borrar Imagen</button>
    </div>
    <!--Login-->
    <div v-if="this.user" class="user-info">
      <div class="user-detail">
        <div class="info-item flex-column align-items-start">
          <div class="label">Login:</div>
          <div class="value">{{ this.user.login }}</div>
        </div>
      </div>
    </div>
    <!--Direcciones y Métodos de Pago-->
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
          <span v-if="selectedAdressId && !isAdmin" @click="borrarAdress" class="delete-button">
            Delete
          </span>
        </div>
      </div>

      <div v-if="payMethods && payMethods.length" class="card pay-Adress-card flex-item">
        <div class="card-body">
          <!-- Desplegable -->
          <label for="payment-select" class="form-label">Métodos de Pago</label>
          <select id="payment-select" v-model="selectedMethodId" class="form-select">
            <option v-for="method in payMethods" :key="method.id" :value="method.id">
              {{ method.hiddenCardNumber }}
            </option>
          </select>
          <span v-if="selectedMethodId && !isAdmin" @click="borrarMethod" class="delete-button">
            Delete
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="createAdress" class="modal-overlay">
    <div class="modal-container">
      <form @submit.prevent="saveAdress">
        <div class="card-header">
          <h5 class="card-title">Nueva Dirección</h5>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="street">Calle *</label>
            <input
              type="text"
              class="form-control"
              id="street"
              v-model="newAdress.street"
              required
            />
          </div>

          <div class="form-group">
            <label for="door">Número</label>
            <input
              type="number"
              class="form-control"
              id="door"
              v-model="newAdress.door"
              min="0"
              step="1"
            />
          </div>

          <div class="form-group">
            <label for="portal">Portal</label>
            <input
              type="number"
              class="form-control"
              id="portal"
              v-model="newAdress.portal"
              min="0"
              step="1"
            />
          </div>

          <div class="form-group">
            <label for="postalCode">Código Postal *</label>
            <input
              type="number"
              class="form-control"
              id="postalCode"
              v-model="newAdress.postalCode"
              min="0"
              required
            />
          </div>

          <div class="form-group">
            <label for="city">Ciudad *</label>
            <input type="text" class="form-control" id="city" v-model="newAdress.city" required />
          </div>
        </div>
      </form>

      <div class="card-footer d-flex justify-content-between">
        <button type="button" class="btn btn-outline-secondary" @click="saveAdress">
          Guardar dirección
        </button>
        <button type="button" class="btn btn-outline-danger" @click="notNewAdress">
          Cancelar operación
        </button>
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
  <div v-if="createPayment" class="modal-overlay">
    <div class="modal-container">
      <form @submit.prevent="savePayment">
        <div class="card-header">
          <h5 class="card-title">Nuevo Método de Pago</h5>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="creditCardNumber">Número de Tarjeta</label>
            <input
              type="text"
              class="form-control"
              id="creditCardNumber"
              v-model="newPayment.creditCardNumber"
              required
            />
          </div>

          <div class="form-group">
            <label for="expirationDate">Fecha de Expiración</label>
            <input
              type="month"
              class="form-control"
              id="expirationDate"
              v-model="newPayment.expirationDate"
              required
            />
          </div>

          <div class="form-group">
            <label for="cvv">CVV</label>
            <input type="text" class="form-control" id="cvv" v-model="newPayment.cvv" required />
          </div>

          <div class="form-group">
            <label for="name">Nombre</label>
            <input type="text" class="form-control" id="name" v-model="newPayment.name" required />
          </div>
        </div>
      </form>
      <div class="card-footer d-flex justify-content-between">
        <button type="button" class="btn btn-outline-secondary" @click="savePayment">
          Guardar método de pago
        </button>
        <button type="button" class="btn btn-outline-danger" @click="notNewPayment">
          Cancelar operación
        </button>
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
  <!--Nuevas Direcciones y Métodos de Pago-->
  <div class="fixed-buttons">
    <button v-if="!isAdmin" class="btn btn-primary btn-sm" @click="tryNewAddress">
      Add New Address
    </button>
    <button v-if="!isAdmin" class="btn btn-primary btn-sm" @click="tryNewPayment">
      Add New Payment
    </button>
  </div>
</template>

<script>
import auth from "@/common/auth.js";
import AdressesRepository from "@/repositories/AdressesRepository";
import PaymentMRepository from "@/repositories/PaymentMRepository";
import UserRepository from "@/repositories/UsersRepository";
import defaultImage from "@/assets/logo.png";
import ImageRepository from "@/repositories/ImageRepository";
import { BACKEND_URL } from "@/constants";
import { getStore } from "@/common/store";

export default {
  data() {
    return {
      user: null,
      payMethods: [],
      adresses: [],
      selectedAdressId: null,
      selectedMethodId: null,
      userImage: defaultImage,
      isAdmin: auth.isAdmin(),
      createAdress: false,
      createPayment: false,
      newAdress: {
        street: "",
        door: null,
        portal: null,
        postalCode: null,
        city: ""
      },
      newPayment: {
        creditCardNumber: "",
        expirationDate: "",
        cvv: "",
        name: ""
      },
      errorMessage: null,
      store: getStore()
    };
  },
  async mounted() {
    this.user = await UserRepository.findById(this.$route.params.userId);
    console.log(this.user);
    if (!this.isAdmin && getStore().state.user.id != parseInt(this.$route.params.userId)) {
      this.$router.push("/unauthorized");
      return;
    }
    this.payMethods = await PaymentMRepository.findAll(this.user.id);
    this.adresses = await AdressesRepository.findAll(this.user.id);
    if (this.adresses.length > 0) {
      this.selectedAdressId = this.adresses[0].id;
    }
    if (this.payMethods.length > 0) {
      this.selectedMethodId = this.payMethods[0].id;
    }
    this.userImage = this.user.hasImage
      ? `${BACKEND_URL}/users/${this.user.id}/imagen`
      : defaultImage;
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
    },
    tryNewAddress() {
      this.errorMessage = null;
      this.createAdress = true;
    },
    notNewAdress() {
      this.createAdress = false;
    },
    async saveAdress() {
      try {
        this.errorMessage = null;
        if (!this.newAdress.street || !this.newAdress.postalCode || !this.newAdress.city) {
          this.errorMessage = "Todos los campos requeridos deben completarse.";
          return;
        }

        await AdressesRepository.create(this.newAdress);
        this.createAdress = false;
        this.adresses = await AdressesRepository.findAll(this.user.id);
      } catch (err) {
        this.handleError(
          err,
          "Ocurrió un error durante la creación de la dirección, inténtelo de nuevo."
        );
      }
    },
    tryNewPayment() {
      this.errorMessage = null;
      this.createPayment = true;
    },
    notNewPayment() {
      this.createPayment = false;
    },
    async savePayment() {
      try {
        this.errorMessage = null;
        if (
          !this.newPayment.creditCardNumber ||
          !this.newPayment.expirationDate ||
          !this.newPayment.cvv ||
          !this.newPayment.name
        ) {
          this.errorMessage = "Todos los deben completarse.";
          return;
        }
        await PaymentMRepository.create(this.newPayment);
        this.createPayment = false;
        this.payMethods = await PaymentMRepository.findAll(this.user.id);
      } catch (err) {
        this.handleError(
          err,
          "Ocurrió un error durante la creación del método, inténtelo de nuevo."
        );
      }
    },
    async iniciarSubidaFichero() {
      this.$refs.inputOculto.click();
    },
    async actualizarImagen() {
      try {
        const file = this.$refs.inputOculto.files[0];
        if (!file) {
          throw new Error("No se ha seleccionado ningún archivo.");
        }
        await ImageRepository.saveImage(this.user.id, file);
        this.userImage = `${BACKEND_URL}/users/${this.user.id}/imagen?timestamp=${new Date().getTime()}`;
        console.log("Imagen subida y actualizada exitosamente.");
      } catch (err) {
        console.error("Error al subir la imagen:", err);
        this.errorMessage = err.response?.data?.message || "Error al subir la imagen.";
      } finally {
        // Limpiar el input
        this.$refs.inputOculto.value = null;
      }
    },
    async borrarImagen() {
      try {
        await ImageRepository.deleteImage(this.user.id);
        this.userImage = defaultImage;
      } catch (err) {
        this.errorMessage = err.response?.data?.message || "Error al borrar la imagen.";
      }
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
}

.modal-container {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  max-width: 300px; /* Ajusta este valor según tu diseño */
  white-space: normal;
  word-wrap: break-word; /* Para navegadores antiguos */
  overflow-wrap: break-word; /* Para navegadores modernos */
}

.delete-button {
  cursor: pointer;
  color: red;
  text-decoration: underline;
  margin-top: 10px;
  display: inline-block;
}
</style>
