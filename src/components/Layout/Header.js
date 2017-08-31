import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'
import { config } from 'utils'
import md5 from 'utils/md5'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu }) => {
  let handleClickMenu = e => e.key === 'logout' && logout()
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  let avatarSrc = `http://www.gravatar.com/avatar/${md5(user.email)}?s=128`
  return (
    <div className={styles.header}>
      <div className={styles.leftWarpper}>
        <div className={styles.logo} style={{ transform: siderFold ? 'scale(0)' : 'scale(1)', marginLeft: siderFold ? '-88%' : 0 }}>
          <img alt={'logo'} src={config.logo} />
          <span>{config.name}</span>
        </div>
        {isNavbar
          ? <Popover placement="bottomLeft"
            onVisibleChange={switchMenuPopover}
            visible={menuPopoverVisible}
            overlayClassName={styles.popovermenu}
            trigger="click"
            content={<Menus {...menusProps} />}
          >
            <div className={styles.button}>
              <Icon type="bars" />
            </div>
          </Popover>
          : <div
            className={styles.button}
            onClick={switchSider}
          >
            <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
          </div>}
      </div>

      <div className={styles.rightWarpper}>
        <div className={styles.button}>
          <Icon type="mail" />
        </div>
        <Menu style={{ backgroundColor: 'transparent' }} mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={<span style={{ height: '100%', display: 'flex' }}>
              <span className={styles.username}>{user.username}</span>
              <img src={avatarSrc} className={styles.usericon} alt="avatar" />
              {/*<Icon className={styles.usericon} type="user" />*/}
            </span>}
          >
            <Menu.Item key="logout">
              退出登录
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
