import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import ArrowUp from '@material-ui/icons/ArrowUpward'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import {read, update} from './api-course.js'
import {Link, Redirect} from 'react-router-dom'
import auth from './../auth/auth-helper'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
      }),
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  details: {
    margin: '16px',
  },
  upArrow: {
      border: '2px solid #f57c00',
      marginLeft: 3,
      marginTop: 10,
      padding:4
 },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 250,
    display: 'inline-block',
    width: '50%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  textfield:{
    width: 350
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  },  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  },
  list: {
    backgroundColor: '#f3f3f3'
  }
}))

export default function EditCourse({match}) {
    const classes = useStyles()
    const [course, setCourse] = useState({
        name: '',
        description: '',
        image: '',
        category: '',
        instructor: {},
        lessons: []
    })

    const [values, setValues] = useState({
        redirect: false,
        error: ''
    })

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        read({courseId: match.params.courseId}, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCourse(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, match.params.courseId)

    const handleChange = name => event => {
        const value = name === 'image'
        ? event.target.files[0]
        : event.target.value
        setCourse({ ...course, [name]: value })
    }

    const clickSubmit = () => {
        let courseData = new FormData()
        course.name && courseData.append('name', course.name)
        course.description && courseData.append('description', course.description)
        course.image && courseData.append('image', course.image)
        course.category && courseData.append('category', course.category)
        courseData.append('lessons', JSON.stringify(course.lessons))
        update({
            courseId: match.params.courseId
        }, {
            t: jwt.token
        }, courseData).then((data) => {
            if (data && data.error) {
                console.log(data.error)
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, redirect: true })
            }
        })
    }

    const handleLessonChange = (name, index) => event => {
        const lessons = course.lessons
        lessons[index] [name] = event.target.value
        setCourse({ ...course, lessons: lessons })
    }

    const moveUp = index => event => {
        const lessons = course.lessons
        const moveUp = lessons[index]
        lessons[index] = lessons[index-1]
        lessons[index-1] = moveUp
        setCourse({ ...course, lessons: lessons })
    }

    return (
        <div>
            <CardHeader
                title={<TextField label="Title" 
                    type="text" fullWidth value={course.name} 
                    onChange={handleChange('name')} />}
                subheader={<div>
                    <Link to={"/user/"+course.instructor._id}>By {course.instructor.name}</Link>
                    {<TextField 
                        label="Category"
                        type="text"
                        fullWidth
                        value={course.category}
                        onChange={handleChange('category')}
                    />}
                </div>}
                action={<Button variant="contained" color="secondary" onClick={updateCourse}>Save</Button>}
            />
            <div className={classes.flex}>
                <CarMedia image={imageUrl} title={course.name} />
                <div className={classes.details}>
                    <TextField
                        multiline
                        rows="5"
                        label="Description"
                        type="text"
                        value={course.description}
                        onChange={handleChange('description')}
                    /><br />
                    <input accept="image/*"
                        onChange={handleChange('image')}
                        type="file"
                    />
                    <label htmlFor="icon-button-file">
                        <Button variant="outlined" color="secondary" component="span">
                            Change Photo
                            <FileUpload />
                        </Button>
                    </label> <span>
                        {course.image ? course.image.name : ''}
                    </span><br />
                </div>
            </div>

            <ListItemText
                primary={<>
                    <TextField 
                        label="title"
                        type="text"
                        fullWidth
                        value={lesson.title}
                        onChange={handleLessonChange('title', index)}
                    /><br />
                    <TextField
                        multiline
                        rows="5"
                        label="Content"
                        type="text"
                        fullWidth
                        value={lesson.content}
                        onChange={handleLessonChange('content', index)}
                    /><br />
                    <TextField
                        label="Resource link"
                        type="text"
                        fullWidth
                        value={lesson.resource_url}
                        onChange={handleLessonChange('resource_url', index)}
                    /><br />
                </>}
            />
            { index != 0 &&
                <IconButton color="primary" onClick={moveUp(Index)}>
                    <ArrowUp />
                </IconButton>
            }
        </div>
    )
}