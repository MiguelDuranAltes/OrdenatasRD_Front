<template>
  <div class="container">
    <h1>Resumen de pedido</h1>
    <div class="row">
      <div class="product-list">
        <div class="product-card" v-for="product in products" :key="product.id">
          <h4>{{ product.name }}</h4>
          <p>Precio: {{ product.price }}€</p>
          <p>Cantidad: {{ getQuantity(product.id).quantity }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="user-info-container">
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

  <div class="fixed-buttons">
    <button v-if="!isAdmin" class="btn btn-secondary btn-sm" @click="tryNewAddress">
      Add New Address
    </button>
    <button v-if="!isAdmin" class="btn btn-secondary btn-sm" @click="tryNewPayment">
      Add New Payment
    </button>
  </div>

  <div>
    <div>
      <h3>Total: {{ this.total }} €</h3>
    </div>
    <div class="d-flex justify-content-center gap-3">
      <router-link class="btn btn-danger" to="/products"> Cancelar </router-link>
      <button class="btn btn-primary" @click="makeOrder()">Realizar pedido</button>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { getStore, clearCart } from "@/common/store";
import ProductRepository from "@/repositories/ProductRepository";
import AdressesRepository from "@/repositories/AdressesRepository";
import PaymentMRepository from "@/repositories/PaymentMRepository";
import OrderRepository from "@/repositories/OrderRepository";

export default {
  data() {
    return {
      cart: null,
      products: [],
      user: null,
      payMethods: [],
      adresses: [],
      selectedAdressId: null,
      selectedMethodId: null,
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
      order: null,
      errorMessage: null
    };
  },
  async mounted() {
    this.cart = getStore().state.cart;
    this.user = getStore().state.user;
    const allProducts = await ProductRepository.findAll();
    this.products = allProducts.filter((product) =>
      this.cart.some((cartItem) => cartItem.productId === product.id)
    );
    this.adresses = await AdressesRepository.findAll(this.user.id);
    if (this.adresses.length > 0) {
      this.selectedAdressId = this.adresses[0].id;
    }
    this.payMethods = await PaymentMRepository.findAll(this.user.id);
    if (this.payMethods.length > 0) {
      this.selectedMethodId = this.payMethods[0].id;
    }
  },
  computed: {
    total() {
      return this.getTotal();
    },
    // Obtener la dirección seleccionada basada en el ID
    selectedAdress() {
      return this.adresses.find((adress) => adress.id === this.selectedAdressId) || {};
    },
    selectedMethod() {
      return this.payMethods.find((method) => method.id === this.selectedMethodId) || {};
    }
  },
  methods: {
    getQuantity(productId) {
      return this.cart.find((cartItem) => cartItem.productId === productId);
    },
    getTotal() {
      return this.products
        .reduce((total, product) => {
          const cartItem = this.cart.find((item) => item.productId === product.id);
          if (cartItem) {
            total += product.price * cartItem.quantity;
          }
          return total;
        }, 0)
        .toFixed(2);
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
          this.errorMessage = "Todos los campos deben completarse.";
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
    handleError(err, defaultMessage) {
      console.log(err);
      if (err.response?.data?.message) {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = defaultMessage;
      }
    },
    async makeOrder() {
      if (this.selectedAdressId === null || this.selectedMethodId === null) {
        this.errorMessage = "Debe seleccionar una dirección y un método de pago.";
        return;
      }
      try {
        this.order = {
          userLogin: this.user.login,
          price: this.total,
          adress: this.selectedAdress,
          paymentMethod: this.selectedMethod
        };
        const orderRequest = {
          order: this.order,
          orderProducts: this.cart
        };

        await OrderRepository.create(orderRequest);
        this.$router.push("/products");
        clearCart();
      } catch (err) {
        this.handleError(
          err,
          "Ocurrió un error durante la creación del pedido, inténtelo de nuevo."
        );
      }
    }
  }
};
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: center; /* Centrar los componentes horizontalmente */
  align-items: flex-start; /* Alinear los componentes con la parte superior */
  gap: 20px; /* Espacio entre las tarjetas */
  margin-top: 40px; /* Separación del componente superior */
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: #f9f9f9;
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

button.btn-sm {
  width: auto; /* El botón no ocupará todo el ancho */
  padding: 10px 20px; /* Agregar algo de espacio para que el botón no se vea pequeño */
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
  white-space: normal;
}
</style>
