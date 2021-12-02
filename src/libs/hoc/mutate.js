import React from 'react'
import timer from 'react-hoc-timerfuncs'
import { displayName } from 'reactutils'
import { connect } from 'react-redux'
import { isFunction, fromPairs } from 'lodash-es'
import { updateMutation } from 'modules/mutate/actions'
import PropTypes from 'prop-types'

export default function mutate ({ moduleName, mutations }) {
  let options = Object.keys(mutations).filter(op => isFunction(mutations[[op]]))
  const initial = fromPairs(
    options.map(key => [
      `${key}Status`,
      {
        pending: false,
      },
    ]),
  )

  return Comp => {
    @timer
    @connect(
      ({ mutation }) => {
        if (moduleName in mutation) {
          return {
            ...initial,
            ...mutation[moduleName],
          }
        } else {
          return initial
        }
      },
      {
        updateMutation,
      },
    )
    class Mutate extends React.Component {
      static displayName = `Mutate(${displayName(Comp)})`
      constructor (props) {
        super(props)
        this._mutate_apis = fromPairs(
          options.map(key => [
            key,
            this.mutate(mutations[key], `${key}Status`),
          ]),
        )
      }
      render () {
        return <Comp {...this.props} mutations={{ ...this._mutate_apis }} />
      }
      mutate = (api, name) => async (...args) => {
        const { updateMutation } = this.props
        updateMutation({
          moduleName,
          mutationName: name,
          key: 'pending',
          value: true,
        })
        try {
          let data = await api(...args)
          updateMutation({
            moduleName,
            mutationName: name,
            key: 'data',
            value: data,
          })
          return {
            success: true,
            data,
          }
        } catch (e) {
          updateMutation({
            moduleName,
            mutationName: name,
            key: 'error',
            value: e,
          })
        } finally {
          updateMutation({
            moduleName,
            mutationName: name,
            key: 'pending',
            value: false,
          })
        }
        return {
          success: false,
        }
      }
    }
    Mutate.propTypes = {
      updateMutation: PropTypes.func,
    }
    return Mutate
  }
}
