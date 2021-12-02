import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.scss'

@connect(
  ({ app }) => ({
    activeTab: app.activeTab,
  }),
  null,
)
class DemoBar extends Component {
  message = activeTab => {
    if (activeTab) {
      switch (activeTab) {
        case 'maps':
          return 'Select a map to view its details'
        case 'datasets':
          return 'Select a dataset to view its details'
        case 'servers':
          return 'Select a Server to view its details'
        case 'charts':
          return 'Select a Chart to view its details'
      }
    }
  }

  title = activeTab => {
    if (activeTab) {
      switch (activeTab) {
        case 'maps':
          return 'Maps'
        case 'datasets':
          return 'Datasets'
        case 'servers':
          return 'Servers'
        case 'charts':
          return 'Charts'
      }
    }
  }

  render() {
    const { activeTab } = this.props
    return (
      <div className="demo-side-bar">
        <header>{this.title(activeTab)}</header>
        <section>
          <img
            className="section--image"
            src={`/static/images/side-bar-img.PNG`}
            alt="map"
          />
          <div className="message-container">{this.message(activeTab)}</div>
        </section>
      </div>
    )
  }
}

DemoBar.propTypes = {
  activeTab: PropTypes.string,
}

export default DemoBar
