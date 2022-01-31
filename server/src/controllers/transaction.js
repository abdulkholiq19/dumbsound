const Joi = require("joi");
const { transaction, user } = require("../../models");

exports.getTransactions = async (req, res) => {
  try {
    let data = await transaction.findAll({
    order: [
      ['id', 'DESC'],
    ],
    include: 
      {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    
    data = JSON.parse(JSON.stringify(data))
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

exports.getTransactionByUserId = async (req, res) => {
  try {
    let data = await transaction.findOne({
    where:{
      userId: req.user.id
    },
    include: 
      {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    
    data = JSON.parse(JSON.stringify(data))
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

exports.addTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      accountNumber: Joi.string().min(4).required(),
    });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
    
    const dataBody = {...req.body};
    const dateStart = new Date()
    const now = new Date()
    const next30days = new Date(now.setDate(now.getDate() + 30))

    const newData = await transaction.create({
      ...dataBody,
      attache: req.file.filename,
      startDate: dateStart.toLocaleDateString("en-US"),
      dueDate: next30days.toLocaleDateString("en-US"),
      userId: req.user.id,
      attache: req.file.filename,
      status : "pending"
    })

    let data = await transaction.findOne({
      where: {
        id: newData.id
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
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


exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await transaction.update(req.body, {
      where: {
        id,
      },
    });
    
    let transactionData = await transaction.findOne({
      where: {
        id
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    })

    transactionData = JSON.parse(JSON.stringify(transactionData))

    res.send({
      status: "success",
      data: transactionData
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};