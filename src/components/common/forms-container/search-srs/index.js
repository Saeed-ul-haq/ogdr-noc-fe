import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { findSRS } from 'libs/api'
import { CircularProgress } from 'react-md'

import InputTag from 'components/common/forms-container/form-fields/input-tag'

class SearchSRS extends Component {
  constructor(props) {
    super(props)

    this.state = {
      SRSSearched: props.SRS || '',
      isFetching: false,
    }

    this.getCRSQueryDebounced = debounce(this.getCRSQuery.bind(this), 2000) // wait 2 seconds
  }
  /**
   *  Get Query
   */
  getCRSQuery = async search => {
    
    this.setState({ isFetching: true })
    findSRS({
      apiURL: 'api/v1/transform/find',
      search,
    })
      .then(async response => {
        const crsLookups = response.map(crs => {
          return {
            primaryText: `${crs.code || ''} - ${crs.name ||
              ''} - (${crs.authority || ''} ${crs.type || ''})`,
            ...crs,
          }
        })
        this.setState({ crsLookups, isFetching: false })
      })
      .catch(e => {
        this.setState({ isFetching: false })
        console.log({ e })
      })
  }
  render() {
    const {
      onAutocomplete,
      onTransformAutocomplete,
      onTransformationChange,
      disabled = false,
      label = '',
      error = false,
    } = this.props
    const { isFetching } = this.state
    return (
      <Fragment>
        <div className="form-fields">
          <InputTag
            type="autocomplete"
            label={
              `${label} ${
                this.state.crsLookups && this.state.crsLookups.length >= 20
                  ? `${
                      this.state.SRSSearched && this.state.SRSSearched !== ''
                        ? `first_record`
                        : ' '
                    }`
                  : ' '
              }  ` || ``
            }
            placeholder={label}
            items={this.state.crsLookups || []}
            value={this.state.SRSSearched}
            disabled={disabled}
            onChange={value => {
              console.log(value,'search')
              this.setState({ SRSSearched: value })
              this.getCRSQueryDebounced(value)
              onTransformationChange && onTransformationChange(value)
            }}
            onAutocomplete={(value, index, matches) => {
              this.setState({
                SRSSearched: `${matches[index].code || ''} - ${
                  // eslint-disable-next-line standard/computed-property-even-spacing
                  matches[index].name || ''
                } - (${matches[index].authority || ''} ${matches[index].type ||
                  ''})`,
              })
              onAutocomplete && onAutocomplete(matches[index].code || null)
              onTransformAutocomplete &&
                onTransformAutocomplete({
                  code: matches[index].code || null,
                  authority: matches[index].authority || '',
                  name: matches[index].name || '',
                })
            }}
          />
          {isFetching && (
            <CircularProgress
              style={{
                margin: '0 0 0px 10px',
                width: '35px',
                height: '35px',
              }}
            />
          )}
        </div>
        {error ? (
          <div className="form-fields">
            <p className="error">{`${i18n.t(l.required_field)}`}</p>
          </div>
        ) : null}
      </Fragment>
    )
  }
}

export default SearchSRS

SearchSRS.propTypes = {
  onAutocomplete: PropTypes.func,
  onTransformAutocomplete: PropTypes.func,
  onTransformationChange: PropTypes.func,
  SRS: PropTypes.number,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.bool,
  type: PropTypes.string,
}
