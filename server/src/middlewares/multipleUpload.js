const multer = require('multer')

exports.multipleUpload = (imageFile, musicFile) => {
    // menentukan destinasi file upload
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads') // folder yang akan menyimpan file upload
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '')) // rename file upload
        }
    })

    const fileFilter = function (req, file, cb) {
        if (file.fieldname === musicFile) {
            if (!file.originalname.match(/\.(mp3|MP3|wav|WAV|aac|AAC|wma|WMA|flac|FLAC|mp4|MP4|pcm|PCM)$/)) {
                req.fileValidationError = {
                    message: "Only music files are allowed"
                };
                return cb(new Error("Only music files are allowed"), false)
            }
        }
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
    })

    const uploadMultiple = upload.fields([{ name: imageFile, maxCount: 10 }, { name: musicFile, maxCount: 10 }])

    //middleware
    return (req, res, next) => {
        uploadMultiple(req, res, function (err) {
            if (err) {
                if (err.code == 'LIMIT_FILE_SIZE') {
                    req.session.message = {
                        type: "danger",
                        message: "Error, max file size 10MB"
                    }
                    return res.redirect(req.originalUrl)
                }
                req.session.message = {
                    type: "danger",
                    message: err
                }

                req.flash('error', err)
                return res.redirect(req.originalUrl)
            }
            return next()
        })
    }

}