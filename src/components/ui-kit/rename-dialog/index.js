import React, { Component } from 'react'
import { Button } from 'react-md'
import PropTypes from 'prop-types'
import BaseDialog from 'components/ui-kit/base-dialog'

export default class RenameDialog extends Component {
  static propTypes = {
    showRenameDialog: PropTypes.bool,
    onHideDialog: PropTypes.func,
    onRenameMap: PropTypes.func,
    onRenameFolder: PropTypes.func,
    defaultValue: PropTypes.string,
  }

  state = {
    newName: '',
  }

  hide = () => {
    const { onHideDialog } = this.props
    onHideDialog(false)
  }

  validateSpecialCharactersNotAllowed = value => {
    // eslint-disable-next-line no-useless-escape
    const regexp = /[-!$%^&*()+|~=`{}\[\]:\/;<>?,.@#]/
    return !regexp.test(value)
  }

  getFileName = value => {
    this.setState({ newName: value })
  }

  onRenameClick = () => {
    const { newName } = this.state
    const { onRenameMap, onRenameFolder } = this.props
    this.hide()
    if (newName !== '') {
      const isNameValid = this.validateSpecialCharactersNotAllowed(newName)
      if (isNameValid) {
        onRenameMap && onRenameMap(newName)
        onRenameFolder && onRenameFolder(newName)
      } else {
        alert('Special characters are not allowed')
      }
    } else {
      alert('Please Enter Folder Name')
    }
  }

  render() {
    const { showRenameDialog, defaultValue, onHideDialog } = this.props
    const actions = [
      <Button
        key="cancel-button"
        className="cancel-button"
        flat
        onClick={this.hide}
      >
        Cancel
      </Button>,
      <Button
        key="action-button"
        className="action-button"
        flat
        primary
        swapTheming
        onClick={this.onRenameClick}
      >
        Rename
      </Button>,
    ]
    return (
      <BaseDialog
        actions={actions}
        onHideDialog={onHideDialog}
        showDialog={showRenameDialog}
        getFileName={this.getFileName}
        dialogTitle={'Rename Folder'}
        defaultValue={defaultValue}
        dialogHeading="Name"
      />
    )
  }
}
