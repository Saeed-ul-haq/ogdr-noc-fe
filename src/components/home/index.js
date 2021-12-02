import Maps from 'components/gis-map'
import Search from 'components/search'
import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import './styles.scss'

const GISHome = () => {
  const history = useHistory()
  const { location } = history
  const { pathname } = location
  return (
    <div
      className="main-container"
      style={pathname.includes('/explore') ? { maxHeight: 'calc(100%)' } : {}}
    >
      <Suspense fallback={null}>
        <Route>
          <Switch>
            <Route
              path="/explore/:q"
              exact
              render={renderProps => {
                const { history, match } = renderProps
                const { params } = match
                const { q = '' } = params
                return (
                  <Search
                    hideToolBar={true}
                    defaultSearch={decodeURIComponent(q)}
                    history={history}
                  />
                )
              }}
            />
            <Route path={'/'} exact component={Maps} />
          </Switch>
        </Route>
      </Suspense>
    </div>
  )
}

GISHome.propTypes = {
  match: PropTypes.object,
  showToast: PropTypes.func,
}

export default GISHome
