import Search from 'components/search'
import Spinner from 'components/ui-kit/loader'
import PropTypes from 'prop-types'
import React, { Suspense, lazy } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import './styles.scss'

const Maps = lazy(() => import('components/gis-map'))

const GISHome = () => {
  const history = useHistory()
  const { location } = history
  const { pathname } = location
  return (
    <div
      className="main-container"
      style={pathname.includes('/explore') ? { maxHeight: 'calc(100%)' } : {}}
    >
      <Suspense fallback={<Spinner text={`Loading Map`} />}>
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
