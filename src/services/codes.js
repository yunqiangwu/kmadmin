import { request, config } from 'utils'

const { api } = config
const { codesList, codesSave, codesValuesList, codesValuesSave } = api

export async function query (params) {
  params = {
    page: 1,
    pageSize: 10,
    isDeleted: 0,
    ...params,
  }
  return request({
    url: codesList,
    method: 'get',
    data: params,
  })
}

export async function save (params) {
  return request({
    url: codesSave,
    method: 'post',
    data: params,
  })
}

export async function queryValues (params) {
  params = {
    // page: 1,
    // pageSize: 10000,
    isDeleted: 0,
    ...params,
  }
  return request({
    url: codesValuesList,
    method: 'get',
    data: params,
  })
}

export async function saveValues (params) {
  return request({
    url: codesValuesSave,
    method: 'post',
    data: params,
  })
}
