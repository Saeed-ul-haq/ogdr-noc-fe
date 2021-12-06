import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TextField, FileUpload,Autocomplete } from 'react-md'
import './styles.scss'
// import Autocomplete from '@mui/material/Autocomplete'
// import TextField from '@mui/material/TextField';

export default class InputTag extends Component {
  renderSwitch = params => {
    const {
      type,
      value,
      label,
      step,
      placeholder,
      onChange,
      disabled,
      items,
      onAutocomplete,
      rows,
      maxRows,
      className,
      ...rest
    } = params
    switch (type) {
      case 'file':
        return (
          <FileUpload
            label={label || ''}
            value={value || ''}
            placeholder={placeholder || ''}
            disabled={disabled}
            onChange={value => {
              onChange(value || '')
            }}
          />
        )
      case 'number':
        return (
          <TextField
            step={step || '1'}
            type={type || 'number'}
            label={label || ''}
            value={value || ''}
            disabled={disabled}
            placeholder={placeholder || ''}
            onChange={value => {
              onChange(value || '')
            }}
            {...rest}
          />
        )
      case 'textarea':
        return (
          <TextField
            className={
              className
                ? `${className} text-area-input-tag`
                : 'text-area-input-tag'
            }
            rows={rows || 3}
            maxRows={maxRows || 3}
            label={label || ''}
            value={value || ''}
            disabled={disabled}
            placeholder={placeholder || ''}
            onChange={value => {
              onChange(value || '')
            }}
          />
        )
      case 'autocomplete':
        return (
          <Autocomplete
            fullWidth
            style={{ zIndex: '101' }}
            id={`${label || ''}-auto-complete`}
            label={label || ''}
            value={value || ''}
            disabled={disabled}
            placeholder={placeholder || ''}
            data={items || [ ]}
            onChange={value => {
              onChange(value || '')
            }}
            onAutocomplete={(value, index, matches) =>
              onAutocomplete(value, index, matches)
            }
          />
          // <Autocomplete
          //   fullWidth
          //   style={{ zIndex: '101' }}
          //   options={items || []}
          //   sx={{ width: 300 }}
          //   label={label}
          //   placeholder={label}
          //   onChange={value => {
          //     onChange(value || '')
          //   }}
          //   onaut
          //   renderInput={params => <TextField {...params} />}
          // />
        )
      default:
        return (
          <TextField
            label={label || ''}
            value={value || ''}
            disabled={disabled}
            placeholder={placeholder || ''}
            onChange={value => {
              onChange(value || '')
            }}
          />
        )
    }
  }
  render() {
    const { error = false } = this.props
    return (
      <div className={error ? 'input-tag error-tag' : 'input-tag'}>
        {this.renderSwitch(this.props)}
        {error ? <p className="error">{error}</p> : null}
      </div>
    )
  }
}

InputTag.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  items: PropTypes.array,
  onAutocomplete: PropTypes.func,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  className: PropTypes.string,
}
