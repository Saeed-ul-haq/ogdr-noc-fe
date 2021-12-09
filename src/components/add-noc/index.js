import React, { useState } from 'react'
import Toolbar from 'components/toolbar'
import './styles.scss'
import { Upload, message, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import uploadFile from 'libs/utils/gis-apis/file-upload-api'
import { createNocRequest } from 'libs/utils/noc-apis/noc-list'
import { map } from 'lodash'
import UploadProgressDialog from 'components/ui-kit/upload-dialog'

const Index = () => {
  const [uploadedList, setUploadedList] = useState([])
  const [showProgress, setshowProgress] = useState(false)
  const [uploadProgress, setuploadProgress] = useState(0)
  const getOrganizationName = () => {
    return localStorage.getItem('organizationName')
  }
  const { Dragger } = Upload

  const leftToolbar = <h3>Upload File</h3>
  const rightToolbar = <Button>Preview File</Button>

  const props = {
    // showUploadList: {
    //   showPreviewIcon: false,
    //   showProgress: false,
    //   showDownloadIcon: false,
    //   showRemoveIcon: false,
    // },
    onChange(info) {
      setuploadProgress(info.file.percent)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
  }

  const storeFileUrl = async files => {
    await Promise.all(
      map(files, async ({ id }) => {
        const body = {
          createdBy:
            'CiQ2ZDFmNmZkZS03OTY1LTQ0NWUtYmJmNy1iNThiZTBkOTk1NWUSBWxvY2Fs',
          subject: 'Building Permit',
          organization: getOrganizationName(),
          description: 'Housing Permiting',
          url: `https://api.dev.meeraspace.com/fm/download/${id}`,
        }
        await createNocRequest(body)
          .then(() => {
            message.success('File uploaded Successfully')
          })
          .catch(err => {
            message.error({ content: `${err.message}`, key: 'upload' })
          })
      }),
    )
  }

  const onUploadFile = async ({ file }) => {
    setshowProgress(true)
    message.loading({ content: 'Uploadeding File...', key: 'upload' })
    setUploadedList(file)
    try {
      const response = await uploadFile(file)
      const { files = [] } = response
      // await storeFileUrl(files)
    } catch (err) {
      message.error({ content: `${err.message}`, key: 'upload' })
    }
  }
  return (
    <div className="add-noc-container">
      <Toolbar leftToolbar={leftToolbar} rightToolbar={rightToolbar} />
      <Dragger
        accept={[
          '.geojson',
          '.kbl',
          '.kml',
          '.kmz',
          '.json',
          '.csv',
          '.gpx',
          '.dxf',
        ]}
        // defaultFileList={uploadedList}
        {...props}
        multiple={true}
        customRequest={onUploadFile}
        
        // onChange={onUploadChange}
        // showUploadList={{
        //   showPreviewIcon: false,
         
        //   showProgress: false,
        //   showDownloadIcon: false,
        //   showUploadList: false,
        //   showRemoveIcon: false,
        // }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
      {showProgress && (
        <UploadProgressDialog
          percent={uploadProgress}
          closeUploadDialog={() => setshowProgress(false)}
          uploadedList={uploadedList}
        />
      )}
    </div>
  )
}
export default Index
