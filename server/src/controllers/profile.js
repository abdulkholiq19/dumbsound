const { user } = require("../../models");

const bcrypt = require("bcrypt");
const Joi = require("joi");

exports.updateProfile = async (req, res) => {
  let dataBody;
  if(req.body.email !== undefined){
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
  }

  if(req.body.password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    dataBody = {...req.body, password: hashedPassword}
  }
  try {

    const newData = {
      ...req.body,
    }

    const dataNew = await user.findOne({
      where: {
        id : req.user.id
      },
      attributes: {
        exclude: [ "createdAt", "updatedAt"],
      },
    });

    dataBody = {
      ...req.body,
      fullName: req.body.fullName === "" ? dataNew.fullName :req.body.fullName,
      email: req.body.email === "" ? dataNew.email :req.body.email,
      password: req.body.password === "" ? dataNew.password :dataBody.password,
      gender: req.body.gender === "" ? dataNew.gender :req.body.gender,
      phone: req.body.phone === "" ? dataNew.phone :req.body.phone,
      address: req.body.address === "" ? dataNew.address :req.body.address,
    }

    await user.update(dataBody, {
      where: {
        id: req.user.id,
      },
    });
    
    res.send({
      status: "success",
      data: dataBody
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};