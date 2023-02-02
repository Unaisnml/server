import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { otpSend } from '../services/NodeMailer.js';

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
      res.status(200).send({
        message: 'Email already exists',
        success: false
      });
    } else {
      otpSend(email)
        .then((response) => {
          // console.log(response, 'backkkkkkkk');
          res.status(200).send({ message: 'OTP Sent', response: response, success: true });
        })
        .catch((err) => console.log('ERROR', err));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

/* REGISTER USER */

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } =
      req.body;
    console.log(req.body);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 100000)
    });

    const saveUser = await newUser.save();
    console.log(saveUser, 'hhh');
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* LOGGING IN */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    const user = await User.findOne({ email: email });

    if (!user) return res.status(400).json({ msg: 'User not exist.' });

    if (user.Active) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentiels.', success: false });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      delete user.password;
      res.status(200).json({ token, user, success: true });
    } else {
      res.status(401).json({ status: 'user have been blocked' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
