/* eslint-disable no-undef */
import { AppShellSide, ShellProvider } from '@target-energysolutions/app-shell'
import '@target-energysolutions/gis-map/styles.css'
import withOAuth, {
  cleanUp,
  OauthHelper,
} from '@target-energysolutions/hoc-oauth'
import OGDRHome from 'components/home'
import { SVGIcon } from 'react-md'

import SSOLoginSplash from 'components/ui-kit/login-splash'
import i18n from 'i18n-js'
import { changeLang } from 'libs/langs'
import l from 'libs/langs/keys'
import oauthConfig from 'libs/oauth'
import { getAccessToken } from 'libs/utils/helpers'
import { validURL } from 'libs/utils/validURL'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import './style.scss'

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
            actionMenus={[
              {
                key: 'signout',
                primaryText: i18n.t(l.signout),
                primaryTextStyle: { color: '#f44336' },
                onClick: this.signOut,
              },
            ]}
            modules={{
              extraApps: [
                {
                  key: 'gis-map',
                  name: 'GIS MAP',
                  onClick: () => {
                    history.push('/')
                  },
                  icon: (
                    <SVGIcon
                      size="20"
                      style={{ transform: 'translate(3px, 3px)' }}
                    >
                      {/* <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    > */}
                      <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="gis_disable"
                          transform="translate(0.888546, 0.500000)"
                        >
                          <path
                            d="M10.4754395,5.4359812 C11.3283906,5.43740806 12.0294906,4.73807885 12.0303613,3.88500347 C12.0312303,3.02649152 11.3403511,2.33449391 10.4799441,2.33212703 C9.62164962,2.32980293 8.92626581,3.02239079 8.92536408,3.88049888 C8.92449504,4.73481691 9.62177388,5.43454998 10.4754395,5.4359812 L10.4754395,5.4359812 Z M10.881691,0 C11.0726855,0.0411625959 11.2654507,0.0754906476 11.4543637,0.124606168 C13.1689955,0.570529113 14.3797972,2.12069694 14.3512785,3.87583897 C14.3453449,4.24139388 14.2563405,4.61589584 14.1460558,4.96756421 C13.7973697,6.07948242 13.2653937,7.11274125 12.6756346,8.11108176 C11.9995118,9.25561939 11.2787781,10.3737819 10.576715,11.5029729 C10.5504642,11.5452228 10.5168817,11.582906 10.4790743,11.6327981 C10.4510526,11.5994021 10.4298345,11.5783703 10.4135248,11.5540455 C9.29036062,9.88122872 8.22563183,8.1738353 7.35981934,6.35040997 C7.07326554,5.74695078 6.7984858,5.13379896 6.67043129,4.4750421 C6.4318125,3.24758902 6.79935565,2.18040601 7.61499637,1.26299271 C8.24069889,0.559221048 9.04077549,0.162413624 9.9725724,0.030196259 C10.0070868,0.0252878136 10.0401723,0.0102828825 10.0739411,0 L10.881691,0 Z"
                            id="Fill-3"
                            fill="#556485"
                            fillRule="nonzero"
                          ></path>
                          <path
                            d="M0,11.6444852 C2.3204831,10.4413258 4.61142232,9.25348204 6.90413232,8.06473734 C7.28531349,8.72998702 7.65751655,9.37961045 8.03972291,10.046662 C7.98433203,10.0680665 7.93440879,10.0882906 7.88386423,10.1067749 C7.43909073,10.2696545 7.01078227,10.4633828 6.65519958,10.7861907 C6.36255682,11.051837 6.16593941,11.3633369 6.21940418,11.7809897 C6.25777083,12.0806223 6.42906936,12.3067215 6.64292846,12.5020341 C7.04163092,12.8661289 7.52157125,13.0869779 8.03211171,13.235039 C9.79318736,13.7457658 11.5464965,13.7330287 13.2797369,13.1088174 C13.7303819,12.946528 14.1482521,12.7156758 14.4666798,12.3410806 C14.8403119,11.9014951 14.8431078,11.3981931 14.4681399,10.9609687 C14.097894,10.5292429 13.5985063,10.3035476 13.0806342,10.1101922 C13.0288781,10.090869 12.9768734,10.0723536 12.9141509,10.04952 C13.2959534,9.38308985 13.6700204,8.73020448 14.0513569,8.06455094 C16.3477638,9.25531494 18.6385788,10.4431587 20.9554271,11.6445163 C20.8927978,11.6817956 20.852474,11.7086989 20.8096649,11.7309111 C17.4189233,13.489253 14.0276224,15.2465075 10.6386826,17.0082666 C10.5178354,17.0710512 10.4297009,17.0666087 10.3120535,17.0054085 C7.62582912,15.6086141 4.93749221,14.2158893 2.24955917,12.8223257 C1.54656416,12.4578581 0.843600221,12.0932662 0.140853743,11.7282705 C0.101244453,11.7076737 0.0639029885,11.6826655 0,11.6444852"
                            id="Fill-5"
                            fill="#AAB1C2"
                            fillRule="nonzero"
                          ></path>
                          <path
                            d="M0.0097609718,17.0866091 C0.0726698448,17.0495472 0.114298432,17.0223955 0.15816378,16.9995929 C1.24675135,16.4344383 2.33633303,15.8711786 3.42308769,15.3025135 C3.51908197,15.2522796 3.58975737,15.2607606 3.68040828,15.3078879 C5.88908445,16.4562467 8.09962458,17.6010328 10.3073998,18.7511002 C10.4309187,18.8154692 10.5243655,18.8155935 10.6477291,18.7513798 C12.8556286,17.6014988 15.0661066,16.4566195 17.2751245,15.3088509 C17.3579157,15.2658555 17.4249253,15.2456625 17.51831,15.2945295 C18.6142291,15.8680099 19.7127579,16.4365818 20.8103235,17.0068935 C20.8496843,17.027335 20.8865908,17.0525296 20.9441563,17.0872615 C20.8787311,17.1247272 20.8323183,17.1535566 20.7839795,17.1786269 C18.3489556,18.4414643 15.9137765,19.7038978 13.4786594,20.9665177 C12.5230037,21.4620533 11.5670995,21.9570917 10.6127176,22.4550504 C10.5239306,22.50137 10.4540008,22.5134236 10.3564843,22.4627548 C6.96269815,20.6992249 3.56695485,18.939423 0.171646472,17.1788133 C0.123028009,17.1535876 0.0763356458,17.1246651 0.0097609718,17.0866091"
                            id="Fill-7"
                            fill="#556485"
                          ></path>
                        </g>
                      </g>
                      {/* </g> */}
                    </SVGIcon>
                  ),
                },
              ],
            }}
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
                  render={props => <OGDRHome showToast={showToast} {...props} />}
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
