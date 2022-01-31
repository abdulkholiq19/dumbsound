const express = require('express')

const router = express.Router()

const { register, login, checkAuth } = require('../controllers/auth')
const { addTransaction, getTransactions, updateTransaction, getTransactionByUserId } = require('../controllers/transaction');
const { addArtist, getArtists } = require('../controllers/artist');
const { addMusic, getMusics } = require('../controllers/music');
const { getUsers, getUserId } = require('../controllers/user');
const { updateProfile } = require('../controllers/profile');

const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile');
const { multipleUpload } = require('../middlewares/multipleUpload');

router.post('/register', register)
router.post('/login', login)
router.get('/check-auth',auth, checkAuth)

router.post('/transaction',auth,uploadFile('attache'), addTransaction)
router.patch('/transaction/:id',auth, updateTransaction)
router.get('/transactions',auth, getTransactions)
router.get('/transaction',auth, getTransactionByUserId)

router.post('/artist',auth, addArtist)
router.get('/users', getUsers)
router.get('/user',auth, getUserId)

router.patch('/update-profile',auth, updateProfile)

router.get('/artists', getArtists)

router.post('/music',auth, multipleUpload('thumbnail', 'attache'), addMusic)
router.get('/musics', getMusics)


module.exports = router