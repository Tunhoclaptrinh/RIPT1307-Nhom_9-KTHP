import axios from 'axios';

const useInitService = (url: string, baseURL?: string) => {
	const finalURL = baseURL ?? 'http://localhost:3000';

	const getService = (
		payload: {
			page?: number;
			limit?: number;
			condition?: any;
			sort?: any;
			filters?: any[];
			select?: string;
		},
		path?: string,
		isAbsolutePath?: boolean,
	) => {
		const finalPath = isAbsolutePath ? `${finalURL}/${path}` : `${finalURL}/${url}`;

		// JSON Server pagination parameters
		const params: any = {};

		if (payload.page && payload.limit) {
			params._page = payload.page;
			params._limit = payload.limit;
		}

		// JSON Server sorting
		if (payload.sort) {
			const sortKey = Object.keys(payload.sort)[0];
			const sortOrder = payload.sort[sortKey] === 1 ? 'asc' : 'desc';
			params._sort = sortKey;
			params._order = sortOrder;
		}

		// Basic filtering for JSON Server
		if (payload.condition) {
			Object.keys(payload.condition).forEach((key) => {
				if (payload.condition[key] !== undefined && payload.condition[key] !== null) {
					params[key] = payload.condition[key];
				}
			});
		}

		return axios.get(finalPath, { params });
	};

	const postService = (payload: any) => {
		return axios.post(`${finalURL}/${url}`, payload);
	};

	const putService = (id: string | number, payload: any) => {
		return axios.put(`${finalURL}/${url}/${id}`, payload);
	};

	const putManyService = async (ids: (string | number)[], update: any) => {
		// JSON Server doesn't support bulk updates, so we update one by one
		const promises = ids.map((id) => axios.put(`${finalURL}/${url}/${id}`, update));
		const results = await Promise.all(promises);
		return { data: results.map((r) => r.data) };
	};

	const deleteService = (id: string | number, silent?: boolean) => {
		return axios.delete(`${finalURL}/${url}/${id}`);
	};

	const deleteManyService = async (ids: (string | number)[], silent?: boolean) => {
		// JSON Server doesn't support bulk deletes, so we delete one by one
		const promises = ids.map((id) => axios.delete(`${finalURL}/${url}/${id}`));
		const results = await Promise.all(promises);
		return { data: results.map((r) => r.data) };
	};

	const getAllService = (
		payload?: { condition?: any; sort?: any; filters?: any[]; select?: string },
		path?: string,
	) => {
		const params: any = {};

		// JSON Server sorting
		if (payload?.sort) {
			const sortKey = Object.keys(payload.sort)[0];
			const sortOrder = payload.sort[sortKey] === 1 ? 'asc' : 'desc';
			params._sort = sortKey;
			params._order = sortOrder;
		}

		// Basic filtering for JSON Server
		if (payload?.condition) {
			Object.keys(payload.condition).forEach((key) => {
				if (payload.condition[key] !== undefined && payload.condition[key] !== null) {
					params[key] = payload.condition[key];
				}
			});
		}

		return axios.get(`${finalURL}/${url}`, { params });
	};

	const getByIdService = (id: string | number) => {
		return axios.get(`${finalURL}/${url}/${id}`);
	};

	// Import/Export functions - Mock implementations for JSON Server
	const getImportHeaders = () => {
		return Promise.resolve({ data: { data: [] } });
	};

	const getImportTemplate = () => {
		return Promise.resolve({ data: new ArrayBuffer(0) });
	};

	const postValidateImport = (payload: any) => {
		return Promise.resolve({ data: { data: { valid: [], invalid: [] } } });
	};

	const postExecuteImport = (payload: any) => {
		return Promise.resolve({ data: { data: { success: 0, failed: 0 } } });
	};

	const getExportFields = () => {
		return Promise.resolve({ data: { data: [] } });
	};

	const postExport = (payload: { ids?: string[]; definitions: any[] }, params?: { condition?: any; filters?: any }) => {
		return Promise.resolve({ data: new ArrayBuffer(0) });
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
