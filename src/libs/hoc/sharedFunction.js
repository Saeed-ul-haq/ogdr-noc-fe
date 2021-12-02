export const basketWithoutEmptyData = data => {
  let myObj = {}
  for (let key in data) {
    if (data[key] && data[key].data && data[key].data.length > 0) {
      myObj[key] = { ...data[key] }
    }
  }
  return myObj
}

export const getIds = (editBasketDraft, type) => {
  let getId = []
  if (editBasketDraft && editBasketDraft[type] && editBasketDraft[type].data) {
    getId = editBasketDraft[type].data.map(elem => {
      return { [editBasketDraft[type].primaryKey]: elem, index: 0 }
    })
  }
  return getId
}

export const formatCurrentData = (model, data) => {
  let my = {}
  for (let key in model) {
    if (data.hasOwnProperty(model[key].parent)) {
      my[model[key].parent] = {}
      const newData = data[model[key].parent]
      for (let k in newData) {
        if (k === key) {
          my[model[key].parent][key] = { ...newData[k] }
        }
      }
    }
  }
  return my
}
export const formatData = (data, searchFields) => {
  let myArray = []
  for (let key in data) {
    myArray.push({
      ...data[key],
      child: key,
      fields: searchFieldsFn({
        child: key,
        dataToSearch: searchFields,
        parent: data[key].parent,
      }),
    })
  }
  return myArray
}
export const searchFieldsFn = data => {
  let fields = null
  const searchF = data.dataToSearch.find(d => d.schemaName === data.parent)
  if (searchF && searchF.dataTypes) {
    fields = searchF.dataTypes.find(d => d.actualName === data.child)
    if (fields) {
      fields = fields.fields
        .map(elem => {
          return elem.actualName
        })
        .join(' ')
    }
  }
  return fields
}

export const filterByIds = (groups, items) => {
  if (!groups || !items) return []
  let arrayOfItems = items.filter((d, i) => {
    if (!groups.includes(d)) {
      return d
    }
  })

  /*   for (let i = 0; i < groups.length; i++) {
      const res = items.filter(d => {
        console.log(d[primaryKey], groups[i])
        return d[primaryKey] === groups[i]
      })
      if (res) {
        arrayOfItems.push(res)
      }
    }
    let formData = []
    if (arrayOfItems.length > 0) {
      formData = arrayOfItems.reduce(function (a, b) {
        return a.concat(b)
      })
    } */

  return arrayOfItems
}

export const getConstraintQuery = content => {
  if (!content) return null
  const constraintIn = content.constraints
  let constraints = `constraints: [`
  let constraintsStr = ``
  constraintIn.forEach(item => {
    let value = item.value
    if (constraintsStr) {
      constraintsStr = `${constraintsStr}, {
fieldName: "${item.fieldName}", value:"${value}", operator: ${
  item.operator
}, conjunction: ${item.conjunction || 'AND'}}`
    } else {
      constraintsStr = `{
fieldName: "${item.fieldName}", value:"${value}", operator: ${
  item.operator
}, conjunction: ${item.conjunction || 'AND'}}`
    }
  })
  if (content.key === 'wellDocument') {
    constraintsStr = `{ fieldName: "itemSubCategory", value: "Seismic", operator: NE }, ${constraintsStr}`
  }
  return `${constraints}${constraintsStr}]`
}
export const renderCleanData = dataSendIt => {
  let clean = null
  if (dataSendIt && dataSendIt.data) {
    clean = dataSendIt.data[dataSendIt.moduleName][dataSendIt.mutationName].data
  } else {
    return dataSendIt[dataSendIt.moduleName][dataSendIt.mutationName]
  }
  return clean
}
export const getCurrentSelected = (ids, values, curr) => {
  let idsSelected = []
  if (!ids) return idsSelected
  if (!values) {
    const currentData = renderCleanData(curr)
    if (
      Array.isArray(ids) &&
      ids.length > 0 &&
      (Array.isArray(currentData) && currentData.length > 0)
    ) {
      idsSelected = ids.map(elem => {
        const primaryKey = Object.keys(elem).filter(d => d !== 'index')
        const [newKey] = primaryKey
        const findIndex = currentData.findIndex(s => s[newKey] === elem[newKey])
        return findIndex
      })
    }
  }
  return idsSelected
}
export const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

export function getPublicUrl (fileID) {
  if (!fileID) {
    // This test is useful to enable shortcuts such as "src={getPublicUrl(cardData.pictureURL) || defaultCompanyLogo}"
    return null
  }
  return `https://api.test.meeraspace.com/fm/download/${fileID}`
}
