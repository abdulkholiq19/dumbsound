const { user } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    let data = await user.findAll({
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


exports.getUserId = async (req, res) => {
  try {
    let data = await user.findOne({
      where: {
        id: req.user.id
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

