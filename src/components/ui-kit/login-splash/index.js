import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './styles.scss'

class SSOLoginSplash extends Component {
  state = {
    error: {},
    showDetailError: false,
  }
  componentDidMount() {
    localStorage.setItem('isLoggedIn', true)
    this.props
      .ssoCallback()
      .then(res => {
        this.props.onFinishSSO()
      })
      .catch(error => {
        this.setState({
          error,
        })
      })
  }

  render() {
    const { error = {}, showDetailError = false } = this.state
    return (
      <div className="login-splash">
        {!error.message && (
          <img
            src="/static/images/preloader.gif"
            alt="This is my animated loading image"
            height="100"
            width="100"
          />
        )}
        <p
          style={{
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: '14px',
            margin: '0',
          }}
        >
          {!error.message
            ? `Sit tight! We're Logging you in.`
            : `Snap! We faced an error while trying to Log you in, Please try again.`}
        </p>
        {showDetailError && (
          <p className="error-message">{error.message || ''}</p>
        )}
        {showDetailError && (
          <p className="error-message">{`${error.stack || ''}`}</p>
        )}
        {!error.message ? (
          <p>You will be redirected in a few seconds.</p>
        ) : !showDetailError ? (
          <p
            className="see-detail-link"
            onClick={() => {
              this.setState({
                showDetailError: true,
              })
              console.log({
                error,
              })
            }}
          >
            See details ...{' '}
          </p>
        ) : (
          <p
            className="see-detail-link"
            onClick={() => {
              this.setState({
                showDetailError: false,
              })
            }}
          >
            Hide details ...{' '}
          </p>
        )}
      </div>
    )
  }
}

SSOLoginSplash.propTypes = {
  ssoCallback: PropTypes.func,
  onFinishSSO: PropTypes.func,
}

export default SSOLoginSplash
