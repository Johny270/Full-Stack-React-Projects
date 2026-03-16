import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.router()

router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed)
router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignin, postCtrl.listByUser)

router.param('userId', userCtrl.userByID)
export default router