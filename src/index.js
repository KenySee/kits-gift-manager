import dva from 'dva'
import createHistory from 'history/createHashHistory'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
import FastClick from 'fastclick'

// 1. Initialize
const app = dva({
    history: createHistory()
})

// 2. Plugins
app.use(createLoading())

// 3. Register global model
app.model(require('./models/global').default)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')


FastClick.attach(document.body)

export default app._store