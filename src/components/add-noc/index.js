import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import Toolbar from 'components/toolbar'
import UploadProgressDialog from 'components/ui-kit/upload-dialog'
import {
  getOrganizations,
  getUserSubject,
} from 'libs/utils/gis-apis/get-workspaces-api'
import { fileUpload, storeUrl } from 'libs/utils/noc-apis/noc-list'
import { map } from 'lodash'
import React, { useState } from 'react'
import './styles.scss'

const Index = () => {
  const [uploadedList, setUploadedList] = useState([])
  const [showProgress, setshowProgress] = useState(false)
  const [loaded, setloaded] = useState(0)
  const [total, settotal] = useState(0)
  const [extension, setextension] = useState('')
  const [fileName, setfileName] = useState('')
  const [uploadStatus, setuploadStatus] = useState(null)
  const getOrganizationName = async () => {
    const { data } = await getOrganizations()
    return data.meOrganizations[0].Name
  }
  const { Dragger } = Upload

  const leftToolbar = <h3>Upload File</h3>
  const rightToolbar = <Button>Preview File</Button>

  const storeFileUrl = async files => {
    await Promise.all(
      map(files, async ({ id }) => {
        const body = {
          createdBy: localStorage.getItem('sso-username'),
          subject: await getUserSubject(),
          organization: await getOrganizationName(),
          description: 'Housing Permiting',
          url: `https://api.dev.meeraspace.com/fm/download/${id}`,
        }
        await storeUrl(body)
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

  const config = {
    onUploadProgress: function(progressEvent) {
      settotal(progressEvent.total)
      setloaded(progressEvent.loaded)
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      )
      setuploadStatus(
        percentCompleted === 100 ? 'completed' : progressEvent.type,
      )
    },
  }
  const onUploadFile = async ({ file }) => {
    const fileExt = file.name.split('.').pop()
    setfileName(file.name)
    setextension(fileExt)
    setshowProgress(true)

    const res = await fileUpload(file, config)
    await storeFileUrl(res.data.files)
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
          '.xlsx',
          '.json',
          '.dwg',
        ]}
        defaultFileList={uploadedList}
        multiple={false}
        customRequest={onUploadFile}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Drag and Drop file <br /> <br />
          <Button className="browse-btn" type={`primary`}>
            Browse
          </Button>
        </p>
      </Dragger>
      {showProgress && (
        <UploadProgressDialog
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
