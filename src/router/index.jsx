import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load page components
const Home = lazy(() => import("@/components/pages/Home"));
const Shop = lazy(() => import("@/components/pages/Shop"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Cart = lazy(() => import("@/components/pages/Cart"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"));
const About = lazy(() => import("@/components/pages/About"));
const Contact = lazy(() => import("@/components/pages/Contact"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "shop",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Shop />
      </Suspense>
    )
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ProductDetail />
      </Suspense>
    )
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Cart />
      </Suspense>
    )
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Checkout />
      </Suspense>
    )
  },
  {
    path: "order-confirmation/:orderId",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <OrderConfirmation />
      </Suspense>
    )
  },
  {
    path: "about",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <About />
      </Suspense>
    )
  },
  {
    path: "contact",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Contact />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

// Create routes array with layout wrapper
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);