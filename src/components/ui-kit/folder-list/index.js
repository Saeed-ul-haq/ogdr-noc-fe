import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SVGIcon } from 'react-md'
import ContextMenu from 'components/ui-kit/context-menu'
import RenameDialog from 'components/ui-kit/rename-dialog'
import DeleteDialog from 'components/ui-kit/delete-dialog'
import './styles.scss'

export default class FolderList extends Component {
  state = {
    folderId: '',
    showRenameDialog: false,
    showDeleteDialog: false,
  }

  onFolderClick = id => {
    const { getSelectedFolderId } = this.props
    this.setState({ folderId: id })
    getSelectedFolderId(id)
  }

  onOpenClick = () => {
    const { folderId } = this.state
    const { openFolder } = this.props
    openFolder(folderId)
  }

  onBlur = () => {
    this.setState({ folderId: '' })
  }

  toggleRenameDialog = () => {
    const { showRenameDialog } = this.state
    this.setState({ showRenameDialog: !showRenameDialog })
  }

  toggleDeleteDialog = () => {
    const { showDeleteDialog } = this.state
    this.setState({ showDeleteDialog: !showDeleteDialog })
  }

  getDefaultValue = () => {
    const { folders } = this.props
    const { folderId } = this.state
    const selectedFolder =
      folders.length !== 0 &&
      folderId &&
      folders
        .filter(f => {
          return f.key === folderId
        })
        .pop()
    return selectedFolder && selectedFolder.name
  }

  render() {
    const menuItems = [
      {
        leftIcon: (
          <SVGIcon>
            <path
              fill="rgba(0, 0, 0, 0.54)"
              d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
            />
          </SVGIcon>
        ),
        primaryText: 'Open',
        onClick: this.onOpenClick,
      },
      {
        leftIcon: (
          <SVGIcon>
            <path
              fill="rgba(0, 0, 0, 0.54)"
              d="M20.71,4.04C21.1,3.65 21.1,3 20.71,2.63L18.37,0.29C18,-0.1 17.35,-0.1 16.96,0.29L15,2.25L18.75,6M17.75,7L14,3.25L4,13.25V17H7.75L17.75,7Z"
            />
          </SVGIcon>
        ),
        primaryText: 'Rename',
        onClick: this.toggleRenameDialog,
      },
      {
        leftIcon: (
          <SVGIcon>
            <path
              fill="rgba(0, 0, 0, 0.54)"
              d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
            />
          </SVGIcon>
        ),
        primaryText: 'Delete',
        onClick: this.toggleDeleteDialog,
      },
    ]

    const { folders, onRenameFolder, deleteFolder } = this.props
    const { showRenameDialog, folderId, showDeleteDialog } = this.state
    return (
      <React.Fragment>
        <div
          className="heading"
          style={{ display: folders.length === 0 && 'none' }}
        >
          Folders
        </div>
        <div
          style={{ display: folders.length === 0 && 'none' }}
          className="folders-main-container"
        >
          <RenameDialog
            onRenameFolder={onRenameFolder}
            showRenameDialog={showRenameDialog && showRenameDialog}
            onHideDialog={() => this.toggleRenameDialog()}
            defaultValue={this.getDefaultValue()}
          />
          <DeleteDialog
            onDeleteFolder={deleteFolder}
            showDeleteDialog={showDeleteDialog && showDeleteDialog}
            onHideDialog={() => this.toggleDeleteDialog()}
            selectedFolderId={folderId}
          />
          {folders && folders.length !== 0 ? (
            folders.map((fol, index) => {
              return (
                <div
                  key={index}
                  className={
                    folderId === fol.key
                      ? 'folder-outer--component selected'
                      : 'folder-outer--component'
                  }
                  onClick={() => {
                    this.onFolderClick(fol.key)
                  }}
                >
                  <div className="actions">
                    <ContextMenu menuItems={menuItems} />
                  </div>
                  <div className="folder-icon--svg ">
                    <SVGIcon size={35} className="folder--icon">
                      <path
                        d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
                        fill="#8c949c"
                      />
                    </SVGIcon>
                  </div>
                  <div className="folder-heading--para">
                    <div className="folder-heading--span">{fol.name}</div>
                    <div className="folder-heading--date">{fol.time} PM</div>
                  </div>
                </div>
              )
            })
          ) : (
            <div></div>
          )}
        </div>
      </React.Fragment>
    )
  }
}

FolderList.propTypes = {
  folders: PropTypes.array,
  deleteFolder: PropTypes.func,
  onRenameFolder: PropTypes.func,
  openFolder: PropTypes.func,
  getSelectedFolderId: PropTypes.func,
}
