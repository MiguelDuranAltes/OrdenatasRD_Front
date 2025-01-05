<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Crear Cuenta</h1>
      <form class="register-form" @submit.prevent="registrarme">
        <div class="form-group">
          <label for="login" class="form-label">Login:</label>
          <input
            type="text"
            id="login"
            class="form-input"
            v-model="auxLogin"
            placeholder="Introduce tu usuario"
            required
          />
        </div>
        <div class="form-group">
          <label for="pass" class="form-label">Password:</label>
          <input
            type="password"
            id="pass"
            class="form-input"
            v-model="auxPass"
            placeholder="Introduce tu contraseña"
            required
          />
        </div>
        <div class="form-group">
          <label for="passConfirm" class="form-label">Confirmar Password:</label>
          <input
            type="password"
            id="passConfirm"
            class="form-input"
            v-model="auxPassConfirm"
            placeholder="Confirma tu contraseña"
            required
          />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="form-group">
          <button type="submit" class="register-button">Registrarse</button>
        </div>
        <div class="form-group">
          <button type="button" class="back-button" @click="volverAtras">Volver</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import auth from "../common/auth.js";
import AccountRepository from "@/repositories/AccountRepository.js";

export default {
  data() {
    return {
      auxLogin: null,
      auxPass: null,
      auxPassConfirm: null,
      errorMessage: null
    };
  },
  methods: {
    async registrarme() {
      this.errorMessage = null;

      if (this.auxPass !== this.auxPassConfirm) {
        this.errorMessage = "Las contraseñas no coinciden";
        return;
      }
      if (this.auxLogin.length < 5) {
        this.errorMessage = "El login de usuario debe tener al menos 5 caracteres";
        return;
      }
      if (this.auxPass.length < 5) {
        this.errorMessage = "La contraseña debe tener al menos 5 caracteres";
        return;
      }
      if (!/[#@$%&]/.test(this.auxPass)) {
        this.errorMessage =
          "La contraseña debe contener al menos un caracter especial de @, #, $, % o &";
        return;
      }
      try {
        const user = { login: this.auxLogin, password: this.auxPass };
        await AccountRepository.registerAccount(user);
        await this.autenticarme();
        this.$router.push("/products");
      } catch (e) {
        console.error(e);
        this.errorMessage = e.response?.data?.message || "Error durante el registro.";
      }
    },
    async iniciarSubidaFichero() {
      this.$refs.inputOculto.click();
    },

    async autenticarme() {
      try {
        await auth.login({ login: this.auxLogin, password: this.auxPass });
      } catch (e) {
        console.error(e);
        this.errorMessage = e.response?.data?.message || "Error al iniciar sesión.";
        this.$router.push("/");
      }
    },
    volverAtras() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
/* Contenedor general */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 93.5vh; /* Toda la altura de la ventana */
  background: linear-gradient(135deg, #2f135a, #0b8032);
  padding: 20px;
}

/* Tarjeta flotante */
.register-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

/* Animación */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Título */
.register-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333333;
}

/* Formulario */
.register-form {
  display: flex;
  flex-direction: column;
}

/* Grupo de formularios */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

/* Etiquetas */
.form-label {
  display: block;
  font-weight: bold;
  color: #555555;
  margin-bottom: 8px;
}

/* Campos de entrada */
.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  transition: all 0.3s;
}

.form-input:focus {
  border-color: #74ebd5;
  box-shadow: 0 0 5px rgba(116, 235, 213, 0.5);
  outline: none;
}

/* Botones */
.register-button,
.back-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.register-button {
  background: linear-gradient(135deg, #11947c, #032de9);
}

.register-button:hover {
  background: linear-gradient(135deg, #085143, #02248a);
}

.back-button {
  background: linear-gradient(135deg, #d9534f, #b52b27);
}

.back-button:hover {
  background: linear-gradient(135deg, #a73531, #801f1b);
}

/* Mensaje de error */
.error-message {
  margin-top: 15px;
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}
</style>
