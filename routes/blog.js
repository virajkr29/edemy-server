import express from 'express'
import { requireSignin } from '../middlewares'
import formidable from 'express-formidable'
import {showAllPosts} from '../controllers/blogController'

const router = express.Router()

router.get('/blog',showAllPosts)

module.exports = router;