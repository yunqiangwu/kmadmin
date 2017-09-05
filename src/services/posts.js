import { request, config } from 'utils'

const { api } = config
const { posts } = api

export async function query (params) {
  params = {
    page: 1,
    pageSize: 10,
    ...params,
  }
  return request({
    url: posts,
    method: 'get',
    data: params,
  })
}
