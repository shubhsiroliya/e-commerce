import React from 'react';
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import profilePng from '../../images/Profile.png';



const ReviewCard = ({review}) => {
    const { product} = useSelector(
        (state) => state.productDetails
      );
    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: product.ratings,
        isHalf: true,
      };

  return <div className="reviewsCard">
    <img src={profilePng} alt="User" />
    <p>{review.name}</p>
    <ReactStars{...options}/>
    <span>{review.comment}</span>

  </div>
}

export default ReviewCard