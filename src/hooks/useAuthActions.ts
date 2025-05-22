import { deleteOneSignal } from '@/services/base/api';
import { currentRole, oneSignalRole } from '@/utils/ip';
import { useAuth } from 'react-oidc-context';
import OneSignal from 'react-onesignal';
import { useModel } from 'umi';

export const useAuthActions = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const auth = useAuth();

	const handleLogout = () => {
		if (oneSignalRole.valueOf() === currentRole.valueOf()) {
			OneSignal.getUserId((playerId) => deleteOneSignal({ playerId }));
			OneSignal.setSubscription(false);
		}

		auth
			.signoutRedirect({
				post_logout_redirect_uri: window.location.origin + '/user/login1',
				id_token_hint: auth.user?.id_token,
			})
			.then(() => {
				sessionStorage.clear();
				localStorage.clear();
				setInitialState({ ...initialState, currentUser: undefined });
			});
	};

	const handleLogin = () => {
		auth.signinRedirect();
	};

	return {
		dangXuat: handleLogout,
		dangNhap: handleLogin,
		isLoading: auth.isLoading,
	};
};
