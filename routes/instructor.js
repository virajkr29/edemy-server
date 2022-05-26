import express from 'express'

import { requireSignin } from '../middlewares'
import {getAccountStatus, makeInstructor,instructorCourses} from '../controllers/instructorController'


const router = express.Router()

router.post('/make-instructor',requireSignin,makeInstructor)
router.post('/get-account-status',requireSignin,getAccountStatus)


router.get('/instructor-courses',requireSignin,instructorCourses)

module.exports = router;