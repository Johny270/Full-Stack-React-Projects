import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import authCtrl from '../controllers/post.controller.js'

const router = express.router()

router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed)
router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignin, postCtrl.listByUser)
router.get('/api/posts/new/:userId')
    .post(authCtrl.requireSignin, postCtrl.create)
router.route('/api/posts/photo/:postId')
    .get(postCtrl.photo)
router.route('/api/posts/:postId')
    .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove)

router.param('userId', userCtrl.userByID)
export default router
router.param('postById', postCtrl.postByID)