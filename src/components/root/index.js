import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { LangProvider } from 'libs/langs'
import { hot } from 'react-hot-loader'
import { ConfigProvider } from 'antd'

import store from 'libs/store'
import App from 'components/app'

const Root = () => (
  <ConfigProvider direction={document.dir}>
    <Provider store={store}>
      <LangProvider>
        <Router>
          <App />
        </Router>
      </LangProvider>
    </Provider>
  </ConfigProvider>
)

export default hot(module)(Root)
