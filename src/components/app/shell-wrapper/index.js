/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import i18n from 'i18n-js'
import { AppShellSide, ShellProvider } from '@target-energysolutions/app-shell'
import { SVGIcon } from 'react-md'
import withOAuth, {
  cleanUp,
  OauthHelper,
} from '@target-energysolutions/hoc-oauth'

import SSOLoginSplash from 'components/ui-kit/login-splash'

import { changeLang } from 'libs/langs'
import l from 'libs/langs/keys'
import { getAccessToken } from 'libs/utils/helpers'
import oauthConfig from 'libs/oauth'
import { validURL } from 'libs/utils/validURL'
import '@target-energysolutions/gis-map/styles.css'
import './style.scss'
import GIS from 'components/home'
@withRouter
@withOAuth(oauthConfig, {
  isDev: process.env.NODE_ENV !== 'production',
})
class App extends Component {
  signOut = () => {
    cleanUp()
    localStorage.setItem('isLoggedIn', false)
    OauthHelper.redirectToSSO()
  }

  handleNavModChange = ({ subModule }) => {
    this.setState({
      activeNavSubModule: subModule,
    })
    this.handleNavigateJump(subModule)
  }
  handleNavigateJump = value => {
    const { history } = this.props
    history.push(`/${value}`)
  }
  handleNotificationItemClick = item => {
    const { data: itemData } = item
    let { action, url, moduleName } = itemData || {}
    if (moduleName === 'meeting' && action === 'popup') {
      const id = url.split('/').pop()
      // eslint-disable-next-line no-undef
      location.href = `${PRODUCT_APP_URL_WORKSPACE}/meeting/${id}`
      return
    }
    if (moduleName === 'message') {
      const { workspaceId } = itemData
      // eslint-disable-next-line no-undef
      location.href = `${PRODUCT_APP_URL_WORKSPACE}/workspace/details/${workspaceId}`
      return
    }
    if (url) {
      if (validURL(url)) {
        location.href = url
      } else {
        url = url[0] === '/' ? url : `/${url}`
        this.props.history.push(url)
      }
    }
  }
  onLogOut = params => {
    console.log('onLogOut', { params })
  }

  // handleChangeLang = lang => {
  //   i18n.changeLanguage(lang)
  //   // this.setState({ lang })
  // }
  handleChangeLang = lang => {
    changeLang(lang)
    const url = new URL(window.location.href)
    if (url.hostname !== 'localhost') {
      const domainParts = url.hostname.split('.')
      domainParts.shift()
      const options = {
        domain: `.${domainParts.join('.')}`,
      }
      localStorage.setItem('language', lang, options)
    } else {
      localStorage.setItem('language', lang)
    }
    location.reload()
  }

