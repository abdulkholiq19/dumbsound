const { music, artist } = require("../../models");
const Joi = require("joi");

exports.getMusics = async (req, res) => {
  try {
    let data = await music.findAll({
      include: [
        {
          model: artist,
          as: "artist",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          }
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });
    
    data = JSON.parse(JSON.stringify(data))

    data = data.map((item, index) => {
      return{
        ...item,
        thumbnail: process.env.FILE_PATH + item.thumbnail,
        attache: process.env.FILE_PATH + item.attache
      }
    })
    res.send({
      status: "success...",
      data
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addMusic = async (req, res) => {
  const schema = Joi.object({
    tittle: Joi.string().min(4).required(),
    year: Joi.string().required(),
    artistId: Joi.string().required(),
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
    const newData = await music.create({
      ...dataBody,
      thumbnail: req.files.thumbnail[0].filename,
      attache: req.files.attache[0].filename,
    })
    let data = await music.findOne({
      where: {
        id: newData.id
      },
      include: [
        {
          model: artist,
          as: "artist",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          }
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "artistId"],
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

