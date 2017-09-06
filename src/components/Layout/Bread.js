/* global location */
import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'
import styles from './Bread.less'

const currentIsHomePage = (pathname) => {
  return pathname === '/' || pathname === '/homepage'
}

const Bread = ({ menu, pathname }) => {
  // 匹配当前路由
  let pathArray = []
  let current
  for (let index = 0; index < menu.length; index += 1) {
    let url1 = menu[index].route
    let url2 = pathname || location.hash.substring(1).replace(/\?.*$/g, '') || location.pathname
    if ((url1 && pathToRegexp(url1).exec(url2)) || (currentIsHomePage(url1) && currentIsHomePage(url2))) {
      current = menu[index]
      break
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'id'))
    }
  }

  if (!current) {
    pathArray.push(menu[0] || {
      id: 1,
      icon: 'laptop',
      name: 'Dashboard',
    })
    pathArray.push({
      id: 404,
      name: 'Not Found',
    })
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
        ? <Icon type={item.icon} style={{ marginRight: 4 }} />
        : ''}{item.name}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route}>
            {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
  pathname: PropTypes.string,
}

export default Bread
