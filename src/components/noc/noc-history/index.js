import React, { useEffect, useState } from 'react'
import { Table, Button } from 'antd'
import './styles.scss'
import getNocLists from 'libs/utils/noc-apis/noc-list'
export default function NocHistory() {
  const [listData, setlistData] = useState([])
  const [scroll, setScroll] = useState(false)
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
      render: text => (
        <Button type="primary" size={`small`}>
          <a href={text}>Download</a>
        </Button>
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
