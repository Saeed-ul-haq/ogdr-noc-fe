import React, { useEffect, useState } from 'react'
import { Table, Button } from 'antd'
import { getFileIcon } from 'libs/utils'
import './styles.scss'
import getNocLists from 'libs/utils/noc-apis/noc-list'
import download from 'images/svg/download.svg'
export default function NocHistory() {
  const [listData, setlistData] = useState([])
  const [scroll, setScroll] = useState(false)
  const getIcon = url => {
    const ext = url.split('.').pop()
    return getFileIcon(ext)
  }

  const columns = [
    {
      title: 'CreatedBy',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },

    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'pdfUrl',
      dataIndex: 'pdfUrl',
      key: 'pdfUrl',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'File',
      dataIndex: 'url',
      key: 'url',
      render: (url) => (
        <div className='file-icon'> 
          <img width="47px" height="47px" src={getIcon(url)} />
          <a href={url}>
            <img src={download} />
          </a>
        </div>
      ),
    },
    {
      title: 'assignedTo',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
  ]

  useEffect(async () => {
    const subject =
      'CiQ2ZDFmNmZkZS03OTY1LTQ0NWUtYmJmNy1iNThiZTBkOTk1NWUSBWxvY2Fs'
    const response = await getNocLists(subject)
    setlistData(response)
  }, [])

  return (
    <div className="noc-history-container" id="top">
      <h3>History</h3>
      <Table
        className="noc-history-table"
        columns={columns}
        dataSource={listData}
        pagination={{
          defaultPageSize: 6,
          showSizeChanger: true,
          pageSizeOptions: ['6', '12', '18'],
        }}
      />
    </div>
  )
}
