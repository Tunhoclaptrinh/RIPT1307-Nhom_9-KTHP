import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { dangKy } from '../services/Users/index';
import { postAvatar, getAvatar, putAvatar, deleteAvatar, postUserProof, getUserProof } from '../services/Users/index';
import { useState } from 'react';
export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, ipLocal);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  	const [poofUrl, setPoofUrl] = useState<string | null>(null);
	return {
		...objInt,
		dangKy,
		postAvatar,
		getAvatar,
		putAvatar,
		deleteAvatar,
		postUserProof,
		getUserProof,
		setAvatarUrl,
		setPoofUrl,
		avatarUrl,
		poofUrl
	};
};
