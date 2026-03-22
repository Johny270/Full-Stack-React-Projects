import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import courseCtrl from '../controllers/course.controller.js'

const router = express.Router()

router.route('/api/courses/by/:userId')
    .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isEducator, courseCtrl.create)
router.route('/api/courses/photo/:courseId')
    .get(courseCtrl.photo, courseCtrl.defaultPhoto)
router.route('/api/courses/defaultphoto')
    .get(courseCtrl.defaultPhoto)

export default router