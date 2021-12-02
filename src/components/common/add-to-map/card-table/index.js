import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.scss'
import { DataTable, TableBody, TableRow, TableColumn, SVGIcon } from 'react-md'

class CardTable extends Component {
  state = {
    dataType: '',
    selected: [],
  }
  getIcon = dataType => {
    switch (dataType) {
      case 'map':
        return (
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#1565c0',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '15px',
            }}
          >
            <SVGIcon size={16}>
              <path
                fill="#fff"
                d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"
              />
            </SVGIcon>
          </div>
        )
      case 'folder':
        return (
          <SVGIcon size={24} style={{ marginRight: '10px' }}>
            <path
              d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
              fill="#8c949c"
            />
          </SVGIcon>
        )
    }
  }

  onSelectRow = id => {
    const { selected } = this.state
    if (selected.includes(id)) {
      const index = selected.indexOf(id)
      selected.splice(index, 1)
      this.setState({ selected: selected })
    } else {
      this.setState({ selected: [...selected, id] })
    }
  }

  render() {
    const { dataList } = this.props
    return (
      <DataTable className="card-table">
        <TableBody>
          {dataList.map(m => (
            <TableRow key={m.key} onClick={() => this.onSelectRow(m.key)}>
              <TableColumn className="first-column">
                <div className="icon-column">
                  {/* {this.getIcon('datasets')} */}
                  {m.name}
                </div>
              </TableColumn>
              <TableColumn className="second-column">{m.layers}</TableColumn>
              <TableColumn className="third-column">{m.date}</TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    )
  }
}

CardTable.propTypes = {
  dataList: PropTypes.array,
}

export default CardTable
