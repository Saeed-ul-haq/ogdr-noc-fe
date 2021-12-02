/* eslint-disable react/no-children-prop */
import React, { Component } from 'react'
import { DialogContainer } from 'react-md'
import PropTypes from 'prop-types'
import './styles.scss'

export default class AddToMapDialog extends Component {
  constructor(props) {
    super(props)
    this.textField = React.createRef()
  }
  static propTypes = {
    showDialog: PropTypes.bool,
    toggleAddMapClick: PropTypes.func,
    actions: PropTypes.array,
    title: PropTypes.func,
    header: PropTypes.func,
    children: PropTypes.func,
    renderHeader: PropTypes.func,
  }

  render() {
    const { actions, showDialog, title, header, children } = this.props
    return (
      <DialogContainer
        className="datalist--dialogbox .custom-bordered-input-container"
        visible={showDialog}
        actions={actions}
        title={header}
      >
        <div> {header()} </div>
        <div className="dialog-heading">{title()}</div>
        {children()}
      </DialogContainer>
    )
  }
}
