import React,{ Component } from 'react'
import { routerRedux, Route, Switch } from 'dva/router'
import { LocaleProvider, Spin } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
const { ConnectedRouter } = routerRedux
class App extends Component {
    render() {
        return (
            <div>
                我是公共footer组件2
            </div>
        )
    }
}
function RouterConfig({ history, app }) {
    return (
        <LocaleProvider locale={zhCN}>
            <App/>
        </LocaleProvider>
    )
}

export default RouterConfig
