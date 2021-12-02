import React, { Component } from 'react'
import { Button } from 'react-md'
import PropTypes from 'prop-types'
import BaseDialog from 'components/ui-kit/base-dialog'

export default class DeleteDialog extends Component {
  static propTypes = {
    showDeleteDialog: PropTypes.bool,
    onHideDialog: PropTypes.func,
    onDeleteFolder: PropTypes.func,
    onDelete: PropTypes.func,
    selectedFolderId: PropTypes.number,
  }

  hide = () => {
    const { onHideDialog } = this.props
    onHideDialog(false)
  }

  onDeleteClick = () => {
    const { onDeleteFolder, selectedFolderId, onDelete } = this.props
    onDeleteFolder && onDeleteFolder(selectedFolderId)
    onDelete && onDelete()
    this.hide()
  }

  render() {
    const { showDeleteDialog, onHideDialog } = this.props
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
        secondary
        swapTheming
        onClick={this.onDeleteClick}
      >
        Delete
      </Button>,
    ]
    return (
      <BaseDialog
        actions={actions}
        onHideDialog={onHideDialog}
        showDialog={showDeleteDialog}
        dialogTitle="Delete"
        dialogHeading="Do you really want to delete this Dataset?"
        hideTextField={true}
      />
    )
  }
}
