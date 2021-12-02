/* eslint-disable react/prop-types */
import React, { useState, Fragment } from 'react'
import uploadIcon from '../images/upload-image.svg'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import { Upload, message } from 'antd'

const { Dragger } = Upload

const UploadImage = ({ onUploadComplete }) => {
  const [imgSrc, setImgSrc] = useState(null)
  const [imgDetails, setImgDetails] = useState(null)

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    setImgDetails({ name: file.name, size: file.size, type: file.type })

    return isJpgOrPng && isLt2M
  }
  const onFileSelected = info => {
    const myFileItemReader = new FileReader()
    myFileItemReader.addEventListener(
      'load',
      () => {
        setImgSrc(myFileItemReader.result)
        onUploadComplete({ src: myFileItemReader.result, details: imgDetails })
      },
      false,
    )
    myFileItemReader.readAsDataURL(info.file.originFileObj)
  }

  const uploadProps = {
    onChange: onFileSelected,
    beforeUpload: beforeUpload,
  }

  return (
    <Fragment>
      {imgSrc ? (
        <div className="uploadImage">
          <div className="uploadImage-header">
            <div className="uploadImage-header-name">
              {imgDetails && imgDetails.name}
            </div>
            <div className="reupload-btn">
              <Upload {...uploadProps}>{`${i18n.t(l.reupload_image)}`}</Upload>
            </div>
          </div>
          <div className="uploadImage-container">
            <img src={imgSrc} />
          </div>
        </div>
      ) : (
        <Dragger {...uploadProps}>
          <div className="view-img">
            <img width="30px" src={uploadIcon} style={{ margin: '10px' }} />
          </div>
          <p className="ant-upload-hint">{`${i18n.t(l.kroki_image_here)}`}</p>
          <p className="ant-upload-text">{`${i18n.t(l.select_image)}`}</p>
        </Dragger>
      )}
    </Fragment>
  )
}

export default UploadImage
