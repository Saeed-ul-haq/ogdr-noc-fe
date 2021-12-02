/* eslint-disable react/no-children-prop */
import React, { Component } from 'react'
import { DialogContainer, TextField, FontIcon } from 'react-md'
import PropTypes from 'prop-types'
import './styles.scss'

export default class BaseDialog extends Component {
  constructor(props) {
    super(props)
    this.textField = React.createRef()
  }
  static propTypes = {
    showDialog: PropTypes.bool,
    actions: PropTypes.array,
    getFileName: PropTypes.func,
    dialogTitle: PropTypes.string,
    defaultValue: PropTypes.string,
    hideTextField: PropTypes.bool,
    dialogHeading: PropTypes.string,
    onHideDialog: PropTypes.func,
  }

  onBlur = () => {
    const { getFileName } = this.props
    const name = this.textField.current.value
    getFileName && getFileName(name)
  }
  hide = () => {
    const { onHideDialog } = this.props
    onHideDialog(false)
  }

  render() {
    const {
      actions,
      showDialog,
      dialogTitle,
      defaultValue,
      hideTextField,
      dialogHeading,
    } = this.props
    return (
      <DialogContainer
        className="simple-action-dialog .custom-bordered-input-container"
        visible={showDialog}
        actions={actions}
        title={
          <div className="addfolder__dialogcontainer--icon">
            {dialogTitle}
            <FontIcon onClick={this.hide}>close</FontIcon>
          </div>
        }
      >
        <div className="dialog-heading">{dialogHeading}</div>
        {!hideTextField && (
          <TextField
            ref={this.textField}
            lineDirection="center"
            placeholder="Type Name..."
            className="input-container md-cell md-cell--bottom"
            onBlur={this.onBlur}
            defaultValue={defaultValue}
          />
        )}
      </DialogContainer>
    )
  }
}
