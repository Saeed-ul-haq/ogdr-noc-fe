import React from 'react'
import { ExpansionList, ExpansionPanel, SVGIcon, FontIcon } from 'react-md'
import { getFileSize } from 'libs/utils/helpers'
import PropTypes from 'prop-types'
import './styles.scss'

const UploadProgressDialog = props => {
  const { percent = 0, closeUploadDialog, uploadedList = {size: 34, name: 'testing'} } = props
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
          {/* {uploadedList.map((m, index) => ( */}
          <div  className="single-upload-info-item">
            <div className="icon-container">
              <SVGIcon size={30}>
                <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11.2,18.46L15.95,13.71L14.78,12.3L11.2,15.88L9.61,14.3L8.45,15.46L11.2,18.46Z" />
              </SVGIcon>
            </div>
            <div className="percentage-container">
              <div className="file-label">{uploadedList.name}</div>
              <div className="progress-bar">
                <div
                  className="progress-line"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="upload-message">
                <div>{`${percent}% Uploaded`}</div>
                <div className="file-size">
                  {getFileSize(uploadedList.size)}
                </div>
              </div>
            </div>
          </div>
          {/* ))} */}
        </ExpansionPanel>
      </ExpansionList>
    </div>
  )
}

UploadProgressDialog.propTypes = {
  percent: PropTypes.number,
  closeUploadDialog: PropTypes.func,
  uploadedList: PropTypes.array,
}

export default UploadProgressDialog
