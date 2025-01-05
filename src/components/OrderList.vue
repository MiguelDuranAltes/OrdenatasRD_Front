<template>
  <div v-if="orders" class="container">
    <div>
      <h1>Lista de pedidos</h1>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="order in orders" :key="order.id">
        <OrderCard :order="order" :users="this.users"></OrderCard>
        <!--Devolver/Cancelar-->
        <div class="button-container">
          <button
            v-if="
              !isAdmin &&
              order.status != 'CANCELLED' &&
              order.status != 'RETURNED' &&
              order.status === 'DELIVERED'
            "
            type="button"
            class="return-button"
            @click="iniciarDevolucion(order)"
          >
            RETURN
          </button>
          <button
            v-if="
              isAdmin &&
              order.status != 'CANCELLED' &&
              order.status != 'DELIVERED' &&
              order.status != 'RETURNED'
            "
            type="button"
            class="return-button"
            @click="iniciarCancelacion(order)"
          >
            CANCELL
          </button>
        </div>
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
            placeholder="Por favor, introduzca su justificación para realizar la devolcución"
          ></textarea>
          <div class="button-container">
            <button class="changeStatus-button" @click="confirmarDevolucion">Aceptar</button>
            <button class="return-button" @click="cancelarDevolucion">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth";
import OrderCard from "./OrderCard.vue";
import OrderRepository from "@/repositories/OrderRepository";
import UsersRepository from "@/repositories/UsersRepository";
import { getStore } from "@/common/store";

export default {
  data() {
    return {
      orders: [],
      users: null,
      quieroCancelar: false,
      quieroDevolver: false,
      pedidoReturnCancell: null,
      justificacionCancelacion: null,
      justificacionDevolucion: null,
      isAdmin: auth.isAdmin(),
      store: getStore()
    };
  },
  components: {
    OrderCard
  },
  async mounted() {
    this.orders = await OrderRepository.findAll();
    if (this.isAdmin) {
      this.users = await UsersRepository.findAll();
    }
  },
  methods: {
    iniciarCancelacion(order) {
      this.quieroCancelar = true;
      this.pedidoReturnCancell = order;
    },
    iniciarDevolucion(order) {
      this.quieroDevolver = true;
      this.pedidoReturnCancell = order;
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
      this.justificacionCancelacion = null;
    },
    cancelarDevolucion() {
      this.quieroDevolver = false;
      this.justificacionDevolucion = null;
    },
    async cancellOrder(justificacion) {
      let cancelation = {
        orderId: this.pedidoReturnCancell.id,
        refund: this.pedidoReturnCancell.price,
        text: justificacion,
        type: "Cancelacion"
      };
      await OrderRepository.cancell(cancelation);
      this.orders = await OrderRepository.findAll();
      this.pedidoReturnCancell = null;
    },
    async returnOrder(justificacion) {
      let returnOrder = {
        orderId: this.pedidoReturnCancell.id,
        refund: this.pedidoReturnCancell.price,
        text: justificacion,
        type: "Devolucion"
      };
      try {
        await OrderRepository.return(returnOrder);
        this.orders = await OrderRepository.findAll();
        this.pedidoReturnCancell = null;
        if (returnOrder.text === null) this.store.state.user.warnings++;
        if (this.store.state.user.warnings === 3) {
          alert(
            "No has especificado devolución, por ello, has sido bloqueado. Serás desautenticado."
          );
          auth.logout();
          this.$router.push("/");
        }
      } catch (error) {
        console.error(error);
        const errorMessage =
          error.response?.data?.message || "Error inesperado durante la devolución del pedido.";
        alert(errorMessage);
      }
    }
  }
};
</script>

<style scoped>
/* Botones */
.button-container {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  width: 85%;
  margin-top: 10px;
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
