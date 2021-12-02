import React, { Component } from 'react'
import ActionsBar from 'components/common/right-side-bar/action-bar'
import DemoBar from 'components/common/right-side-bar/demo-bar'
import './styles.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
@connect(({ app }) => ({
  showActionBar: app.showActionBar,
}))
class RightSideBar extends Component {
  render() {
    const {
      renderActions,
      renderTitle,
      renderMessage,
      showActionBar,
      entity,
      onRenameMap,
      onRenameFolder,
      addMapDescription,
      createTags,
      addFolderDescription,
      addDatasetDescription,
      deleteTag,
    } = this.props

    return (
      <div className="right-side-bar">
        {!showActionBar ? (
          <DemoBar
            renderActions={renderActions}
            renderTitle={renderTitle}
            renderMessage={renderMessage}
          />
        ) : (
          <ActionsBar
            entity={entity}
            onRenameMap={onRenameMap}
            onRenameFolder={onRenameFolder}
            addMapDescription={addMapDescription}
            addFolderDescription={addFolderDescription}
            createTags={createTags}
            addDatasetDescription={addDatasetDescription}
            deleteTag={deleteTag}
          />
        )}
      </div>
    )
  }
}

RightSideBar.propTypes = {
  renderActions: PropTypes.func,
  renderImage: PropTypes.func,
  renderTitle: PropTypes.string,
  renderMessage: PropTypes.string,
  showActionBar: PropTypes.bool,
  entity: PropTypes.shape(),
  onRenameMap: PropTypes.func,
  onRenameFolder: PropTypes.func,
  addMapDescription: PropTypes.func,
  createTags: PropTypes.func,
  addFolderDescription: PropTypes.func,
  addDatasetDescription: PropTypes.func,
  deleteTag: PropTypes.func,
}

export default RightSideBar
