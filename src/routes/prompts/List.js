import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Button } from 'antd'
import { Link } from 'dva/router'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.messageId)
        },
      })
    }
  }

  const columns = [
    {
      title: '编码',
      dataIndex: 'messageId',
      key: 'messageId',
      // render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
    }, {
      title: '名称',
      dataIndex: 'messageName',
      key: 'messageName',
    }, {
      title: '内容',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        // return <Button onClick={() => handleMenuClick(record, { key: '1', name: '编辑' })}>编辑</Button>
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        onRowDoubleClick={(item) => { onEditItem(item) }}
        scroll={{ x: 1024 }}
        columns={columns}
        simple
        rowKey={record => record.messageId}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