  render() {
    const { ssoCallback, showToast } = this.props
    const productConfig = {
      workspace: PRODUCT_APP_URL_WORKSPACE,
      configurator: PRODUCT_URL_CONFIGURATOR,
      profile: PRODUCT_APP_URL_PROFILE,
      meeting: PRODUCT_APP_URL_FLUXBLE_MEETING,
      edge: PRODUCT_APP_URL_LOAD,
      okr: PRODUCT_APP_URL_WORKSPACE,
      planner: PRODUCT_APP_URL_PLANNER,
      hcm: PRODUCT_APP_URL_HCM,
      media: MEETING_URL,
      taskManagement: PRODUCT_APP_URL_WORKSPACE,
      crm: PRODUCT_APP_URL_CRM,
      sso: OAUTH_HOST,
      peopleSearch: PRODUCT_APP_URL_WORKSPACE,
      amc: PRODUCT_APP_URL_AMC,
      map: PRODUCT_APP_URL_MAP,
      pulse: PRODUCT_APP_URL_PULSE,
      reach: PRODUCT_APP_URL_REACH,
      organisation: PRODUCT_APP_URL_ORGANIZATION,
      pdo: PRODUCT_APP_URL_PDO,
      csr: PRODUCT_APP_URL_CSR,
      was: PRODUCT_APP_URL_CONSUME,
      bi: PRODUCT_APP_URL_BI,
      peopleanalytics: PRODUCT_APP_URL_PEOPLEANALYTICS,
      meetings: '',
      accessToken: getAccessToken(),
    }

    return (
      <Fragment>
        <ShellProvider>
          <AppShellSide
            envURL={PRODUCT_APP_URL_WORKSPACE}
            apps={[]}
            disableSidebar={false}
            accessToken={getAccessToken()}
            notificationAPI={PRODUCT_APP_URL_API}
            meTo={PRODUCT_APP_URL_PROFILE}
            production={'OGDR NOC'}
            onLogoClick={() => {
              window.open(PRODUCT_APP_URL_WORKSPACE, '_self')
            }}
            productConfig={productConfig}
            forcedLogoApp={'ogdr-noc'}
            // eslint-disable-next-line no-undef
            // folioAPI={''}
            // eslint-disable-next-line no-undef
            availableApps={[
              {
                key: 'venue',
                disabled: true,
              },
            ]}
            // actionMenus={[
            //   {
            //     primaryText: i18n.t(l.signout),
            //     onClick: this.signOut,
            //   },
            // ]}
            actionMenus={[
              {
                key: 'signout',
                primaryText: 'Sign Out',
                primaryTextStyle: { color: '#f44336' },
                onClick: this.signOut,
              },
              {
                key: 'profile',
                primaryText: 'My Profile',
                // primaryTextStyle: { color: '#f44336' },
                // onClick: this.signOut
              },
              {
                key: 'update-password',
                weight: 4,
                primaryText: 'Update My Password',
                // onClick: openUpdatePwdDialog
              },
              {
                key: 'home',
                weight: 3,
                primaryText: 'Home Page',
              },
              {
                key: 'select-language',
                weight: 2,
                primaryText: 'Select Language',
              },
            ]}
            title="OGDR NOC"
            l={
              localStorage.getItem('language') ||
              i18n.translations[i18n.currentLocale()]
            }
            lang={localStorage.getItem('language') || i18n.currentLocale()}
            languages={[
              { key: 'en', name: i18n.t(l.english), label: i18n.t(l.english) },
              { key: 'tr', name: i18n.t(l.turkish), label: i18n.t(l.turkish) },
              { key: 'zh', name: i18n.t(l.chinese), label: i18n.t(l.chinese) },
              { key: 'fr', name: i18n.t(l.french), label: i18n.t(l.french) },
              { key: 'ar', name: i18n.t(l.arabic), label: i18n.t(l.arabic) },
            ]}
            onLangChange={this.handleChangeLang}
            navBarCollapsed={false}
            extraContentCollapsed={false}
            onLogOut={this.onLogOut}
            meeraLogoUrl="/"
            onNotificationItemClick={this.handleNotificationItemClick}
            onViewNotificationAll={() =>
              this.props.history.push('/workspace/notification')
            }
            onModuleChange={(module, e) => {
              const { jumpUrl = '', displayName = 'application' } = e || {
                jumpUrl: PRODUCT_APP_URL_WORKSPACE,
              }
              if (jumpUrl !== '') {
                window.open(jumpUrl, '_self')
              } else {
                message.error(
                  `The redirect URL for ${displayName} is missing from the configuration`,
                )
              }
            }}
            logo={'/static/images/logo.svg'}
            routes={
              <Switch>
                <Route
                  path="/sso/callback"
                  exact
                  render={() => (
                    <SSOLoginSplash
                      onFinishSSO={() => {
                        // const { history } = this.props
                        console.log('onFinishSSO')
                        // history && history.push('/')
                      }}
                      ssoCallback={ssoCallback}
                    />
                  )}
                />
                <Route
                  path="/*"
                  render={props => <GIS showToast={showToast} {...props} />}
                />
              </Switch>
            }
            
          />
        </ShellProvider>
      </Fragment>
    )
  }
}
App.propTypes = {
  ssoCallback: PropTypes.func,
  showToast: PropTypes.func,
  match: PropTypes.object,
  updateFilter: PropTypes.func,
  location: PropTypes.string,
  history: PropTypes.object,
  filters: PropTypes.object,
  oauthClient: PropTypes.object,
  onFinishSSO: PropTypes.func,
}

export default App
