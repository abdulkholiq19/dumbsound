const { artist } = require("../../models");
const Joi = require("joi");


exports.getArtists = async (req, res) => {
  try {
    let data = await artist.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    
    data = JSON.parse(JSON.stringify(data))

    res.send({
      status: "success...",
      data : {
        data 
      }
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addArtist = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    old: Joi.number().integer().required(),
    type: Joi.string().required(),
    startCareer: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  try {
    const dataBody = {...req.body};
    const newData = await artist.create(dataBody)

    let data = await artist.findOne({
      where: {
        id: newData.id
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data))

    res.send({
      message: "success",
      data
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

