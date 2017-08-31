import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const User = ({ location, dispatch, prompts, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = prompts
  const { pageSize } = pagination
  const isMotion = true

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['prompts/update'],
    title: `${modalType === 'create' ? '创建信息模板' : '编辑信息模板'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `prompts/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'prompts/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    isMotion,
    loading: loading.effects['prompts/query'],
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
        type: 'prompts/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'prompts/showModal',
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
          type: 'prompts/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    isMotion,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/prompts',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/prompts',
      }))
    },
    onAdd () {
      dispatch({
        type: 'prompts/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'prompts/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'prompts/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  // return (
  //   <div>
  //     <pre>{JSON.stringify(list, null, 2)}</pre>
  //   </div>
  // )

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'left', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

User.propTypes = {
  prompts: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ prompts, loading }) => ({ prompts, loading }))(User)
