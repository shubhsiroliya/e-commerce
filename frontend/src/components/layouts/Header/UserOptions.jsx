import React, { Fragment, useState } from 'react';
import './UserOptions.css';
import {SpeedDial,SpeedDialAction} from '@material-ui/lab';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListALtIcon from '@material-ui/icons/ListAlt';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useDispatch ,useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import {logout} from '../../../actions/userActions';
import { Backdrop } from '@material-ui/core';

const UserOptions = ({user}) => {
  const {cartItems}=useSelector((state)=>state.cart);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const alert=useAlert();
  const [open,setOpen]=useState(false);
  const options=[
    {icon:<ListALtIcon/>,name:"Orders",func:orders},
    {icon:<PersonIcon/>,name:"Profile",func:account},
    {icon:<ShoppingCartIcon style={{color:cartItems.length>0?"tomato":"unset"}} />,name:`Cart(${cartItems.length})`,func:cart},
    {icon:<ExitToAppIcon/>,name:"Logout",func:logoutUser}
  ]

  if(user.role==="admin")
  {
    options.unshift({icon:<DashboardIcon/>,name:"Dashboard",func:dashboard})
  }

  function dashboard(){
    navigate('/admin/dashboard');
  }
  function orders(){
    navigate('/orders');
  }
  function account(){
    navigate('/account');
  }
  function cart(){
    navigate('/cart');
  }
  function logoutUser(){
    dispatch(logout());
    alert.success('Logout Successfull!');    
  }


  return <Fragment>
    <Backdrop open={open} style={{zIndex:"10"}}/>
    <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        onClose={()=>setOpen(false)}
        onOpen={()=>setOpen(true)}
        open={open}
        direction='down'
        className='speedDial'
        style={{zIndex:"11"}}
        icon={<img
            className='speedDialIcon'
            src={user.avatar.image_url?user.avatar.image_url:"/Profile.png"}
            alt="Profile"
        />}
    >
    {options.map((item)=>(<SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func} tooltipOpen={window.innerWidth<=600?true:false} />))}
    </SpeedDial>    
  </Fragment>
}

export default UserOptions;