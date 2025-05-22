import React from 'react';
import { Tabs } from 'antd';
import Login from '../user/Login';
import SignUp from '../user/SignUp';
import styles from './index.less';

const { TabPane } = Tabs;

const ThiSinh: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src="/logo-full.svg" />
            <h1>Hệ thống tuyển sinh</h1>
          </div>
        </div>

        <div className={styles.main}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Đăng nhập" key="1">
              <Login />
            </TabPane>
            <TabPane tab="Đăng ký tuyển sinh" key="2">
              <SignUp />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ThiSinh;
