import { Router } from "express";
import {  changeCurrentPassword, 
          getUserChannelProfile, 
          getWatchHistory, 
          logoutUser, 
          loginUser, 
          registerUser, 
          refreshAccessToken, 
          getCurrentUser,
          updateAccountDetails, 
          updateUserAvatar, 
          updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
  upload.fields([
    {
      name : "avatar",
      maxCount: 1
    },
    {
      name : "coverImage",
      maxCount: 1
    }
  ]),  //this is multer injected as middleware to get the mime files
  registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)  //taking input from params check controller to know more 
router.route("/history").get(verifyJWT, getWatchHistory)

export default router