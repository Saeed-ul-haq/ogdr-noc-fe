/* eslint-disable react/no-children-prop */
import React, { Component } from 'react'
import { Button, TextField, FontIcon } from 'react-md'
import PropTypes from 'prop-types'
import AddToMapDialog from 'components/common/add-to-map/add-to-map-dialog'
import CardTable from 'components/common/add-to-map/card-table'
import './styles.scss'

export default class AddToMap extends Component {
  state = {
    value: '',
  }
  static propTypes = {
    showDialog: PropTypes.bool,
    toggleAddMapClick: PropTypes.func,
    dataList: PropTypes.array,
  }

  hide = () => {
    const { toggleAddMapClick } = this.props
    toggleAddMapClick && toggleAddMapClick()
  }

  handleChange = value => {
    this.setState({ value: value })
  }

  renderHeader = () => {
    return (
      <div className="dialogbox--header">
        <div>Add to map</div>
        <TextField
          leftIcon={<FontIcon style={{ cursor: 'pointer' }}>search</FontIcon>}
          placeholder="Search..."
          className="input-container md-cell md-cell--bottom map__dialogbox--searchbar md-text-field-divider-container--grow"
          onChange={value => this.handleChange(value)}
        />
      </div>
    )
  }

  renderTitle = () => {
    return <div>Maps</div>
  }

  renderMapList = () => {
    const { dataList } = this.props
    const { value } = this.state
    const filteredList =
      dataList &&
      dataList.filter(f => {
        return f.name.toLowerCase().includes(value.toLowerCase())
      })
    return <CardTable dataList={filteredList} />
  }

  render() {
    const { showDialog } = this.props
    const actions = [
      <Button
        key="cancel-button"
        className="cancel-button"
        flat
        onClick={this.hide}
      >
        Cancel
      </Button>,
      <Button
        key="action-button"
        className="action-button"
        flat
        primary
        swapTheming
        // onClick={this.createFolder}
      >
        Add
      </Button>,
    ]
    return (
      <AddToMapDialog
        actions={actions}
        showDialog={showDialog}
        header={this.renderHeader}
        title={this.renderTitle}
        children={this.renderMapList}
      />
    )
  }
}
