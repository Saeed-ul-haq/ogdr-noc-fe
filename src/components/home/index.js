import Search from 'components/search'
import Spinner from 'components/ui-kit/loader'
import PropTypes from 'prop-types'
import React, { Suspense, lazy } from 'react'
import AddNoc from 'components/add-noc'
import { Route, Switch, useHistory } from 'react-router-dom'
import './styles.scss'

const NOC = lazy(() => import('components/noc'))

const OgdrNocHome = () => {
  const history = useHistory()
  const { location } = history
  const { pathname } = location
  return (
    <div className="main-container">
      <Suspense fallback={<Spinner text={`Loading Map`} />}>
        <Route>
          <Switch>
            <Route path="/add-noc" exact component={AddNoc} />

            <Route path={'/'} exact component={NOC} />
          </Switch>
        </Route>
      </Suspense>
    </div>
  )
}

OgdrNocHome.propTypes = {
  match: PropTypes.object,
  showToast: PropTypes.func,
}

export default OgdrNocHome
