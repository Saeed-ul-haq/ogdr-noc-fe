import React, { useState } from 'react'
import Toolbar from 'components/toolbar'
import './styles.scss'
import { Upload, message, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import uploadFile from 'libs/utils/gis-apis/file-upload-api'
import { createNocRequest } from 'libs/utils/noc-apis/noc-list'
import { map } from 'lodash'
import UploadProgressDialog from 'components/ui-kit/upload-dialog'
import axios from 'axios'
import { getAccessToken } from 'libs/utils/helpers'

const Index = () => {
  const [uploadedList, setUploadedList] = useState([])
  const [showProgress, setshowProgress] = useState(false)
  const [uploadProgress, setuploadProgress] = useState(0)
  const [loaded, setloaded] = useState(0)
  const [total, settotal] = useState(0)
  const [extension, setextension] = useState('')
  const [fileName, setfileName] = useState('')
  const [uploadStatus, setuploadStatus] = useState(null)
  const getOrganizationName = () => {
    return localStorage.getItem('organizationName')
  }
  const { Dragger } = Upload

  const leftToolbar = <h3>Upload File</h3>
  const rightToolbar = <Button>Preview File</Button>

  const props = {
    onChange(info) {
      switch (info.file.status) {
        case 'uploading': {
          setuploadStatus(info.file.status)
        }
        case 'done': {
          setuploadStatus(info.file.status)
        }
        case 'error': {
          setuploadStatus(info.file.status)
        }
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
            setuploadStatus('done')
          })
          .catch(err => {
            message.error({ content: `${err.message}`, key: 'upload' })
          })
      }),
    )
  }

  const onUploadFile = async ({ file }) => {
    const fileExt = file.name.split('.')[1]
    setfileName(file.name)
    setextension(fileExt)
    setshowProgress(true)
    // message.loading({ content: 'Uploadeding File...', key: 'upload' })
    // setUploadedList(file)
    // try {
    //   const response = await uploadFile(file)
    //   const { files = [] } = response
    // await storeFileUrl(files)
    // } catch (err) {
    //   message.error({ content: `${err.message}`, key: 'upload' })
    // }
    const accessToken = getAccessToken()

    const config = {
      onUploadProgress: function(progressEvent) {
        settotal(progressEvent.total)
        setloaded(progressEvent.loaded)
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        )
        debugger
        setuploadProgress(percentCompleted)
      },
    }
    const uploadURL = `https://api.dev.meeraspace.com/fm/upload?bucket=gisfe&share_with=sys:anonymous,sys:authenticated&meta={"fm":{"group":"target-qais-file-group","source":"energy"}}`
    const form = new FormData()
    form.append('file', file)
    axios({
      method: 'POST',
      url: uploadURL,
      data: form,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        mode: 'no-cors',
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
      .then(async res => {
        console.log(res)
        await storeFileUrl(res.data.files)
      })
      .catch(err => {
        debugger
      })
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
          '.pdf',
          '.xsl',
        ]}
        defaultFileList={uploadedList}
        {...props}
        multiple={false}
        customRequest={onUploadFile}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Drag and Drop file <br /> <br />
          <Button type={`primary`}>Browse</Button>
        </p>
      </Dragger>
      {showProgress && (
        <UploadProgressDialog
          percent={uploadProgress}
          closeUploadDialog={() => setshowProgress(false)}
          uploadedList={uploadedList}
          total={total}
          loaded={loaded}
          status={uploadStatus}
          fileName={fileName}
          extension={extension}
        />
      )}
    </div>
  )
}
export default Index
