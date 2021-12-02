/* eslint-disable react/prop-types */
import React, { lazy, Suspense } from 'react'
import { Snackbar, SVGIcon } from 'react-md'
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as act from 'modules/app/actions'
import { getIcon } from 'libs/utils/getMessageIconByType'
import Spinner from 'components/ui-kit/loader'
import queryString from 'query-string'
import { setCookie } from 'tiny-cookie'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import './styles.scss'
const ShellWrapper = lazy(() => import('components/app/shell-wrapper'))

@withRouter
@connect(
  ({ app }) => ({
    toasts: app.toasts,
    loading: app.loading,
  }),
  {
    dismissToast: act.dismissToast,
    addToast: act.addToast,
    setLoading: act.setLoading,
    resetLoading: act.resetLoading,
  },
)
class App extends React.Component {
  componentDidMount() {
    try {
      let {
        token,
        domain,
        uid,
        refreshToken,
        renewTime,
        expireTime,
      } = queryString.parse(location.search)

      if (token) {
        setCookie('__Secure-id_token', token)
        localStorage.setItem('access_token', token)

        setCookie('__token_domain', domain)
        uid && setCookie('__cfduid', uid)
        refreshToken && localStorage.setItem('oauthRefreshToken', refreshToken)
        renewTime && localStorage.setItem('oauthTokenRenewTime', renewTime)
        expireTime && localStorage.setItem('oauthTokenExpireTime', expireTime)
      }
      if (process.env.NODE_ENV === 'development') {
        window.TOKEN_DOMAIN = null
      }
    } catch (e) {}
  }

  renderLoader = _context => {
    const { loading = [] } = this.props
    if (loading[_context]) {
      return (
        <Spinner
          text={loading[_context].loadingText}
          className="app-main-loader"
        />
      )
    } else {
      return ''
    }
  }

  render() {
    const { toasts, dismissToast, addToast } = this.props
    return (
      <main className="gis-fe-main">
        {this.renderLoader('app')}
        <Suspense fallback={<Spinner text={`${i18n.t(l.loading_app)}`} />}>
          <Switch>
            <Route
              render={() => {
                return (
                  <ShellWrapper
                    showToast={({
                      message = '',
                      type = 'info',
                      autohideTimeout = '1000',
                    }) => {
                      addToast(
                        <CustomMessageSnackbar
                          message={message}
                          icon={getIcon(type)}
                        />,
                      )
                    }}
                  />
                )
              }}
            />
          </Switch>
          <Snackbar
            autohideTimeout="1000"
            autohide
            toasts={toasts}
            onDismiss={dismissToast}
          />
        </Suspense>
      </main>
    )
  }
}

export default App

const CustomMessageSnackbar = props => {
  return (
    <div className="custom-snackbar-message">
      {props.icon && (
        <div className="csm-icon">
          <SVGIcon>
            <path fill={props.icon.fill} d={props.icon.d} />
          </SVGIcon>
        </div>
      )}
      <div className="csm-message" style={{ color: props.icon.fill }}>
        {props.message}
      </div>
    </div>
  )
}
