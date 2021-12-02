import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'

import 'libs/langs'
import Root from 'components/root'

import 'styles/index.scss'
import 'normalize.css'
const cs = require('cesium')
window.Cesium = cs

document.dir = localStorage.language === 'ar' ? 'rtl' : 'ltr'

render(<Root />, document.getElementById('root'))
