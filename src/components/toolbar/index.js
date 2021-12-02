import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { Button, FontIcon } from 'react-md'
import ModulesDropdown from './module-switcher'
import './styles.scss'

const Toolbar = props => {
  const getActiveTab = () => {
    try {
      const { match } = props
      return match.url.split('/')[1] || 'maps'
    } catch (e) {
      return 'maps'
    }
  }

  const renderTabs = useMemo(() => {
    const activeTab = getActiveTab()
    const { history } = props
    return (
      <div className="left-side">
        <div
          className={
            activeTab === 'maps'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/maps')}
        >
          <div className="control-group">{`${i18n.t(l.capital_maps)}`}</div>
        </div>
        <div
          className={
            activeTab === 'datasets'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/datasets')}
        >
          <div className="control-group">{`${i18n.t(l.capital_datasets)}`}</div>
        </div>
        <div
          className={
            activeTab === 'layers' ||
            activeTab === 'layerGroups' ||
            activeTab === 'themes'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/layers')}
        >
          <div className="control-group">{`${i18n.t(
            l.capital_foundation,
          )}`}</div>
        </div>
        <div
          className={
            activeTab === 'servers'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/servers')}
        >
          <div className="control-group">{`${i18n.t(l.capital_servers)}`}</div>
        </div>
        <div
          className={
            activeTab === 'indices'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/indices')}
        >
          <div className="control-group">{`${i18n.t(l.capital_indices)}`}</div>
        </div>
        <div
          className={
            activeTab === 'charts'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/charts')}
        >
          <div className="control-group">{`${i18n.t(l.capital_charts)}`}</div>
        </div>
        <div
          className={
            activeTab === 'infrastructures'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/infrastructures')}
        >
          <div className="control-group">{`${i18n.t(
            l.capital_infrastructures,
          )}`}</div>
        </div>
        <div
          className={
            activeTab === 'search'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/search')}
        >
          <div className="control-group">{`${i18n.t(l.capital_search)}`}</div>
        </div>
        {FLAG_TOGGLE_COVID_CHARTS === 'true' && (
          <div
            className={
              activeTab === 'covid-dashboard'
                ? 'tabLabelContainer selected'
                : 'tabLabelContainer'
            }
            onClick={() => history.push('/covid-dashboard')}
          >
            <div className="control-group">{`COVID-19`}</div>
          </div>
        )}
        <div
          className={
            activeTab === 'mosd'
              ? 'tabLabelContainer selected'
              : 'tabLabelContainer'
          }
          onClick={() => history.push('/mosd')}
        >
          <div className="control-group">{`MOSD`}</div>
        </div>
      </div>
    )
  }, [props.match])

  const renderRightSideActions = useMemo(() => {
    return (
      <div className="right-side-actions-container">
        {(props.rightActions || []).map(btn => {
          return (
            (btn.render && btn.render()) || (
              <Button
                key={btn.key}
                flat
                tooltipLabel={btn.tooltip}
                className="action-btn"
                primary={btn.primary}
                swapTheming={btn.swapTheming}
                onClick={() => btn.onClick()}
                style={{ color: btn.swapTheming && '#fff' }}
              >
                <FontIcon>{btn.svg}</FontIcon>
                {btn.label}
              </Button>
            )
          )
        })}
      </div>
    )
  }, [props.rightActions])

  return (
    <div className="toolbar-container">
      <div className="toolbar-left-container">{renderTabs}</div>
      <div className="toolbar-right-container">
        {<ModulesDropdown />}
        {renderRightSideActions}
      </div>
    </div>
  )
}

Toolbar.propTypes = {
  toggleDialogContainer: PropTypes.func,
  onUploadFile: PropTypes.func,
  history: PropTypes.object,
  getBarModules: PropTypes.func,
  match: PropTypes.object,
  rightActions: PropTypes.array,
}

export default Toolbar
