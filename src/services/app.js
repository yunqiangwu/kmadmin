/* global window */
import { request, config } from 'utils'

const { api } = config
const { teacherInfo, userInfo, userLogout, userLogin } = api

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

export async function getUserId (params) {
  return request({
    url: teacherInfo,
    method: 'get',
    data: params,
  }).then((data) => {
    return data.userId
  })
}

export async function getUserInfo (params) {
  let userId = await getUserId({})
  return request({
    url: userInfo,
    method: 'get',
    data: { userId, ...params },
  }).then((data) => {
    return {
      userId,
      ...data,
    }
  })
}
