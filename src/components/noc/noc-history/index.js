import React, { useEffect, useState } from 'react'
import { Table, Button } from 'antd'
import { getFileIcon } from 'libs/utils'
import './styles.scss'
import getNocLists from 'libs/utils/noc-apis/noc-list'
import Download from '@mui/icons-material/Download';
import { formatDateTime } from 'libs/utils/helpers'


export default function NocHistory() {
  const [listData, setlistData] = useState([])
  const [scroll, setScroll] = useState(false)
  const getIcon = url => {
    const ext = url.split('.').pop()
    return getFileIcon(ext)
  }
  const getUser = () => {
    return localStorage.getItem('sso-username')
  }

  const columns = [
    {
      title: 'CreatedBy',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: () => getUser(),
    },

    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      hidden: true,
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
      render: (date) => formatDateTime(date)
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
      render: url => (
        <div className="file-icon">
          <img width="47px" height="47px" src={getIcon(url)} />
          <a href={url} title='download' >
           <Download   />
          </a>
        </div>
      ),
    },
    {
      title: 'assignedTo',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
  ].filter(col => !col.hidden)

  useEffect(async () => {
    const subject =
      'CiQ2ZDFmNmZkZS03OTY1LTQ0NWUtYmJmNy1iNThiZTBkOTk1NWUSBWxvY2Fs'
    const response = await getNocLists(subject)
    setlistData(response)
  }, [])

  return (
    <div className='history'>
      <h3 className='title'>History</h3>
      <div className="noc-history-container custom-scroll">
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
    </div>
  )
}
