import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layouts/Loader/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearErrors } from "../../actions/userActions";
import { useAlert } from "react-alert";
import {Link, useNavigate , useLocation} from "react-router-dom";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location=useLocation();
  const alert = useAlert();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = (event) => {
    event.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (event) => {
    event.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  const registerDataChange = (event) => {
    if (event.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setUser({ ...user, [event.target.name]: event.target.value });
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, navigate, isAuthenticated, alert,redirect]);

  const switchTabs = (event, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="login-signup-container">
            <div className="login-signup-box">
              <div>
                <div className="login-signup-toggle">
                  <p onClick={(event) => switchTabs(event, "login")}>Login</p>
                  <p onClick={(event) => switchTabs(event, "register")}>
                    Register
                  </p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form
                className="login-form"
                ref={loginTab}
                onSubmit={loginSubmit}
              >
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password</Link>
                <input type="submit" value="Login" className="login-btn" />
              </form>
              <form
                className="signup-form"
                ref={registerTab}
                onSubmit={registerSubmit}
                encType="multipart/form-data"
              >
                <div className="register-name">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="register-email">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="register-password">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>
                <div id="register-image">
                  <img src={avatarPreview} alt="Avatar Preview " />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signup-btn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
export default LoginSignUp;
