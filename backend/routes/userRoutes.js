const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getPersonalDetails,
  updatePasword,
  getAllUsers,
  getUser,
  updateUserProfile,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const { isAuth, authRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/user/signup").post(signupUser);
router.route("/user/login").post(loginUser);
router.route("/user/forgot").post(forgotPassword);
router.route("/user/reset/:token").put(resetPassword);
router.route("/user/logout").get(logoutUser);

router.route("/me").get(isAuth, getPersonalDetails);
router.route("/updatepassword").put(isAuth, updatePasword);
router.route("/updateprofile").put(isAuth, updateUserProfile);

router.route("/admin/getusers").get(isAuth, authRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuth, authRoles("admin"), getUser)
  .put(isAuth, authRoles("admin"), updateUserRole)
  .delete(isAuth, authRoles("admin"), deleteUser);

module.exports = router;
