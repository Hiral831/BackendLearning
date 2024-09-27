import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

const registerUser = asyncHandler(async (req,res) => {

  //get all the necessary user details from the frontend 
  //--mostly all the required and necessay fields from the user model
  //validation - not empty
  //check if user already exists: username , email
  //check for images , avatar 
  //upload them to cloudinary 
  //create user object - create entry in db
  //remove pass and refresh token field from response 
  //check for user creation and return response or error
  
  //data coming from req.body and destructuring

  const {username,email,fullName,password } = req.body
  console.log("-----> req.body: ",req.body)

  if ([username,email,fullName,password].some((field) => 
  field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
  } 

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  console.log("----> existedUser: ",existedUser)

  if (existedUser) {
    throw new ApiError(409, "User with name and email already exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0].path

  console.log("----> req.files: ",req.files)

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImageLocalPath) 
  && req.files.coverImageLocalPath.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  } 
  
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }


  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)


  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email, 
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"   //by deault every fields are included, so use - in front of filed that you don't want 
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )

})

const loginUser = asyncHandler(async (req,res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {username,email,password} = req.body
  if (!username || !email) {
    throw new ApiError(400, "Username or Email is Required!")
  }
  
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })  

  if (!user) {
    throw new ApiError(404, "user doesn't exist")
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password)
 
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "User logged in successfully"
    )
  )
  

})

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $set: {
              refreshToken: undefined // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

export {registerUser, loginUser, logoutUser}