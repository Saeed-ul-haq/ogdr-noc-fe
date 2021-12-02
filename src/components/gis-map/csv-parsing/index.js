import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import '@target-energysolutions/gis-map/styles.css'
import { Modal, Table } from 'antd'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import React, { useRef, useState } from 'react'
import { CSVReader } from 'react-papaparse'
import './styles.scss'

const CSVParseData = () => {
  const inputRef = useRef(null)
  const [csvData, setCsvData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
 
  const columns = [
    {
      title: 'S.No',
      dataIndex: '0',
      key: 0,
    },
    {
      title: 'X',
      dataIndex: 'X1',
      key: 'X1',
    },
    {
      title: 'Y',
      dataIndex: 'X2',
      key: 'X2',
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleOnFileLoad = data => {
    console.log(data)
    const csvfileData = data.map(({ data }) => {
      const input = data.reduce((a, v, i) => ({ ...a, [`X${i}`]: v }))
      return input
    })
    console.log(csvfileData)
    setCsvData(csvfileData.slice(1))
    showModal()
  }
  const handleOpenDialog = e => {
    inputRef.current.open(e)
  }

  csvData.length && console.log(csvData)

  return (
    <div className="primarybar">
      <CSVReader ref={inputRef} onFileLoad={handleOnFileLoad} noClick noDrag>
        {({ file }) => (
          <aside
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 10,
            }}
          >
            <button
              type="button"
              onClick={handleOpenDialog}
              className="file-upload-btn"
            >
              Browse file
            </button>
          </aside>
        )}
      </CSVReader>
      {isModalVisible && (
        <Modal
          title="Coodinates"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleOk}
        >
          <Autocomplete
            freeSolo
            disabled={isEmpty(csvData)}
            style={{ width: 230 }}
            options={[
              ...map(csvData, item => ({ label: item.X1, lon: item.X2 })),
            ]}
            size={`small`}
            renderInput={params => (
              <TextField
                freeSolo
                {...params}
                label="Source Crs"
                placeholder="Source Crs"
              />
            )}
          />
          <Table columns={columns} dataSource={csvData} />
        </Modal>
      )}
    </div>
  )
}

export default CSVParseData
