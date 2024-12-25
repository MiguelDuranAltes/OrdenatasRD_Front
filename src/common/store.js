import { ref, watch } from "vue";

const localStorageKey = "cart";

const store = ref({
  state: {
    user: {
      authority: "",
      login: "",
      id: "",
      logged: false
    },
    cart: loadCartFromStorage()
  }
});

export { getStore, addToCart, removeFromCart, clearCart };

function loadCartFromStorage() {
  const savedCart = localStorage.getItem(localStorageKey);
  return savedCart ? JSON.parse(savedCart) : [];
}

function saveCartToStorage(cart) {
  localStorage.setItem(localStorageKey, JSON.stringify(cart));
}

function getStore() {
  return store.value;
}

function addToCart(idProduct) {
  const existingProduct = store.value.state.cart.find((item) => item.productId === idProduct);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    store.value.state.cart.push({ productId: idProduct, quantity: 1 });
  }
  saveCartToStorage(store.value.state.cart); // Guardar en localStorage
}

function removeFromCart(productId) {
  const productIndex = store.value.state.cart.findIndex((item) => item.productId === productId);

  if (productIndex !== -1) {
    store.value.state.cart.splice(productIndex, 1);
    saveCartToStorage(store.value.state.cart); // Guardar en localStorage
  }
}

function clearCart() {
  store.value.state.cart = [];
  saveCartToStorage(store.value.state.cart); // Guardar en localStorage
}

// Observa los cambios en el carrito y sincroniza con localStorage automáticamente
watch(
  () => store.value.state.cart,
  (newCart) => {
    saveCartToStorage(newCart);
  },
  { deep: true }
);
