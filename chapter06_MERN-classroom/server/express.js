import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template.js'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import devBundle from './devBundle.js'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import StaticRouter from 'react-router-dom/StaticRouter'
import MainRouter from './../client/MainRouter.js'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme.js'

const app = express()
const CURRENT_WORKING_DIR = process.cwd()
// Import the middleware, along with the client-side webpack config
// Initiate webpack to compile and bundle the client-side code
// Enable hot reloading.
devBundle.compile(app)
// Could have also use -> app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())
// Configuring express to serve static files from the dist folder
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// Mounting routes
app.use('/', userRoutes)
app.use('/', authRoutes)

// Handling auth-related errors thrown by express-jwt
// when trying to validate JWT tokens in incoming requests
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            "error": err.name + ": " + err.message
        })
    } else if (err) {
        res.status(400).json({
            "error" : err.name + ": " + err.message
        })
    }
})

app.get('*', (req, res) => {
    // 1. Generate CSS styles using Material-UI's ServerStyleSheets
    // 2. User renderToString to generate markup which renders
        // components specific to the route rendered
    const sheets = new ServerStyleSheets()
    const context = {}
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    )
    if (context.url) {
        return res.redirect(303, context.url)
    }
    const css = sheets.toString()
    res.status(200).send(Template({
        markup: markup,
        css: css
    }))
    // 3. Return template with markup and CSS Styles in the response
})

export default app