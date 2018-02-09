import React from 'react'
import ReactDOM from 'react-dom/server'
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import App from '../src/bussiness/App'

export default ({ clientStats }) => (req,ctx,next) => {
    const app = ReactDOM.renderToString(<App />)
    const chunkNames = flushChunkNames()
    const {
        js,
        styles,
        cssHash,
        scripts,
        stylesheets
    } = flushChunks(clientStats, { chunkNames })
    ctx.set('Content-Type', 'text/html; charset=utf-8')
    ctx.body = `
    <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>react-universal-component-boilerplate</title>
          ${styles}
        </head>
        <body>
          <div id="root">${app}</div>
          ${cssHash}
          ${js}
        </body>
      </html>
	`;
}