import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import '@target-energysolutions/gis-map/styles.css'
import { Modal, Table } from 'antd'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import SearchSRS from 'components/common/forms-container/search-srs'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import React, { useRef, useState, useEffect } from 'react'
import { CSVReader } from 'react-papaparse'
import './styles.scss'
import set from 'lodash.set'
import Spinner from 'components/ui-kit/loader'

const CSVParseData = () => {
  const inputRef = useRef(null)
  const [isLoading, setisLoading] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [showSourceErr, setShowSourceErr] = useState(false)
  const [source, setSource] = useState(null)
  const [target, setTarget] = useState(null)
  const [transformation, setTransformation] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [transformMethod, setTransformMethod] = useState(false)
  const [tMethods, settMethods] = useState([])

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

  const onPostTransformMethodAPICall = () => {
    if (source && target) {
      const resquestParams = {
        source,
        target,
      }
      setTransformMethod(true)
      postCrsAPICall({
        apiURL: 'api/v1/transform/transformations',
        resquestParams,
      })
        .then(async response => {
          if (response) {
            const tMethods = response.map(tMethod => {
              return {
                label: `${tMethod.code || ''}: ${tMethod.areaOfUse || ''}`,
                value: tMethod.code || '',
              }
            })
            settMethods(tMethods)
            setTransformMethod(false)
          } else {
            settMethods([]) // this is when we were already on transformation page and user search next transformation method
            setTransformMethod(false)
          }
        })
        .catch(e => {
          console.log({ e })
          settMethods([])
          setTransformMethod(false)
        })
    }
  }
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleOnFileLoad = data => {
    setisLoading(true)
    console.log(data)
    const csvfileData = data.map(({ data }) => {
      const input = data.reduce((a, v, i) => ({ ...a, [`X${i}`]: v }))
      return input
    })
    console.log(csvfileData)
    setCsvData(csvfileData.slice(1))
    setisLoading(false)
    showModal()
  }
  const handleOpenDialog = e => {
    inputRef.current.open(e)
  }

  useEffect(() => {
    onPostTransformMethodAPICall()
  }, [source, showSourceErr])

  if (isLoading) {
    return <Spinner text="CSV Loading" />
  }
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
          <SearchSRS
            label={`source crs`}
            error={showSourceErr}
            onTransformAutocomplete={selectedSRS => {
              setSource(selectedSRS)
              setShowSourceErr(false)
            }}
            onTransformationChange={value => {
              if (value === '') {
                setSource(null)
                setShowSourceErr(false)
                setTransformation(null)
              }
            }}
          />
          <Table columns={columns} dataSource={csvData} />
        </Modal>
      )}
    </div>
  )
}

export default CSVParseData
