import { createRouter, createWebHistory } from "vue-router";
import AboutView from "../views/AboutView.vue";
import ErrorNotFoundView from "../views/ErrorNotFoundView.vue";
import LoginForm from "../components/LoginForm.vue";
import ProductList from "../components/ProductList.vue";
import ProductDetail from "../components/ProductDetail.vue";
import RegisterForm from "../components/RegisterForm.vue";
import ProductForm from "../components/ProductForm.vue";
import ProductListByBrand from "../components/ProductListByBrand.vue";
import ShowUsers from "@/components/ShowUsers.vue";
import auth from "@/common/auth";
import { getStore } from "@/common/store";
import InfoUser from "@/components/InfoUser.vue";
import CartView from "@/components/CartView.vue";
import NewOrder from "@/components/NewOrder.vue";
import OrderList from "@/components/OrderList.vue";
import UserOrderList from "@/components/UserOrderList.vue";
import UnauthorizedView from "@/views/UnauthorizedView.vue";
import OrderDetail from "@/components/OrderDetail.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginForm,
    meta: { public: true, isLoginPage: true }
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterForm,
    meta: { public: true }
  },
  {
    path: "/about",
    name: "about",
    component: AboutView
  },
  {
    path: "/products",
    name: "ProductList",
    component: ProductList
  },
  {
    path: "/products/new",
    name: "ProductCreate",
    component: ProductForm
  },
  {
    path: "/products/:productId",
    name: "ProductDetail",
    component: ProductDetail
  },
  {
    path: "/products/:productId/edit",
    name: "ProductEdit",
    component: ProductForm,
    meta: { authority: "ADMIN" }
  },
  {
    path: "/users",
    name: "ShowUsers",
    component: ShowUsers,
    meta: { authority: "ADMIN" }
  },
  {
    path: "/users/:userId",
    name: "InfoUser",
    component: InfoUser
  },
  {
    path: "/cart",
    name: "CartView",
    component: CartView,
    meta: { authority: "USER" }
  },
  {
    path: "/products/brands/:brand",
    name: "ProductListByBrand",
    component: ProductListByBrand
  },
  {
    path: "/orders/new",
    name: "NewOrder",
    component: NewOrder,
    meta: { authority: "USER" }
  },
  {
    path: "/orders",
    name: "OrderList",
    component: OrderList
  },
  {
    path: "/orders/users/:userId",
    name: "UserOrderList",
    component: UserOrderList,
    meta: { authority: "ADMIN" }
  },
  {
    path: "/orders/:orderId",
    name: "OrderDetail",
    component: OrderDetail
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: UnauthorizedView
  },
  {
    path: "/:catchAll(.*)*",
    component: ErrorNotFoundView,
    meta: { public: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // Lo primero que hacemos antes de cargar ninguna ruta es comprobar si
  // el usuario está autenticado (revisando el token)
  auth.isAuthenticationChecked.finally(() => {
    // por defecto, el usuario debe estar autenticado para acceder a las rutas
    const requiresAuth = !to.meta.public;

    const requiredAuthority = to.meta.authority;
    const userIsLogged = getStore().state.user.logged;
    const loggedUserAuthority = getStore().state.user.authority;

    if (requiresAuth) {
      // página privada
      if (userIsLogged) {
        if (requiredAuthority && requiredAuthority != loggedUserAuthority) {
          // usuario logueado pero sin permisos suficientes, le redirigimos a la página de login
          alert("Acceso prohibido para el usuario actual; intenta autenticarte de nuevo");
          auth.logout();
          next("/");
        } else {
          // usuario logueado y con permisos adecuados
          next();
        }
      } else {
        // usuario no está logueado, no puede acceder a la página
        alert("Esta página requiere autenticación");
        next("/");
      }
    } else {
      // página pública
      if (userIsLogged && to.meta.isLoginPage) {
        // si estamos logueados no hace falta volver a mostrar el login
        next({ name: "ProductList", replace: true });
      } else {
        next();
      }
    }
  });
});

export default router;
