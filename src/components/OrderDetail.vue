<template>
  <div class="product-detail-container">
    <h3 class="text-center my-4">Order {{ this.$route.params.orderId }}</h3>
    <h3 v-if="isAdmin && infoPedido" class="text-center my-4">{{ infoPedido.userLogin }}</h3>
    <div v-if="pedidoConProductos" class="product-detail">
      <div class="product-info">
        <!--Info Pedido-->
        <div class="info-grid">
          <div class="info-item">
            <span class="product-card">Total Products:</span>
            <span class="value">{{ totalProducts }}</span>
          </div>
          <div class="info-item">
            <span class="product-card">Date:</span>
            <span class="value">{{ new Date(infoPedido.purchaseDate).toLocaleDateString() }}</span>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="product-card">Address:</span>
            <span class="value">
              {{ infoPedido.adress.street }}, {{ infoPedido.adress.door }}
              {{ infoPedido.adress.portal }}
            </span>
          </div>
          <div class="info-item">
            <span class="product-card">Payment Method:</span>
            <span class="value">
              {{ infoPedido.paymentMethod.hiddenCardNumber }}
            </span>
          </div>
        </div>

        <!--Info Productos-->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
          <div class="col mb-3" v-for="product in productos" :key="product.id">
            <div class="card product-card">
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <h5 class="card-title">Marca: {{ product.brand }}</h5>
                <p class="card-text price">Precio por Unidad: {{ product.price }} €</p>
                <p class="card-text price">Cantidad Pedida: {{ this.getQuantity(product.id) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!--Status-->
        <h2 v-if="isAdmin && infoPedido.status != 'CANCELLED'" class="text-center my-3">
          Status:
          <button type="button" class="changeStatus-button" @click="changeStatus(infoPedido)">
            {{ infoPedido.status }}
          </button>
        </h2>
        <h2
          v-if="!isAdmin || (isAdmin && infoPedido.status == 'CANCELLED')"
          class="text-center my-3"
        >
          <span class="product-card">Status</span>:
          <span class="value">{{ infoPedido.status }}</span>
        </h2>
        <h1 class="text-center my-3">Total Price: {{ infoPedido.price }}€</h1>

        <!--Devolver/Cancelar-->
        <div class="button-container">
          <button
            v-if="!isAdmin && infoPedido.status != 'CANCELLED' && infoPedido.status != 'RETURNED'"
            type="button"
            class="return-button"
            @click="iniciarDevolucion"
          >
            RETURN
          </button>
          <button
            v-if="
              isAdmin &&
              infoPedido.status != 'CANCELLED' &&
              infoPedido.status != 'DELIVERED' &&
              infoPedido.status != 'RETURNED'
            "
            type="button"
            class="return-button"
            @click="iniciarCancelacion"
          >
            CANCELL
          </button>
        </div>

        <!--Justificaciones de Devoluciones o de Cancelaciones-->
        <div v-if="quieroCancelar" class="modal-overlay">
          <div class="modal-content">
            <textarea
              v-model="justificacionCancelacion"
              placeholder="Por favor, introduzca su justificación para realizar la cancelación"
            ></textarea>
            <div class="button-container">
              <button class="changeStatus-button" @click="confirmarCancelacion">Aceptar</button>
              <button class="return-button" @click="cancelarCancelacion">Cancelar</button>
            </div>
          </div>
        </div>
        <div v-if="quieroDevolver" class="modal-overlay">
          <div class="modal-content">
            <textarea
              v-model="justificacionDevolucion"
              placeholder="Por favor, introduzca su justificación para realizar la cancelación"
            ></textarea>
            <div class="button-container">
              <button class="changeStatus-button" @click="confirmarDevolucion">Aceptar</button>
              <button class="return-button" @click="cancelarDevolucion">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderRepository from "@/repositories/OrderRepository";
import ProductRepository from "@/repositories/ProductRepository";
import auth from "@/common/auth.js";
import { getStore } from "@/common/store";
export default {
  data() {
    return {
      pedidoConProductos: null,
      infoPedido: null,
      productosYCantidad: null,
      productos: null,
      totalProducts: null,
      quieroCancelar: false,
      quieroDevolver: false,
      justificacionCancelacion: null,
      justificacionDevolucion: null,
      isAdmin: auth.isAdmin(),
      store: getStore()
    };
  },
  async mounted() {
    this.pedidoConProductos = await OrderRepository.findOneWithProducts(this.$route.params.orderId);
    this.infoPedido = this.pedidoConProductos.order;
    this.productosYCantidad = this.pedidoConProductos.orderProducts;
    this.productos = await this.productsInfo(this.pedidoConProductos.orderProducts);
    this.totalProducts = this.getTotalProducts(this.productosYCantidad);
  },
  methods: {
    async productsInfo(productos) {
      let productosConInfo = [];
      for (const product of productos) {
        let pr = await ProductRepository.findOne(product.productId);
        productosConInfo.push(pr);
      }
      return productosConInfo;
    },
    getQuantity(id) {
      for (const product of this.productosYCantidad) {
        if (product.productId == id) {
          return product.quantity;
        }
      }
    },
    getTotalProducts(productos) {
      let productosTotales = 0;
      for (const product of productos) {
        productosTotales += product.quantity;
      }
      return productosTotales;
    },
    iniciarCancelacion() {
      this.quieroCancelar = true;
    },
    iniciarDevolucion() {
      this.quieroDevolver = true;
    },
    confirmarCancelacion() {
      this.cancellOrder(this.justificacionCancelacion);
      this.quieroCancelar = false;
    },
    confirmarDevolucion() {
      this.returnOrder(this.justificacionDevolucion);
      this.quieroDevolver = false;
    },
    cancelarCancelacion() {
      this.quieroCancelar = false;
    },
    cancelarDevolucion() {
      this.quieroDevolver = false;
    },
    async changeStatus(order) {
      if (order.status == "NOT_SHIPPED") {
        order.status = "SHIPPED";
      } else {
        order.status = "DELIVERED";
      }
      await OrderRepository.update(order);
    },
    async cancellOrder(justificacion) {
      let cancelation = {
        orderId: this.infoPedido.id,
        refund: this.infoPedido.price,
        text: justificacion,
        type: "Cancelacion"
      };
      await OrderRepository.cancell(cancelation);
      this.infoPedido = await OrderRepository.findOne(cancelation.orderId);
    },
    async returnOrder(justificacion) {
      let returnOrder = {
        orderId: this.infoPedido.id,
        refund: this.infoPedido.price,
        text: justificacion,
        type: "Devolucion"
      };
      try {
        await OrderRepository.return(returnOrder);
        this.infoPedido = await OrderRepository.findOne(returnOrder.orderId);
        if (returnOrder.text === null) this.store.state.user.warnings++;

        if (this.store.state.user.warnings === 3) {
          alert(
            "No has especificado devolución, por ello, has sido bloqueado. Serás desautenticado."
          );
          auth.logout();
          this.$router.push("/");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error inesperado durante la devolución del pedido.";
        alert(errorMessage);
      }
    }
  }
};
</script>
<style scoped>
.product-detail-container {
  background-color: #f4f6f9; /* Fondo suave */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Sombra */
  max-width: 900px;
  margin: 40px auto;
  text-align: center;
}
/* Precio */
h1 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}
/* Status */
h2 {
  color: #333;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 20px;
}
/* Titulo */
h3 {
  color: #333333;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Dos columnas de igual tamaño */
  gap: 20px; /* Espacio entre filas y columnas */
  align-items: center;
  width: 60%;
  margin: 0 auto; /* Centrar el grid dentro de su contenedor */
  margin-bottom: 15px; /* Separación de la siguiente sección */
}

.info-item {
  display: flex;
  flex-direction: column; /* Poner label y value en la misma columna */
  align-items: center; /* Centrar en el eje principal */
  gap: 5px; /* Espacio entre label y value */
}

.label {
  font-weight: bold;
  color: #333;
  text-align: center;
}

.value {
  color: #007bff;
  font-weight: 500;
  text-align: center;
}

.row {
  display: flex;
  flex-wrap: wrap; /* Asegurar que las cards se envuelvan */
  justify-content: center; /* Centrar las cards */
  gap: 20px; /* Espaciado entre las cards */
}

.product-card {
  width: 100%;
  max-width: 18rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #007bff;
}

/* Botones */
.button-container {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  width: 100%;
}

.return-button,
.back-button {
  width: 20%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  flex-grow: 1; /* Permite que los botones crezcan y ocupen el espacio disponible */
  margin: 0 10px; /* Añadimos espacio entre los botones */
}

.return-button {
  background: #f32a2a;
}

.return-button:hover {
  background: #b52b27;
}

.changeStatus-button,
.back-button {
  width: 20%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  flex-grow: 1; /* Permite que los botones crezcan y ocupen el espacio disponible */
  margin: 0 10px; /* Añadimos espacio entre los botones */
}

.changeStatus-button {
  background: #99288c;
}

.changeStatus-button:hover {
  background: #e83bba;
}

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
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}
</style>
