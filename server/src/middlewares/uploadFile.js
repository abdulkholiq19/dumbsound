
const multer = require('multer');

exports.uploadFile = (imageFile) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads') // folder yang akan menyimpan file upload
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '')) // rename file upload
    }
  })

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = {
                message: "Only image files are allowed"
            };
            return cb(new Error("Only image files are allowed"), false)
        }
    }
    cb(null, true)
  }

  const sizeInMB = 10
  const maxSize = sizeInMB * 1024 * 1000 // maksimum file nya adalah kira kira 10 mb

  // generate multer upload
  const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: maxSize
    }
  }).single(imageFile)

  return (req, res, next) => {
    upload(req, res, function (err) {

      if(req.fileValidationError){
        return res.status(400).send(req.fileValidationError)
      }

      if(req.method === 'POST'){
        if(!req.file & !err){
          return res.status(400).send({
            error: {
              message: "Please input files upload"
            }
          })
        }
      }

      // if(!req.file & !err){
      //   return res.status(400).send({
      //     message: "Please input files upload"
      //   })
      // }

      if (err) {
        if (err.code == 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: "Error, max file size 10MB"
          })
        }
        return res.status(400).send(err)
      }

      return next()
    })
  }
}