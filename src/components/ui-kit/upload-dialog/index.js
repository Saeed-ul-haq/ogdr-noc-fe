import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { getFileSize } from 'libs/utils/helpers'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { ExpansionList, ExpansionPanel, FontIcon } from 'react-md'
import './styles.scss'

const UploadProgressDialog = props => {
  const {
    closeUploadDialog,
    loaded,
    total,
    fileName,
    extension,
    status,
  } = props

  const [expanded, setexpanded] = useState(true)

  const onExpandToggle = () => setexpanded(false)
  return (
    <div className="upload-progress-container">
      <ExpansionList>
        <ExpansionPanel
          expanded={expanded}
          onExpandToggle={() => setexpanded(!expanded) }
          label={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {`Upload Progress`}
              <FontIcon
                onClick={() => closeUploadDialog && closeUploadDialog()}
              >
                close
              </FontIcon>
            </div>
          }
          footer={null}
        >
          <div className="file-progress-bar">
            <div className="file-extention">
              <p>{extension.toUpperCase()}</p>
            </div>
            <div>
              <p>
                <b>{fileName}</b>
              </p>
              <p>
                <small>
                  {getFileSize(loaded)} / {getFileSize(total)}
                </small>
              </p>
            </div>
            <div className="progress-icon">
              {status !== 'completed' ? (
                <CloseRoundedIcon />
              ) : (
                <CheckCircleOutlineRoundedIcon color="primary" />
              )}
            </div>
          </div>
        </ExpansionPanel>
      </ExpansionList>
    </div>
  )
}

UploadProgressDialog.propTypes = {
  percent: PropTypes.number,
  closeUploadDialog: PropTypes.func,
  total: PropTypes.number,
  loaded: PropTypes.number,
}

export default UploadProgressDialog
