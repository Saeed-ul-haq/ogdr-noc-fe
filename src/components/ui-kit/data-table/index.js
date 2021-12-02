import React, { Component } from 'react'
import Table from '@target-energysolutions/react-table-wrapper'
import PropTypes from 'prop-types'
import * as act from 'modules/app/actions'
import { connect } from 'react-redux'
@connect(({ app }) => ({}), {
  getSelected: act.getSelected,
})
class DataTable extends Component {
  state = {
    selectedRowId: -1,
  }

  onRowSelectionChange = selected => {
    const { getSelected } = this.props
    selected && this.setState({ selectedRowId: selected[0].index })
    getSelected && getSelected(selected[0].data)
  }
  render() {
    const { data = [], columnsConfig, title, actions = [] } = this.props
    const { selectedRowId } = this.state
    return (
      <div className="map-table-container">
        <Table
          title={`${title}`}
          multiple={false}
          // loading={loading.status}
          onRowSelectionChange={selected => this.onRowSelectionChange(selected)}
          // selectedRows={this.getSelectedItemIndices(
          //   catalogData.data,
          //   selectedItems
          // )}
          rowsPerPage={10}
          paginationProps={{
            //   page: currentPage,
            //   perPage: recPerPage,
            perPageOptions: [10, 25, 50, 70],
            //   totalCount: totalCount,
            //   totalPages: Math.ceil(totalCount / recPerPage),
            //   onSetPage: this.handleCurrentPageChange,
            //   onSetPerPage: this.handleRecordsPerPageChange,
          }}
          actions={actions}
          data={data}
          columnsConfig={columnsConfig || []}
          selectedRows={[selectedRowId]}
        />
      </div>
    )
  }
}

DataTable.propTypes = {
  columnsConfig: PropTypes.array,
  data: PropTypes.array,
  title: PropTypes.string,
  multipleSelection: PropTypes.bool,
  actions: PropTypes.array,
  setActionBar: PropTypes.func,
  getSelected: PropTypes.func,
}

export default DataTable
