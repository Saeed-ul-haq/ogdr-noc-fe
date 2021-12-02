import React from 'react'
import Table from '@target-energysolutions/react-table-wrapper'
import '@target-energysolutions/react-table-wrapper/styles.css'

import PropTypes from 'prop-types'

const DataTabeWrapper = props => {
  const {
    multiple = true,
    selectedRows = [],
    columns = [],
    onRowSelectionChange = () => {},
    data = [],
    ...restProps
  } = props
  return (
    <div className="table-common-container">
      <Table
        selectedRows={selectedRows}
        multiple={multiple}
        onRowSelectionChange={onRowSelectionChange}
        data={data}
        columnsConfig={columns}
        {...restProps}
      />
    </div>
  )
}

DataTabeWrapper.propTypes = {
  multiple: PropTypes.bool,
  selectedRows: PropTypes.array,
  columns: PropTypes.array,
  onRowSelectionChange: PropTypes.func,
  data: PropTypes.array,
}

export default DataTabeWrapper
