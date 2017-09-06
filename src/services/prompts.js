import { request, config } from 'utils'

const { api } = config
const { promptsList, promptsSave } = api

export async function query (params) {
  params = {
    page: 1,
    pageSize: 10,
    // isDeleted: 0,
    ...params,
  }
  Object.keys(params).forEach((key) => {
    if (params[key] === '') {
      delete params[key]
    }
  })
  return request({
    url: promptsList,
    method: 'get',
    data: params,
  })
}

export async function save (params) {
  return request({
    url: promptsSave,
    method: 'post',
    data: params,
  })
}
