import './components/style.less';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrangChuBody from './Body';
import { Button, Modal } from 'antd';
import { history } from 'umi';
import { logout } from '@/services/user';

const TrangChu = () => {
  const isLoggedIn = !!localStorage.getItem('userId');

  const handleLogin = () => {
    history.push('/user/login1');
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk() {
        logout();
        window.location.reload();
      },
    });
  };

  return (
    <>
      <Header
        subTitle='Hệ thống Tuyển sinh Đại học Trực tuyến'
        button={[
          isLoggedIn ? (
            <Button
              key='logout'
              type='primary'
              danger
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
                padding: '4px 16px',
                height: '38px',
              }}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          ) : (
            <Button
              key='login'
              type='primary'
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
                padding: '4px 16px',
                height: '38px',
              }}
              onClick={handleLogin}
            >
              Đăng nhập
            </Button>
          ),
        ]}
        menu={[
          <a key='news' href='/news'>
            Tin tức
          </a>,
          <a key='guide' href='/guide'>
            Hướng dẫn
          </a>,
          <a key='contact' href='/contact'>
            Liên hệ
          </a>,
        ]}
      />

      <TrangChuBody />

      <Footer />
    </>
  );
};

export default TrangChu;
