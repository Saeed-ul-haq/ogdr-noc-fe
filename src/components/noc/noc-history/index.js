import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
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
      title: 'assignedTo',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
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
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
  ]

  useEffect(async () => {
    const subject =
      'CiQ2ZDFmNmZkZS03OTY1LTQ0NWUtYmJmNy1iNThiZTBkOTk1NWUSBWxvY2Fs'
    const response = await getNocLists(
      `CiRiM2NjYzNlYS0yMzBlLTRhNTUtODlhZC05Zjg0ZTRhNWQxNzgSBWxvY2Fs`,
    )
    const data = await response.json()
    console.log(data)
    setlistData(data)
  }, [])

  return (
    <div className="noc-history-container" id="top">
      <h4>History</h4>
      <Table columns={columns} dataSource={listData} />
    </div>
  )
}
