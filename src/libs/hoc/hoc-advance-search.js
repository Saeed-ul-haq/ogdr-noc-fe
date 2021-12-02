import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import gql from 'graphql-tag'
// import { graphql, compose } from 'react-apollo'
import { filter as filterHOC } from 'libs/hoc/filter'
import { connect } from 'react-redux'
import {
  formatData,
  getConstraintQuery,
  isEmpty,
  getIds,
} from './sharedFunction'
import { updateSessionRequest, executePPDMQuery } from 'libs/trove-apis'
import {
  displayAPIWorkingOverlay,
  hideAPIWorkingOverlay,
} from 'modules/ui/actions'
import { updateSelectedOnEdit } from 'modules/query-search/actions'

// import qSchemaIntrospection from 'libs/queries/schema-introspection.gql'

const AdvanceSearchHoc = (url, key) => WrappedComponent => {
  // @compose(graphql(qSchemaIntrospection, { name: 'qSchemaIntrospection' }))
  @filterHOC('trove')
  @connect(
    ({ querySearch }) => ({
      search: querySearch,
    }),
    {
      displayAPIWorkingOverlay,
      hideAPIWorkingOverlay,
      updateSelectedOnEdit,
    },
  )
  class ApiSearchAdvance extends Component {
    constructor (props) {
      super(props)
      this.state = { [`data${key}`]: [] }
    }

    componentDidMount () {
      if (url !== 'editWorkSet') {
        const {
          switcherProps,
          selectedBasket: { sessionMetadata },
          filters: { schemaMeta },
          client,
          updateFilter,
          displayAPIWorkingOverlay,
          hideAPIWorkingOverlay,
        } = this.props
        updateFilter('workSet', { isLoading: true })

        if (switcherProps.status !== 'search' && schemaMeta) {
          const dataToRender = JSON.parse(sessionMetadata || '{}')
          if (dataToRender) {
            this.fetchData({
              data: formatData(dataToRender, schemaMeta),
              client,
              updateFilter,
              displayAPIWorkingOverlay,
              hideAPIWorkingOverlay,
            })
          }
        }
      }
    }

    static QueryApis = (args, callback) => {
      callback(args)
      return { ...args }
    }
    setStateAsync = state => {
      return new Promise(resolve => {
        this.setState(state, resolve)
      })
    }

    /*     renderData = () => {
          const data = {}
          data[`data${key}`] = this.state[`data${key}`]
          return data
        } */

    static mutationApi = (
      categoryName,
      type,
      field,
      pagination,
      constraintParams,
    ) => {
      const constraint = getConstraintQuery(constraintParams)
      if (field === null) {
        return ` mutation {
          Data {
            ${categoryName} {
              ${type} {
                count(${constraint || 'constraints:[]'})
              }
            }
          }
        }`
      } else {
        return `{
          Data {
            ${categoryName} {
              ${type}(
                limit: ${pagination.enable ? pagination.perPage : 1500},
                offset: ${
                  pagination.enable
                    ? pagination.perPage * (pagination.page - 1)
                    : 0
                },
                ${constraint || 'constraints:[]'}
                ){
                ${field}
              }
            }
          }
        } `
      }
    }
    updateSession = data => {
      const { categoryName, type } = data
      const {
        selectedBasket,
        updateFilter,
        updateSelectedOnEdit,
        filters: { editBasketDraft, workSet },
        search,
        displayAPIWorkingOverlay,
        hideAPIWorkingOverlay,
      } = this.props

      const newSelection = {
        ...selectedBasket,
        sessionMetadata: JSON.stringify(editBasketDraft),
      }
      displayAPIWorkingOverlay()
      updateSessionRequest({ id: selectedBasket.id, ...newSelection }).then(
        res => {
          if (res.success && res.data) {
            const resData = search[categoryName][type].data

            const bigData = editBasketDraft[type].data.map(elem => {
              return resData.find(
                d => d[editBasketDraft[type].primaryKey] === elem,
              )
            })

            updateFilter('workSet', {
              ...workSet,
              [categoryName]: {
                ...workSet[categoryName],
                [type]: { ...workSet[categoryName][type], data: bigData },
              },
            })
            updateSelectedOnEdit({
              moduleName: categoryName,
              mutationName: type,
              value: false,
              ids: getIds(editBasketDraft, type),
            })
            hideAPIWorkingOverlay()
          } else {
            console.log('toast')
          }
        },
      )
    }
    async handleDataType (data) {
      const {
        updateSearch,
        categoryName,
        type,
        constraints,
        fields,
        pagination,
        ids,
        displayAPIWorkingOverlay,
        hideAPIWorkingOverlay,
        removedFilterId,
        filters,
        updateFilter,
        storedFilters,
      } = data

      if (constraints && storedFilters) {
        constraints.constraints = constraints.constraints.concat(storedFilters)
      }

      if (removedFilterId) {
        const newCategory = filters.workSet[categoryName]
        updateFilter('criteriaCache', {
          ...filters.criteriaCache,
          [type]: filters.criteriaCache[type].filter(
            elem => elem.id !== removedFilterId,
          ),
        })
        if (newCategory && newCategory.hasOwnProperty(type)) {
          updateFilter('workSet', {
            ...filters.workSet,
            [type]: (newCategory[type]['data'] = []),
          })
          updateFilter('basketDraft', {
            ...filters.basketDraft,
            [type]: (newCategory[type]['data'] = []),
          })
        }
      }

      let dataTypeCount = 0
      updateSearch({
        moduleName: categoryName,
        mutationName: type,
        key: 'pending',
        value: true,
        dataTypeCount,
        ids,
      })
      try {
        displayAPIWorkingOverlay()
        let res = await executePPDMQuery({
          query: ApiSearchAdvance.mutationApi(
            categoryName,
            type,
            null,
            pagination,
            constraints,
          ),
        })
        if (res && res.data) {
          dataTypeCount = res.data[categoryName][type].count || 0
          const field = fields
            .map(elem => {
              return elem.actualName ? elem.actualName : elem
            })
            .join(' ')
          res = await executePPDMQuery({
            query: ApiSearchAdvance.mutationApi(
              categoryName,
              type,
              field,
              pagination,
              constraints,
            ),
          })
        }
        updateSearch({
          moduleName: categoryName,
          mutationName: type,
          key: 'data',
          value: [...res.data[categoryName][type]],
          dataTypeCount,
          ids,
        })
        hideAPIWorkingOverlay()
        return res
      } catch (e) {
        updateSearch({
          moduleName: categoryName,
          mutationName: type,
          key: 'error',
          value: e,
          dataTypeCount,
          ids,
        })
        if (e) {
          hideAPIWorkingOverlay()
        }
      } finally {
        updateSearch({
          moduleName: categoryName,
          mutationName: type,
          key: 'pending',
          value: false,
          dataTypeCount,
          ids,
        })
      }
    }

    async fetchData (dataToFetched) {
      const {
        updateFilter,
        data,
        displayAPIWorkingOverlay,
        hideAPIWorkingOverlay,
      } = dataToFetched

      let responseObject = {}
      const pagination = {
        enable: true,
        perPage: 15,
        page: 1,
        totalCount: 1500,
      }
      if (!data) return null
      let res = null
      let dataTypeCount = 0
      for (let key of data) {
        if (!responseObject.hasOwnProperty(key.parent)) {
          responseObject[key.parent] = {}
        }
        if (key.data) {
          displayAPIWorkingOverlay()
          res = await executePPDMQuery({
            query: ApiSearchAdvance.mutationApi(
              key.parent,
              key.child,
              null,
              pagination,
              {
                key: key.child,
                constraints: [
                  {
                    conjunction: 'AND',
                    fieldName: key.primaryKey,
                    operator: 'IN',
                    value: key.data.length === 0 ? undefined : key.data.join(),
                  },
                ],
              },
            ),
            fetchPolicy: 'no-cache',
          })
        } else {
          responseObject['error'] = 'please verify you data value'
        }

        if (res && res.data) {
          // dataTypeCount = res.data[key.parent].DataTypeCount
          dataTypeCount = res.data[key.parent][key.child].count || 0
          const newPagination = {
            ...pagination,
            perPage: dataTypeCount,
            totalCount: dataTypeCount,
          }
          res = await executePPDMQuery({
            query: ApiSearchAdvance.mutationApi(
              key.parent,
              key.child,
              key.fields,
              newPagination,
              {
                key: key.child,
                constraints: [
                  {
                    conjunction: 'AND',
                    fieldName: key.primaryKey,
                    operator: 'IN',
                    value: key.data.length === 0 ? undefined : key.data.join(),
                  },
                ],
              },
            ),
            fetchPolicy: 'no-cache',
          })
          if (res && res.data) {
            responseObject[key.parent][key.child] = {
              data: res.data[key.parent][key.child],
            }
          } else {
            responseObject = { ...res.data, error: true, ...responseObject }
          }
        }
      }
      responseObject['isLoading'] = false
      updateFilter('workSet', responseObject)
      hideAPIWorkingOverlay()
    }

    async deleteRowsHandler (dataToFetched) {
      const {
        // client: { mutate, query },
        updateFilter,
        dataConfig,
        qSchemaIntrospection,
        id,
        sessionName,
        userName,
        filters,
        type,
        prevBasket,
        refetch,
        displayAPIWorkingOverlay,
        hideAPIWorkingOverlay,
      } = dataToFetched

      const datas = formatData(dataConfig, qSchemaIntrospection)
      // console.log(basketWithoutEmptyData(datas))

      const [key] =
        datas.length > 0 ? datas.filter(d => d.child === type) : datas

      const pagination = {
        enable: true,
        perPage: 15,
        page: 1,
        totalCount: 1500,
      }
      if (!key) return null

      let res = null
      let dataTypeCount = 0
      let responseObject = { ...filters['workSet'] }
      let newBasketAfterDelete = { ...prevBasket, [type]: { ...key } }
      responseObject['isLoading'] = true
      if (responseObject) {
        displayAPIWorkingOverlay()
        res = await executePPDMQuery({
          query: ApiSearchAdvance.mutationApi(
            key.parent,
            key.child,
            null,
            pagination,
            {
              [key.child]: key.child,
              constraints: [
                {
                  conjunction: 'AND',
                  fieldName: key.primaryKey,
                  operator: 'IN',
                  value: key.data.length === 0 ? undefined : key.data.join(),
                },
              ],
            },
          ),
          fetchPolicy: 'no-cache',
        })
        if (res && res.data) {
          dataTypeCount = res.data[key.parent][key.child].count

          const newPagination = {
            ...pagination,
            perPage: dataTypeCount,
            totalCount: dataTypeCount,
          }
          if (key.data) {
            res = await executePPDMQuery({
              query: ApiSearchAdvance.mutationApi(
                key.parent,
                key.child,
                key.fields,
                newPagination,
                {
                  [key.child]: key.child,
                  constraints: [
                    {
                      conjunction: 'AND',
                      fieldName: key.primaryKey,
                      operator: 'IN',
                      value:
                        key.data.length === 0 ? undefined : key.data.join(),
                    },
                  ],
                },
              ),
              fetchPolicy: 'no-cache',
            })
          } else {
            responseObject['error'] = 'please verify you data value'
          }

          if (res && res.data) {
            const newData = res.data[key.parent][key.child]
            responseObject[key.parent][key.child] = {
              data: newData && newData.count ? [] : newData,
            }
          } else {
            responseObject = { ...res.data, error: true, ...responseObject }
          }
        }
      }
      responseObject['isLoading'] = false
      delete responseObject['isLoading']

      const newData = res.data[key.parent][key.child]
      const newDataKey = newData.map(elem => {
        return elem[key.primaryKey]
      })
      const newBasket = {
        ...newBasketAfterDelete,
        [key.child]: {
          ...newBasketAfterDelete[key.child],
          parent: key.parent,
          primaryKey: key.primaryKey,
          data: newDataKey,
        },
      }
      updateFilter('newBasketDraft', newBasket)
      const newSelection = {
        userName,
        sessionName,
        sessionMetadata:
          Object.keys(newBasketAfterDelete).length > 0
            ? JSON.stringify(newBasketAfterDelete)
            : null,
      }
      updateFilter('workSet', { ...responseObject })
      updateSessionRequest({ id: id, ...newSelection }).then(res => {
        if (res.success && res.data) {
          // const sessionMetadata = JSON.parse(res.data.sessionMetadata)
          updateFilter('newBasketDraft', { ...newBasket })
          refetch(res)
        } else {
          // console.log('toast')
        }
      })
      hideAPIWorkingOverlay()
    }
    async workSet (dataWorkSet) {
      const {
        showSelectedConfig,
        dataConfig,
        // client: { mutate, query },
        updateFilter,
        type,
        qSchemaIntrospection,
        workingSet,
        displayAPIWorkingOverlay,
        hideAPIWorkingOverlay,
      } = dataWorkSet

      const datas = formatData(dataConfig, qSchemaIntrospection)

      const data =
        datas.length > 0 ? datas.filter(d => d.child === type) : datas
      let responseObject = {}
      const pagination = {
        enable: true,
        perPage: 15,
        page: 1,
        totalCount: 1500,
      }
      if (!data) return null
      let res = null
      let dataTypeCount = 0
      for (let key of data) {
        if (!responseObject.hasOwnProperty(key.parent)) {
          responseObject[key.parent] = {}
        }
        displayAPIWorkingOverlay()
        res = await executePPDMQuery({
          query: ApiSearchAdvance.mutationApi(
            key.parent,
            key.child,
            null,
            pagination,
            {
              key: key.child,
              constraints: [
                {
                  conjunction: 'AND',
                  fieldName: key.primaryKey,
                  operator: 'IN',
                  value: key.data.length === 0 ? undefined : key.data.join(),
                },
              ],
            },
          ),
          fetchPolicy: 'no-cache',
        })
        if (res && res.data) {
          dataTypeCount = res.data[key.parent][key.child].count
          const newPagination = {
            ...pagination,
            perPage: dataTypeCount,
            totalCount: dataTypeCount,
          }
          res = await executePPDMQuery({
            query: ApiSearchAdvance.mutationApi(
              key.parent,
              key.child,
              key.fields,
              newPagination,
              {
                key: key.child,
                constraints: [
                  {
                    conjunction: 'AND',
                    fieldName: key.primaryKey,
                    operator: 'IN',
                    value: key.data.length === 0 ? undefined : key.data.join(),
                  },
                ],
              },
            ),
          })
          if (res && res.data) {
            responseObject[key.parent][key.child] = {
              data: res.data[key.parent][key.child],
            }
          } else {
            responseObject = { ...res.data, error: true, ...responseObject }
          }
        }
      }
      const newConfig = { ...showSelectedConfig, [type]: true }
      responseObject['isLoading'] = false
      if (responseObject.hasOwnProperty(dataConfig[type].parent)) {
        const currentNestedObject = responseObject[dataConfig[type].parent]
        const nestedObject = workingSet[dataConfig[type].parent]
        if (!isEmpty(nestedObject)) {
          responseObject[dataConfig[type].parent] = {
            ...nestedObject,
            ...currentNestedObject,
          }
        }
      }
      updateFilter('workSet', { ...workingSet, ...responseObject })
      updateFilter('showSelectedConfig', newConfig)
      hideAPIWorkingOverlay()
    }
    render () {
      const { qSchemaIntrospection } = this.props
      return (
        <WrappedComponent
          {...this.props}
          handleDataType={this.handleDataType}
          workSet={this.workSet}
          deleteRowsHandler={this.deleteRowsHandler}
          qSchemaIntrospection={qSchemaIntrospection}
          updateSession={this.updateSession}
        />
      )
    }
  }
  ApiSearchAdvance.propTypes = {
    selectedBasket: PropTypes.object,
    filters: PropTypes.object,
    switcherProps: PropTypes.object,
    visible: PropTypes.bool,
    client: PropTypes.object,
    updateFilter: PropTypes.func,
    qSchemaIntrospection: PropTypes.object,
    displayAPIWorkingOverlay: PropTypes.func,
    hideAPIWorkingOverlay: PropTypes.func,
    search: PropTypes.object,
    updateSelectedOnEdit: PropTypes.func,
  }
  return ApiSearchAdvance
}

export default AdvanceSearchHoc
