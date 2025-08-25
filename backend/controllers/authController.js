const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate jsonwebtoken
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@desc Register new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
  try {
    const { email, password, name, profileImageUrl } = req.body;

    //check if user already exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already Exists" });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    //Return user data with JWT
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in register user api ", error: error.message });
  }
};

//@desc Login user
//@route POST /api/auth/login
//@access Public
const loginUser = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({ message: "Invalid email or password" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
      
      //Return user data with jwt
      res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          token: generateToken(user._id)
      })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in login user api ", error: error.message });
  }
};

//@desc get user Profile
//@route Get /api/auth/profile
//@access Public
const getUserProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({message:"User not found "})
        }

        //user found 
         res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in getUser api ", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
