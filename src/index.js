import React from 'react'
import ReactDOM from 'react-dom'
import App from './bussiness/App'
import AppContainer from 'react-hot-loader/lib/AppContainer'
const render = App => {
    ReactDOM.hydrate(
        <AppContainer>
            <App />
        </AppContainer>,
        document.getElementById('root')
    )
}
render(App)

if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./bussiness/App', () => {
        // eslint-disable-next-line
        const App = require('./bussiness/App').default
        render(App)
    })
}