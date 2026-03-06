import React from 'react'
import { hot } from 'react-hot-loader'

const HelloWorld = () => {
    return (
        <div>
            <h1>Ohayo Sekai!</h1>
        </div>
    )
}

export default hot(module) (HelloWorld)