/* global history */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Button, Popconfirm } from 'antd'
import pathToRegexp from 'path-to-regexp'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import CodesEditPannel from './CodesEditPannel'

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const Detail = ({ codeValues, dispatch, location, loading }) => {
  const { codesItem, list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = codeValues
  // const {  : { lookUpType } } = location;
  const match = pathToRegexp('/codes/values/:lookUpType').exec(location.pathname)
  const lookUpType = match && match[1]
  const isMotion = true

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading,
    title: `${modalType === 'create' ? '新建代码' : '编辑代码'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `codeValues/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'codeValues/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    isMotion,
    loading,
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'codeValues/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'codeValues/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'codeValues/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  // const filterProps = {
  //   isMotion,
  //   filter: {
  //     ...location.query,
  //   },
  //   onFilterChange (value) {
  //     dispatch({ type: 'codeValues/query', payload: { ...value, lookUpType } })
  //     // dispatch(routerRedux.push({
  //     //   pathname: `/${location.pathname}`,
  //     //   query: {
  //     //     ...value,
  //     //     // page: 1,
  //     //     // pageSize,
  //     //   },
  //     // }))
  //   },
  //   onSearch (fieldsValue) {
  //     if (fieldsValue.keyword.length) {
  //       dispatch({ type: 'codeValues/query', payload: { ...fieldsValue, lookUpType } })
  //     } else {
  //       dispatch({ type: 'codeValues/query', payload: { lookUpType } })
  //     }
  //
  //     // fieldsValue.keyword.length ? dispatch(routerRedux.push({
  //     //   pathname: `/codes/values/${lookUpType}`,
  //     //   query: {
  //     //     field: fieldsValue.field,
  //     //     keyword: fieldsValue.keyword,
  //     //   },
  //     // })) : dispatch(routerRedux.push({
  //     //   pathname: `/codes/values/${lookUpType}`,
  //     // }))
  //   },
  //   onAdd () {
  //     dispatch({
  //       type: 'codeValues/showModal',
  //       payload: {
  //         modalType: 'create',
  //       },
  //     })
  //   },
  //   switchIsMotion () {
  //     dispatch({ type: 'codeValues/switchIsMotion' })
  //   },
  // }

  const onAdd = () => {
    dispatch({
      type: 'codeValues/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'codeValues/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const codesEditProps = {
    item: codesItem,
    loading,
    onSave (data) {
      dispatch({
        type: 'codeValues/multiDelete',
        payload: data,
      })
    },
  }

  // return <div>{JSON.stringify(list)}</div>
  return (
    <div className="content-inner">
      <div style={{ marginBottom: '10px' }}>
        <CodesEditPannel {...codesEditProps}>
          <Col {...ColProps} xl={{ span: 1 }} md={{ span: 2 }}>
            <Button size="large" type="ghost" onClick={onAdd}>新建</Button>
          </Col>
          {selectedRowKeys.length > 0 && <Col {...ColProps} xl={{ span: 1 }} md={{ span: 2 }}>
            <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>删除</Button>
            </Popconfirm>
          </Col>}
          <Col {...ColProps} xl={{ span: 1 }} md={{ span: 2 }}>
            <Button size="large" onClick={() => history.back()}>返回</Button>
          </Col>
        </CodesEditPannel>
      </div>
      {/* <Filter {...filterProps}> */}
      {/* { */}
      {/* selectedRowKeys.length > 0 && */}
      {/* <span> */}
      {/* {`Selected ${selectedRowKeys.length} items `} */}
      {/* <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}> */}
      {/* <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button> */}
      {/* </Popconfirm> */}
      {/* </span> */}
      {/* } */}
      {/* </Filter> */}
      <List {...listProps} />
      {
        selectedRowKeys.length > 0 &&
        <span>
          {`已选择 ${selectedRowKeys.length} 条数据 `}
        </span>
      }
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Detail.propTypes = {
  codeValues: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ codeValues, loading }) => ({ codeValues, loading: loading.models.codeValues }))(Detail)
