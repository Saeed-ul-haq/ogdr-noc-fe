import AddNoc from 'components/add-noc'
import Spinner from 'components/ui-kit/loader'
import PropTypes from 'prop-types'
import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import './styles.scss'
import Topbar from './topbar'

const NOC = lazy(() => import('components/noc'))
const OgdrNocHome = () => {
  return (
    <div className="main-container">
      <Topbar />
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
