const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { api:{ promptsList, promptsSave } } = config


let promptsListData = Mock.mock({
  'data|80-100': [
    {
      lookUpType: '@string("lower", 5)_@integer(100, 999)',
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
            lookUpType: this.lookUpType,
            lookUpCode: '@string("lower", 5)_@integer(100, 999)',
            lookUpValue: '@cword(3, 6)',
            description: '@cparagraph',
            displayOrder: generateOrder,
          },
          ],
        }).data
      },
    },
  ],
})

let database = promptsListData.data

module.exports = {

  [`GET ${promptsList}`] (req, res) {
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
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },


  [`POST ${promptsSave}`] (req, res) {
    const submitData = req.body
    const defaultData = Mock.mock({
      lookUpType: '@string("lower", 5)_@integer(100, 999)',
      name: '@cword(3, 6)',
      description: '@cparagraph',
    })
    const newData = { ...submitData, ...defaultData}

    database.unshift(newData)

    res.status(200).end()
  },

}
