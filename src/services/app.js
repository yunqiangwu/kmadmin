/* global window */
import { request, config } from 'utils'

const { api } = config
const { user, userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  // return request({
  //   url: userLogout,
  //   method: 'get',
  //   data: params,
  // })
  window.tokenData = undefined
  return Promise.resolve({
    success: true,
  })
}

export async function query (params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}
