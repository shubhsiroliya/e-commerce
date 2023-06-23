import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import MetaData from '../layouts/MetaData';

const Search = () => {
    const history =useNavigate();

    const [keyword,setKeyword]=useState('');

    const searchSubmitHandler=(e)=>{
        e.preventDefault();
        if(keyword.trim()){
            history(`/products/${keyword}`);                        
        }
        else{
            history(`/products`);
        }
    }

  return( <Fragment>
    <MetaData title={`Search A Product --ECOMMERCE`}/>
    <form onSubmit={searchSubmitHandler} className="searchBox">
        <input type="text" placeholder='Search a Product' onChange={(e)=>setKeyword(e.target.value)} />
        <input type="submit" value="Search" />
    </form>
  </Fragment>)
}

export default Search