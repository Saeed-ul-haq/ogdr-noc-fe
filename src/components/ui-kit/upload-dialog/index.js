import React from 'react'
import { ExpansionList, ExpansionPanel, SVGIcon, FontIcon } from 'react-md'
import { getFileSize } from 'libs/utils/helpers'
import PropTypes from 'prop-types'
import DoneIcon from '@mui/icons-material/Done'
import './styles.scss'
import { Progress } from 'antd'

const UploadProgressDialog = props => {
  const { percent = 0, closeUploadDialog, loaded, total,fileName,extension,status } = props

  return (
    <div className="upload-progress-container">
      <ExpansionList>
        <ExpansionPanel
          expanded={true}
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
              <DoneIcon />
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
