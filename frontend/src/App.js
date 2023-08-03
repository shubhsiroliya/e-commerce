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
      <div className="wrapper">
      {isAuthenticated === true && stripeApiKey!=="" && <Elements stripe={loadStripe(stripeApiKey)}>
        <Routes>
         <Route path="/process/payment" element={<Payment/>} />
        </Routes>
        </Elements>}
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/contact" element={<Contact/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/product/:id" element={<ProductDetails/>}></Route>
        <Route path="/products" element={<Products/>}></Route>
        <Route path="/products/:keyword" element={<Products/>}></Route>
        <Route path="/search" element={<Search/>}></Route>
        <Route path="/login" element={<LoginSignUp/>}></Route>
        <Route path="/password/forgot" element={<ForgotPassword/>}></Route>
        <Route path="/user/reset/:token" element={<ResetPassword/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>

        {/* protected routes */}
        <Route
          path="/account"
          element={isAuthenticated === true ? <Profile/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/me/update"
          element={isAuthenticated === true ? <UpdateProfile/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/password/update"
          element={isAuthenticated === true ? <UpdatePassword/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/shipping"
          element={isAuthenticated === true ? <Shipping/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/order/confirm"
          element={isAuthenticated === true ? <ConfirmOrder/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/success"
          element={isAuthenticated === true ? <OrderSuccess/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/orders"
          element={isAuthenticated === true ? <MyOrders/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/order/:id"
          element={isAuthenticated === true ? <OrderDetails/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/dashboard"
          element={isAuthenticated === true  && user.role==="admin"? <Dashboard/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/products"
          element={isAuthenticated === true  && user.role==="admin"? <ProductList/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/product"
          element={isAuthenticated === true  && user.role==="admin"? <NewProduct/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/product/:id"
          element={isAuthenticated === true  && user.role==="admin"? <UpdateProduct/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/orders"
          element={isAuthenticated === true  && user.role==="admin"? <OrderList/>: <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/order/:id"
          element={isAuthenticated === true  && user.role==="admin"? <ProcessOrder/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/users"
          element={isAuthenticated === true  && user.role==="admin"? <UserList/> : <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/user/:id"
          element={isAuthenticated === true  && user.role==="admin"? <UpdateUser/>: <LoginSignUp/>}
        ></Route>
        <Route
          path="/admin/reviews"
          element={isAuthenticated === true  && user.role==="admin"? <ProductReviews/>: <LoginSignUp/>}
        ></Route>
        <Route
          path="*"
          element={NotFound}
        ></Route>
      </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
