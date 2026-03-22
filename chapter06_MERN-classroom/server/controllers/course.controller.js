import Course from '../models/course.model'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultImage from './../../client/assets/images/default.png'

const create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let course = new Course(fields)
        course.instructor = req.profile
        if (files.image) {
            course.image.data = fs.readFileSync(files.image.path)
            course.image.contentType = files.image.type
        }
        try {
            let result = await course.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const photo = (req, res, next) => {
    if (req.course.image.data) {
        res.set("Content-Type", req.course.image.contentType)
        return res.send(req.course.image.data)
    }
    next()
}

export default {
    create,
    photo
}