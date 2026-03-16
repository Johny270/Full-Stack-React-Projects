import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper.js'
import PostList from './PostList.js'
import {listNewsFeed} from './api-post.js'
import NewPost from './NewPost.js'

const useStyles = makeStyles(theme => ({
    card: {
        margin: 'auto',
        paddingTop: 0,
        paddingBottom: theme.spacing(3)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        fontSize: '1em'
    },
    media: {
        minHeight: 330
    }
}))

export default function NewsFeed() {
    const [ posts, setPosts ] = useState([])
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        listNewsFeed({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, signal).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setPosts(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    })
}