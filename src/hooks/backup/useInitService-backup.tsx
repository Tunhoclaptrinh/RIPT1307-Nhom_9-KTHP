import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const useInitService = (url: string, ip?: string) => {
	const finalIp = ip ?? ip3;

	const getService = (
		payload: { page?: number; limit?: number; condition?: any },
		path?: string,
		isAbsolutePath?: boolean,
	) => {
		const finalPath = isAbsolutePath ? `${finalIp}/${path}` : `${finalIp}/${url}/${path ?? ''}`;
		return axios.get(finalPath, { params: payload });
	};

	const postService = (payload: any) => {
		return axios.post(`${finalIp}/${url}`, payload);
	};

	const putService = (id: string | number, payload: any) => {
		return axios.put(`${finalIp}/${url}/${id}`, payload);
	};

	const putManyService = (ids: (string | number)[], update: any) => {
		return axios.put(`${finalIp}/${url}/many/ids`, { ids, update });
	};

	const deleteService = (id: string | number, silent?: boolean) => {
		return axios.delete(`${finalIp}/${url}/${id}`, { data: { silent } });
	};

	const deleteManyService = (ids: (string | number)[], silent?: boolean) => {
		return axios.delete(`${finalIp}/${url}/many/ids`, { data: { silent, ids } });
	};

	const getAllService = (payload?: { condition?: any; sort?: any }, path?: string) => {
		return axios.get(`${finalIp}/${url}/${path || 'many'}`, { params: payload });
	};

	const getByIdService = (id: string | number) => {
		return axios.get(`${finalIp}/${url}/${id}`);
	};

	const getImportHeaders = () => {
		return axios.get(`${finalIp}/${url}/import/definition`, { data: { silent: true } });
	};

	const getImportTemplate = () => {
		return axios.get(`${finalIp}/${url}/import/template/xlsx`, {
			responseType: 'arraybuffer',
		});
	};

	const postValidateImport = (payload: any) => {
		return axios.post(`${finalIp}/${url}/import/validate`, payload);
	};

	const postExecuteImport = (payload: any) => {
		return axios.post(`${finalIp}/${url}/import/insert`, payload);
	};

	const getExportFields = () => {
		return axios.get(`${finalIp}/${url}/export/definition`, { data: { silent: true } });
	};

	const postExport = (payload: { ids?: string[]; definitions: any[] }, params?: { condition?: any; filters?: any }) => {
		return axios.post(`${finalIp}/${url}/export/xlsx`, payload, {
			params,
			responseType: 'arraybuffer',
		});
	};

	return {
		getService,
		getByIdService,
		postService,
		putService,
		putManyService,
		deleteService,
		deleteManyService,
		getAllService,
		getImportHeaders,
		getImportTemplate,
		postValidateImport,
		postExecuteImport,
		getExportFields,
		postExport,
	};
};

export default useInitService;
