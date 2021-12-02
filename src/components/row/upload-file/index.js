/* eslint-disable react/prop-types */
import React, { useState, Fragment } from 'react'
import uploadIcon from '../images/cloud-upload-outline.svg'
import { Upload } from 'antd'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
const { Dragger } = Upload

const UploadFile = ({ onUploadComplete }) => {
  const [fileSrc, setFileSrc] = useState(null)
  const [fileDetails, setFileDetails] = useState(null)

  function beforeUpload(file) {
    setFileDetails({ name: file.name, size: file.size, type: file.type })
    return true
  }
  const onFileSelected = info => {
    const myFileItemReader = new FileReader()
    myFileItemReader.addEventListener(
      'load',
      () => {
        setFileSrc(myFileItemReader.result)
        onUploadComplete({
          fileData: myFileItemReader.result,
          details: fileDetails,
        })
      },
      false,
    )
    myFileItemReader.readAsText(info.file.originFileObj)
  }

  const uploadProps = {
    onChange: onFileSelected,
    beforeUpload: beforeUpload,
    accept: '.dxf',
  }

  return (
    <Fragment>
      {fileSrc ? (
        <div className="uploadImage">
          <div className="uploadImage-header">
            <div className="uploadImage-header-name">
              {fileDetails && fileDetails.name}
            </div>
            <div className="reupload-btn">
              <Upload {...uploadProps}>{i18n.t(l.reupload_file)}</Upload>
            </div>
          </div>
          <div className="uploadImage-container">
            {/* <img src={fileSrc} /> */}
          </div>
        </div>
      ) : (
        <Dragger {...uploadProps}>
          <div className="view-img">
            <img width="30px" src={uploadIcon} style={{ margin: '10px' }} />
          </div>
          <p className="ant-upload-hint">{`${i18n.t(l.dxf_file_here)}`}</p>
          <p className="ant-upload-text">{`${i18n.t(l.select_file)}`}</p>
        </Dragger>
      )}
    </Fragment>
  )
}

export default UploadFile
