<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Iniciar Sesión</h1>
      <form @submit.prevent="autenticarme" class="login-form">
        <div class="form-group">
          <label for="login" class="form-label">Login:</label>
          <input
            type="text"
            id="login"
            v-model="auxLogin"
            class="form-input"
            @keyup.enter="autenticarme"
            placeholder="Introduce tu usuario"
            required
          />
        </div>
        <div class="form-group">
          <label for="pass" class="form-label">Password:</label>
          <input
            type="password"
            id="pass"
            v-model="auxPass"
            class="form-input"
            @keyup.enter="autenticarme"
            placeholder="Introduce tu contraseña"
            required
          />
        </div>
        <div class="form-group">
          <button type="submit" class="login-button">Iniciar Sesión</button>
        </div>
        <div class="form-group">
          <button type="button" class="register-button" @click="registrarme">Crear Cuenta</button>
        </div>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import auth from "../common/auth.js";

export default {
  data() {
    return {
      auxLogin: null,
      auxPass: null,
      errorMessage: null
    };
  },
  methods: {
    async autenticarme() {
      if (this.auxLogin == null || this.auxPass == null) {
        this.errorMessage = "Por favor, completa todos los campos.";
        return;
      }
      try {
        await auth.login({
          login: this.auxLogin,
          password: this.auxPass
        });
        this.$router.push("/products");
      } catch (e) {
        this.errorMessage = "No se pudo iniciar sesión, revisa tus credenciales.";
      }
    },
    registrarme() {
      this.$router.push("/register");
    }
  }
};
</script>

<style scoped>
/* Contenedor general */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 93.5vh; /* 90% de la altura de la ventana*/
  background: linear-gradient(135deg, #2f135a, #0b8032);
  padding: 20px;
}

/* Tarjeta flotante */
.login-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

/* Animación para la tarjeta */
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
.login-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333333;
}

/* Formulario */
.login-form {
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
.login-button,
.register-button {
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

.login-button {
  background: linear-gradient(135deg, #11947c, #032de9);
}

.login-button:hover {
  background: linear-gradient(135deg, #085143, #02248a);
}

.register-button {
  background: linear-gradient(135deg, #a753aa, #dd0bba);
}

.register-button:hover {
  background: linear-gradient(135deg, #8d3776, #600534);
}

/* Mensaje de error */
.error-message {
  margin-top: 15px;
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}
</style>
