import React, { useState } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FollowGrid from './FollowGrid.js'
import PostList from './../post/PostList.js'
import NewPost from './../post/NewPost.js'
import auth from './../auth/auth-helper.js'

export default function ProfileTabs (props) {
    const [tab, setTab] = useState(0)

    const handleTabChange = (event, value) => {
        setTab(value)
    }

    const currentUser = auth.isAuthenticated()
    const isOwner = currentUser && currentUser.user._id === props.user._id

    return (
        <div>
            <AppBar position="static" color="default">
                <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                    <Tab label="Posts" />
                    <Tab label="Following" />
                    <Tab label="Followers" />
                </Tabs>
            </AppBar>
            {tab === 0 && (
                <TabContainer>
                    {isOwner && <NewPost addUpdate={props.addPostUpdate} />}
                    <PostList removeUpdate={props.removePostUpdate} posts={props.posts} />
                </TabContainer>
            )}
            {tab === 1 && <TabContainer><FollowGrid people={props.user.following} /></TabContainer>}
            {tab === 2 && <TabContainer><FollowGrid people={props.user.followers} /></TabContainer>}
        </div>
    )
}

ProfileTabs.propTypes = {
    user: PropTypes.object.isRequired
}

const TabContainer = (props) => {
    return (
        <Typography component="div" style={{ padding: 8 * 2 }}>
            {props.children}
        </Typography>
    )
}
TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}