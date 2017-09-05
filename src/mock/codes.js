const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')


const { api: { codesList, codesSave, codesValuesList, codesValuesSave } } = config


let codesListData = Mock.mock({
  'data|80-100': [
    {
      lookupType: '@string("lower", 5)_@integer(100, 999)',
      name: '@cword(3, 6)',
      description: '@cparagraph',
      valuesListData: function avatar () {
        let order = 0
        const generateOrder = () => {
          order += 1
          return order
        }
        return Mock.mock({
          'data|0-6': [{
            lookUpId: '@id',
            lookupType: this.lookupType,
            lookUpCode: '@string("lower", 5)_@integer(100, 999)',
            lookUpValue: '@cword(3, 6)',
            description: '@cparagraph',
            displayOrder: generateOrder,
            language: 'CN',
            enabled: true,
          },
          ],
        }).data
      },
    },
  ],
})

let database = codesListData.data
let valuesDatabase = database.reduce((arr, item) => {
  let temp = item.valuesListData
  item.valuesListData = null
  delete item.valuesListData
  return [...arr, ...temp]
}, [])

// const queryArray = (array, key, keyAlias = 'key') => {
//   if (!(array instanceof Array)) {
//     return null
//   }
//   let data
//
//   for (let item of array) {
//     if (item[keyAlias] === key) {
//       data = item
//       break
//     }
//   }
//
//   if (data) {
//     return data
//   }
//   return null
// }
//
// const NOTFOUND = {
//   message: 'Not Found',
//   documentation_url: 'http://localhost:8000/request',
// }

module.exports = {

  [`GET ${codesList}`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }
    newData = newData.map((item) => { return { ...item, valuesListData: undefined } })
    res.status(200).json({
      rows: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },
  [`GET ${codesValuesList}`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    // pageSize = pageSize || 10
    // page = page || 1

    let newData = valuesDatabase
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }
    res.status(200).json({
      rows: newData,
      total: newData.length,
    })
  },

  [`POST ${codesSave}`] (req, res) {
    const submitData = req.body
    submitData.forEach((item) => {
      if (item.deleted && item.lookupType) {
        database = database.filter(_ => _.lookupType !== item.lookupType)
        valuesDatabase = valuesDatabase.filter(_ => _.lookupType !== item.lookupType)
      }
      if (!item.deleted && item.lookupType) {
        let index = database.findIndex(_ => _.lookupType === item.lookupType)
        if (index > -1) {
          database[index] = { ...database[index], ...item }
        } else {
          database.unshift(item)
        }
      }
    })
    res.status(200).end()
  },

  [`POST ${codesValuesSave}`] (req, res) {
    const submitData = req.body
    submitData.forEach((item) => {
      if (item.deleted && item.lookUpId) {
        valuesDatabase = valuesDatabase.filter(_ => _.lookUpId !== item.lookUpId)
      }
      if (!item.deleted && item.lookUpId) {
        let index = valuesDatabase.findIndex(_ => _.lookUpId === item.lookUpId)
        if (index > -1) {
          valuesDatabase[index] = { ...valuesDatabase[index], ...item }
        }
      }
      if (!item.lookUpId && item.lookupType) {
        item = { ...item, lookUpId: Mock.mock('@id') }
        valuesDatabase.unshift(item)
      }
    })
    res.status(200).end()
  },

}
