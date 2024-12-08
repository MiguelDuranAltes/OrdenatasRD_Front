<template>
  <div v-if="product" class="container note-form">
    <h1 class="text-center mb-4">Edición del Producto {{ this.$route.params.productId }}</h1>
    <form @submit.prevent="guardarProducto">
      <div class="form-group">
        <label for="name" class="form-label">Nombre del Producto</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="product.name"
          placeholder="Ingresa el nombre del producto"
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Descripción</label>
        <textarea
          id="description"
          class="form-control"
          rows="4"
          v-model="product.description"
          maxlength="200"
          placeholder="Ingresa una descripción breve del producto"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="brand" class="form-label">Marca</label>
        <input
          type="text"
          class="form-control"
          id="brand"
          v-model="product.brand"
          placeholder="Ingresa la marca del producto"
        />
      </div>

      <div class="form-group">
        <label for="price" class="form-label">Precio (€)</label>
        <input
          type="number"
          class="form-control"
          id="price"
          v-model="product.price"
          min="0"
          step="0.01"
          placeholder="Ingresa el precio del producto"
        />
      </div>

      <div class="form-group">
        <label for="availability" class="form-label">Unidades Disponibles</label>
        <input
          type="number"
          class="form-control"
          id="availability"
          v-model="product.availability"
          min="0"
          placeholder="Número de unidades disponibles"
        />
      </div>

      <div class="text-center mt-4">
        <button type="submit" class="btn btn-primary btn-lg">Guardar Cambios</button>
      </div>
    </form>

    <div v-if="errorMessage" class="error-message text-center mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import ProductRepository from "@/repositories/ProductRepository";

export default {
  data() {
    return {
      product: null,
      errorMessage: null // Para manejar los mensajes de error
    };
  },
  async mounted() {
    this.product = await ProductRepository.findOne(this.$route.params.productId);
  },
  methods: {
    async guardarProducto() {
      // Limpiar el mensaje de error antes de intentar guardar
      this.errorMessage = null;

      // Validaciones para los campos del producto
      //Hay que asegurarse en el back de que el nombre es único, si se intenta guardar un producto con un nombre que ya existe, el back debería devolver un error
      if (!this.product.name) {
        this.errorMessage = "El producto debe tener un nombre.";
        return;
      }
      if (!this.product.brand) {
        this.errorMessage = "El producto debe tener una marca.";
        return;
      }
      if (!this.product.price || this.product.price <= 0) {
        this.errorMessage = "Precio inválido.";
        return;
      }
      if (this.product.availability < 0) {
        this.errorMessage = "La disponibilidad no puede ser negativa.";
        return;
      }
      if (!this.product.description) {
        this.errorMessage = "El producto debe tener una descripción.";
        return;
      }

      try {
        const respuesta = await ProductRepository.save(this.product);
        // Redirigir a la página de detalles del producto después de guardar
        this.$router.push({ name: "ProductDetail", params: { productId: respuesta.id } });
      } catch (e) {
        console.error(e);
        // Manejo de error en el guardado
        if (e.response?.data?.message) {
          this.errorMessage = e.response.data.message;
        } else {
          this.errorMessage = "Ocurrió un error, por favor intenta de nuevo.";
        }
      }
    }
  }
};
</script>

<style scoped>
.note-form {
  max-width: 700px;
  margin: 50px auto;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: #444;
}

.form-control {
  font-size: 1rem;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  margin-top: 5px;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
}

textarea.form-control {
  resize: vertical;
}

button.btn {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  width: 100%;
  transition: background-color 0.3s ease;
}

button.btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.9rem;
}
</style>
