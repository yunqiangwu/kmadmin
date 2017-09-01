const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')


const { api: { promptsList, promptsSave } } = config


let promptsListData = Mock.mock({
  'data|80-100': [
    {
      messageId: '@id',
      messageName: '@cword(3, 6)',
      description: '@cparagraph',
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
    res.status(200).json({
      rows: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`POST ${promptsSave}`] (req, res) {
    const submitData = req.body
    submitData.forEach((item) => {
      if (item.deleted && item.messageId) {
        database = database.filter(_ => _.messageId !== item.messageId)
      }
      if (!item.deleted && item.messageId) {
        let index = database.findIndex(_ => _.messageId === item.messageId)
        if (index > -1) {
          database[index] = { ...database[index], ...item }
        } else {
          database.unshift(item)
        }
      }
    })
    res.status(200).end()
  },

}
