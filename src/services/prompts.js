import { request, config } from 'utils'

const { api } = config
const { promptsList, promptsSave } = api

export async function query (params) {
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
