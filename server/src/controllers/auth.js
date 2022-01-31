const { user } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(5).required(),
    gender: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
  });

  const emailExist = await user.findOne({
    where: {
      email : req.body.email
    },
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });

  if (emailExist){
    return res.status(400).send({
      error: {
        message: "email already exist",
      },
    });
  }

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
      listAs: '0'
    });

    const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_KEY);
    res.status(200).send({
      message: "success",
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist){
      return res.status(400).send({
        error: {
          message: "email or password correct",
        },
      });
    }
    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    // check if not valid then return response with status 400 (bad request)
    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "credential is invalid",
      });
    }

    const dataToken = {
      id: userExist.id,
      email: userExist.email,
      status: userExist.listAs
    }
    // generate token
    const token = jwt.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      message: "success",
      email: userExist.email,
      status: userExist.listAs,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    console.log('req :', req.user);

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }
    res.send({
      status: "success...",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          listAs: dataUser.listAs,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
