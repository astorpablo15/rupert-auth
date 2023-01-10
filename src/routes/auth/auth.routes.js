const router = require("express").Router();
const UserService = require("../../services/user/user.service");
const UserDTO = require("../../dto/user.dto");
const JwtService = require("../../services/jwt/jwt.service");
const httpStatus = require("http-status");
const basicDecode = require("basic-auth");
const _ = require("lodash");
const md5 = require("md5");

const authMiddleware = require('../../middlewares/authMiddleware');

const userService = new UserService();
const jwtService = new JwtService();

router.post("/signin", async (req, res) => {
  try {
    const { name, pass } = basicDecode(req);
    if (_.isNil(name) || _.isNil(pass)) {
      return res.status(400).json({
        success: false,
        message: `${httpStatus[400]}: Username or password missing`,
      });
    }
    const userData = await userService.getUserByCondition({
      username: name,
      password: md5(pass),
    });
    if (!userData) {
      return res.status(403).json({
        success: false,
        message: `${httpStatus[403]}: Bad username or password`,
      });
    }
    const userDataFormatted = new UserDTO(userData).build();

    const accessToken = jwtService.generateJwt(userDataFormatted);

    return res.status(200).json({
      success: true,
      expiresIn: 60 * 60,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: `${httpStatus[500]}: Internal error`,
    });
  }
});

router.post("/signUp", async (req, res) => {
  try {
    const { username, password, fullName } = req.body;
    if (_.isNil(username) || _.isNil(password) || _.isNil(fullName)) {
      return res.status(400).json({
        success: false,
        message: `${httpStatus[400]}: Username, password or name missing`,
      });
    }
    const checkUser = await userService.getUserByCondition({ username });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        message: `${httpStatus[409]}: User already exists`,
      });
    }
    const newUser = await userService.createUser({
      username,
      password: md5(password),
      fullName,
    });
    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: `${httpStatus[500]}`,
      });
    }

    const userDataFormatted = new UserDTO(newUser).build();

    const accessToken = jwtService.generateJwt(userDataFormatted);

    res.status(200).json({
      success: true,
      expiresIn: 60 * 60,
      accessToken,
      data: userDataFormatted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
        success: false,
        message: `${httpStatus[500]}: Internal error`,
    });
  }
});

router.get('/test', authMiddleware, (req, res) => {
    res.status(200).json(req.user); 
});

module.exports = router;
