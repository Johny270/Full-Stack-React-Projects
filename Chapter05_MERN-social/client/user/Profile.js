import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Person from '@material-ui/icons/Person'
import Divider from '@material-ui/core/Divider'
import DeleteUser from './DeleteUser.js'
import auth from './../auth/auth-helper.js'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'
import FollowProfileButton from './FollowProfileButton.js'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle
  },
  about: {
    textAlign: 'center'
  }
}))

export default function Profile({ match }) {
    const classes = useStyles()
    // const [values, setValues] = useState({
    //     user: { following:[], followers:[] },
    //     redirectToSignin: false,
    //     following: false
    // })
    const [values, setValues] = useState({
        user: { following:[], followers:[] },
        redirectToSignin: false,
        following: false
    })

    const photoUrl = values.user._id 
        ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
        : `/api/users/defaultphoto`

    const jwt = auth.isAuthenticated()
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        
        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                setValues({ ...values, redirectToSignin: true })
            } else {
                let following = checkFollow(data)
                setValues({ ...values, user: data, following: following })
                // setUser(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [match.params.userId])

    const checkFollow = (user) => {
        const match = user.followers.some((follower) => {
            return follower._id == jwt.user._id
        })
        return match
    }

    const clickFollowButton = (callApi) => {
        callApi({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, values.user._id).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, user: data, following: !values.following })
            }
        })
    }

    if (values.redirectToSignin) {
        return <Redirect to='/signin' />
    }

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={photoUrl}>
                            <Person />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={values.user.name} secondary={values.user.email} />
                    { auth.isAuthenticated().user && auth.isAuthenticated().user._id == values.user._id
                        ? (<ListItemSecondaryAction>
                                <Link to={"/user/edit/" + values.user._id}>
                                    <IconButton aria-label="Edit" color="primary">
                                        <Edit />
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={values.user._id} />
                            </ListItemSecondaryAction>)
                        : (<FollowProfileButton following={values.following} onButtonClick={clickFollowButton} />)
                        
                    }
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary={values.user.about} secondary={"joined: " + (
                        new Date(values.user.created)).toDateString()} />
                </ListItem>
            </List>
        </Paper>
    )
}