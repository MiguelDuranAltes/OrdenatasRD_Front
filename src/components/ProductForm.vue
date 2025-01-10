<template>
  <div v-if="product || newProduct" class="container note-form">
    <h1 class="text-center mb-4">{{ newProduct ? "Crear Producto" : "Editar Producto" }}</h1>
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

      <div class="product-image">
        <img :src="productImage" alt="Product Image" class="prod-image" />
      </div>
      <div class="fixed-buttons">
        <button
          class="btn btn-primary"
          @click.prevent="iniciarSubidaFichero()"
          style="margin-right: 10px"
        >
          Cambiar Imagen
        </button>
        <input ref="inputOculto" class="d-none" type="file" @change="actualizarImagen()" />
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
import defaultImage from "@/assets/logo.png";
import { BACKEND_URL } from "@/constants";
import ImageProductRepository from "@/repositories/ImageProductRepository";

export default {
  data() {
    return {
      product: {},
      newProduct: true,
      errorMessage: null, // Para manejar los mensajes de error
      productImage: defaultImage,
      file: null
    };
  },
  async mounted() {
    if (this.$route.params.productId) {
      this.newProduct = false;
      this.product = await ProductRepository.findOne(this.$route.params.productId);

      this.productImage = this.product.hasImage
        ? `${BACKEND_URL}/products/${this.product.id}/imagen`
        : defaultImage;
    }
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
        if (this.file != null) {
          await ImageProductRepository.saveImage(respuesta.id, this.file);
          this.userImage = `${BACKEND_URL}/products/${respuesta.id}/imagen?timestamp=${new Date().getTime()}`;
        }

        console.log(this.respuesta);
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
    },
    async iniciarSubidaFichero() {
      this.$refs.inputOculto.click();
    },
    async actualizarImagen() {
      try {
        this.file = this.$refs.inputOculto.files[0];
        if (!this.file) {
          throw new Error("No se ha seleccionado ningún archivo.");
        }
      } catch (err) {
        console.error("Error al subir la imagen:", err);
        this.errorMessage = err.response?.data?.message || "Error al subir la imagen.";
      } finally {
        // Limpiar el input
        this.$refs.inputOculto.value = null;
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

.product-image {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.prod-image {
  width: 150px; /* Tamaño de la imagen */
  height: 150px;
  object-fit: cover; /* Ajustar la imagen */
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
