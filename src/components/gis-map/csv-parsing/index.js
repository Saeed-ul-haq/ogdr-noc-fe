import '@target-energysolutions/data-table/styles.css'
import '@target-energysolutions/gis-map/styles.css'
// import Table from '@target-energysolutions/react-table-wrapper'
import { Modal } from 'antd'
import SearchSRS from 'components/common/forms-container/search-srs'
import React, { useEffect, useRef, useState } from 'react'
import { SVGIcon } from 'react-md'
import { CSVReader } from 'react-papaparse'
import './styles.scss'
import { Table } from 'antd';


const CSVParseData = ({ username, organizationName, ...rest }) => {
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
  const [selectedRows, setselectedRows] = useState([])

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'SNo',
      key: 'SNo',
    },
    {
      title: 'Lat / Y',
      dataIndex: 'Lat',
      key: 'Lat',
    },
    {
      title: 'Lon / X',
      dataIndex: 'Lon',
      key: 'Lon',
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

  const handleOnFileLoad = async data => {
    setisLoading(true)
    debugger
    const csvfileData = data.slice(1).map(({ data }) => {
      // const input = data.reduce((a, v, i) => ({ ...a, SNo: i, [`X${i}`]: v }))
      return {
        SNo: data[0],
        Lat: data[1],
        Lon: data[2],
      }
    })
   await setCsvData(csvfileData)
    debugger
    setisLoading(false)
    showModal()
  }
  const handleOpenDialog = e => {
    inputRef.current.open(e)
  }

  const renderViewActions = () => {
    let actions = []
    actions.push(
      {
        text: `Delete`,
        icon: (
          <SVGIcon>
            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </SVGIcon>
        ),
        onClick: selectedRow => {
          // this.setState({ data: {} }, () => {
          //   const { onDeleteDataType } = this.props
          //   onDeleteDataType && onDeleteDataType(selectedRow)
          // })
        },
      },
      {
        text: `Edit`,
        icon: (
          <SVGIcon>
            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </SVGIcon>
        ),
        onClick: selectedRow => {
          // this.setState({ data: selectedRow })
        },
      },
    )
    return actions
  }

  useEffect(() => {
    onPostTransformMethodAPICall()
  }, [source, showSourceErr])
  // useEffect(() => {
  //   showModal()
  // }, [csvData])
  
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
      <Modal
        title="Coodinates"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
      >
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
      {/* {csvData.length > 0 &&  <Table
          columnsConfig={columns}
          data={csvData}
          autoFillEmptyRows={false}
          rowsPerPage={10}
          actions={renderViewActions() || []}
          onRowSelectionChange={row => {
            if (row && row[0]) {
              const { data, index } = row[0]
              // this.getDetails(data)
              const selectedRow = []
              selectedRow.push(index)
              setselectedRows(selectedRow)
            } else {
              // this.setState({ details: '' })
            }
          }}
        />} */}
        <Table columns={columns} dataSource={csvData} />
      </Modal>

      <p>
        <b>{username} </b>{' '}
        <span style={{ marginLeft: '8px' }}>{organizationName}</span>
      </p>
    </div>
  )
}

export default CSVParseData
