import { useAuthActions } from '@/hooks/useAuthActions';
import { tenTruongVietTatTiengAnh } from '@/services/base/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAuth } from 'react-oidc-context';

const LoginWithKeycloak = () => {
	const auth = useAuth();
	const { isLoading, dangNhap } = useAuthActions();

	const onClearCache = () => {
		localStorage.clear();
		sessionStorage.clear();
		auth.removeUser();
		window.location.href = '/';
		// window.location.reload();
	};

	if (isLoading) {
		return <div>Đang chuyển tới trang đăng nhập...</div>;
	}

	if (auth.error) {
		return (
			<div>
				Có lỗi xảy ra... <pre>{auth.error.message}</pre>
				<Button icon={<DeleteOutlined />} onClick={onClearCache} type='link'>
					Xóa bộ nhớ đệm
				</Button>
			</div>
		);
	}

	return (
		<div>
			<Button
				onClick={dangNhap}
				type='primary'
				style={{
					marginTop: 8,
					width: '100%',
				}}
				size='large'
			>
				Đăng nhập bằng {tenTruongVietTatTiengAnh.toUpperCase()} Connect
			</Button>
		</div>
	);
};

export default LoginWithKeycloak;
