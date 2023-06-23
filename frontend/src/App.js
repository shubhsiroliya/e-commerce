import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import axios from "axios";

import "./App.css";
import Header from "./components/layouts/Header/Header.jsx";
import Footer from "./components/layouts/Footer/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import ProductDetails from "./components/Product/ProductDetails.jsx";
import Products from "./components/Product/Products.jsx";
import Search from "./components/Product/Search";
import LoginSignUp from "./components/User/LoginSignUp";
import Profile from "./components/User/Profile";
import store from "./store";
import { loadUser } from "./actions/userActions";
import UserOptions from "./components/layouts/Header/UserOptions";
import { useSelector } from "react-redux";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrderList from './components/Admin/OrderList';
import ProcessOrder from "./components/Admin/ProcessOrder";
import UserList from './components/Admin/UserList';
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReviews from "./components/Admin/ProductReviews";
import About from './components/layouts/About/About';
import Contact from './components/layouts/Contact/Contact';
import NotFound from './components/layouts/NotFound/NotFound';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStipeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    getStipeApiKey();
  }, []);
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      {isAuthenticated && stripeApiKey!=="" && <Elements stripe={loadStripe(stripeApiKey)}>
        <Routes>
          <Route path="/process/payment" Component={Payment}></Route>
        </Routes>
        </Elements>}
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/contact" Component={Contact}></Route>
        <Route path="/about" Component={About}></Route>
        <Route path="/product/:id" Component={ProductDetails}></Route>
        <Route path="/products" Component={Products}></Route>
        <Route path="/products/:keyword" Component={Products}></Route>
        <Route path="/search" Component={Search}></Route>
        <Route path="/login" Component={LoginSignUp}></Route>
        <Route path="/password/forgot" Component={ForgotPassword}></Route>
        <Route path="/user/reset/:token" Component={ResetPassword}></Route>
        <Route path="/cart" Component={Cart}></Route>

        {/* protected routes */}
        <Route
          path="/account"
          Component={isAuthenticated === true ? Profile : LoginSignUp}
        ></Route>
        <Route
          path="/me/update"
          Component={isAuthenticated === true ? UpdateProfile : LoginSignUp}
        ></Route>
        <Route
          path="/password/update"
          Component={isAuthenticated === true ? UpdatePassword : LoginSignUp}
        ></Route>
        <Route
          path="/shipping"
          Component={isAuthenticated === true ? Shipping : LoginSignUp}
        ></Route>
        <Route
          path="/order/confirm"
          Component={isAuthenticated === true ? ConfirmOrder : LoginSignUp}
        ></Route>
        <Route
          path="/success"
          Component={isAuthenticated === true ? OrderSuccess : LoginSignUp}
        ></Route>
        <Route
          path="/orders"
          Component={isAuthenticated === true ? MyOrders : LoginSignUp}
        ></Route>
        <Route
          path="/order/:id"
          Component={isAuthenticated === true ? OrderDetails : LoginSignUp}
        ></Route>
        <Route
          path="/admin/dashboard"
          Component={isAuthenticated === true  && user.role==="admin"? Dashboard : LoginSignUp}
        ></Route>
        <Route
          path="/admin/products"
          Component={isAuthenticated === true  && user.role==="admin"? ProductList : LoginSignUp}
        ></Route>
        <Route
          path="/admin/product"
          Component={isAuthenticated === true  && user.role==="admin"? NewProduct : LoginSignUp}
        ></Route>
        <Route
          path="/admin/product/:id"
          Component={isAuthenticated === true  && user.role==="admin"? UpdateProduct : LoginSignUp}
        ></Route>
        <Route
          path="/admin/orders"
          Component={isAuthenticated === true  && user.role==="admin"? OrderList : LoginSignUp}
        ></Route>
        <Route
          path="/admin/order/:id"
          Component={isAuthenticated === true  && user.role==="admin"? ProcessOrder : LoginSignUp}
        ></Route>
        <Route
          path="/admin/users"
          Component={isAuthenticated === true  && user.role==="admin"? UserList : LoginSignUp}
        ></Route>
        <Route
          path="/admin/user/:id"
          Component={isAuthenticated === true  && user.role==="admin"? UpdateUser: LoginSignUp}
        ></Route>
        <Route
          path="/admin/reviews"
          Component={isAuthenticated === true  && user.role==="admin"? ProductReviews: LoginSignUp}
        ></Route>
        <Route
          path="*"
          Component={NotFound}
        ></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
