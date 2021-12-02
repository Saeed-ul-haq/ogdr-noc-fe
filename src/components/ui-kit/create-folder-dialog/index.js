import React, { Component } from 'react'
import { Button } from 'react-md'
import PropTypes from 'prop-types'
import BaseDialog from 'components/ui-kit/base-dialog'

export default class CreateFolderDialog extends Component {
  static propTypes = {
    showDialog: PropTypes.bool,
    onHideDialog: PropTypes.func,
    onCreateFolder: PropTypes.func,
    folderList: PropTypes.array,
  }

  state = {
    folderName: '',
  }

  hide = () => {
    const { onHideDialog } = this.props
    onHideDialog(false)
  }

  getDate = () => {
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    var date = new Date().getDate()
    var month = new Date().getMonth() + 1
    var year = new Date().getFullYear()
    var hours = new Date().getHours()
    var min = new Date().getMinutes()
    var currentTime = `${hours}:${min}`
    var currentDate = `${months[month - 1]} ${date}, ${year}`
    return { currentTime, currentDate }
  }

  getFileName = value => {
    this.setState({ folderName: value })
  }
  validateSpecialCharactersNotAllowed = value => {
    // eslint-disable-next-line no-useless-escape
    const regexp = /[-!$%^&*()+|~=`{}\[\]:\/;<>?,.@#]/
    return !regexp.test(value)
  }
  createFolder = () => {
    const { folderName } = this.state
    const { onCreateFolder, folderList } = this.props
    const { currentTime, currentDate } = this.getDate()
    this.hide()
    if (folderName !== '') {
      const isNameValid = this.validateSpecialCharactersNotAllowed(folderName)
      if (isNameValid) {
        const file = folderList.find(m => {
          return m.name === folderName
        })
        if (file) {
          alert('Folder with same name already exists...!!!')
        } else {
          onCreateFolder && onCreateFolder(folderName, currentTime, currentDate)
        }
      } else {
        alert('Special characters are not allowed...!!!')
      }
    } else {
      alert('Please Enter Folder Name...')
    }
  }

  render() {
    const { showDialog, onHideDialog } = this.props
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
        onClick={this.createFolder}
      >
        Create
      </Button>,
    ]
    return (
      <BaseDialog
        actions={actions}
        onHideDialog={onHideDialog}
        showDialog={showDialog}
        getFileName={this.getFileName}
        dialogTitle={'Create New Folder'}
        dialogHeading="Name"
      />
    )
  }
}
