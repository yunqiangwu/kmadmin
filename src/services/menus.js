import { request, config } from 'utils'
const { api, menusData } = config
const { menus } = api

export async function query (params) {
  // return request({
  //   url: menus,
  //   method: 'get',
  //   data: params,
  // })
  return Promise.resolve({ list: menusData })
}
