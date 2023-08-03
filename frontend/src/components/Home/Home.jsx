import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from "./ProductCard.jsx";
import MetaData from "../layouts/MetaData";
import { getProduct, clearErrors } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from '../layouts/Loader/Loader';
import {useAlert} from 'react-alert';

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products} = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch,error,alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader/>
      ) : (
        <Fragment>
          <MetaData title="Home" />
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => <Product key={product._id} product={product} />)}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
