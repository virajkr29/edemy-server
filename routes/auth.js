import express from 'express'
const {register,login,logout,currentUser,sendTestEmail, forgotPassword,resetPassword} = require('../controllers/authController')
import { requireSignin } from '../middlewares'


const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)
router.get("/logout",logout)

router.get("/current-user", requireSignin,currentUser)
router.get('/send-email',sendTestEmail)


module.exports = router;