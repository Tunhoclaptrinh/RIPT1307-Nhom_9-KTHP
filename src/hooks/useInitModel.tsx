import { type TExportField, type TFilter, type TImportHeader, type TImportResponse } from '@/components/Table/typing';
import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';
import { useState } from 'react';
import useInitService from './useInitService';
import { EOperatorType } from '../components/Table/constant';
import _ from 'lodash';

/**
 * @param url path api
 * @param fieldNameCondition condition | cond (not used in JSON Server)
 * @param initCondition initConditionValue
 * @param baseURL Base URL của JSON Server (default: http://localhost:3000)
 * @returns
 */
const useInitModel = <T,>(
	url: string,
	fieldNameCondition?: 'condition' | 'cond',
	initCondition?: Partial<T>,
	baseURL?: string,
	initSort?: { [k in keyof T]?: 1 | -1 },
	initFilter?: TFilter<T>[],
) => {
	const [danhSach, setDanhSach] = useState<T[]>([]);
	const [record, setRecord] = useState<T>();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [filters, setFilters] = useState<TFilter<T>[]>(initFilter ?? []);
	const [condition, setCondition] = useState<{ [k in keyof T]?: any } | any>(initCondition);
	const [sort, setSort] = useState<{ [k in keyof T]?: 1 | -1 } | undefined>(initSort);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(true);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [importHeaders, setImportHeaders] = useState<TImportHeader[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>();

	const {
		getAllService,
		postService,
		putService,
		putManyService,
		deleteService,
		deleteManyService,
		getService,
		getByIdService,
		getImportHeaders,
		getImportTemplate,
		postExecuteImport,
		postValidateImport,
		getExportFields,
		postExport,
	} = useInitService(url, baseURL);

	const applyClientSideFilter = (data: T[], filters: TFilter<T>[]): T[] => {
		return data.filter((item) =>
			filters.every((filter) => {
				const field = Array.isArray(filter.field) ? _.get(item, filter.field.join('.')) : item[filter.field];
				const value = String(field).toLowerCase();
				const filterValue = String(filter.values[0]).toLowerCase();
				const filterValue2 = filter.values[1] ? String(filter.values[1]).toLowerCase() : undefined;

				switch (filter.operator) {
					case EOperatorType.CONTAIN:
						return value.includes(filterValue);
					case EOperatorType.NOT_CONTAIN:
						return !value.includes(filterValue);
					case EOperatorType.START_WITH:
						return value.startsWith(filterValue);
					case EOperatorType.END_WITH:
						return value.endsWith(filterValue);
					case EOperatorType.EQUAL:
						return value === filterValue;
					case EOperatorType.NOT_EQUAL:
						return value !== filterValue;
					case EOperatorType.LESS_THAN:
						return Number(field) < Number(filter.values[0]);
					case EOperatorType.LESS_EQUAL:
						return Number(field) <= Number(filter.values[0]);
					case EOperatorType.GREAT_THAN:
						return Number(field) > Number(filter.values[0]);
					case EOperatorType.GREAT_EQUAL:
						return Number(field) >= Number(filter.values[0]);
					case EOperatorType.BETWEEN:
						return Number(field) >= Number(filter.values[0]) && Number(field) <= Number(filter.values[1]);
					case EOperatorType.NOT_BETWEEN:
						return Number(field) < Number(filter.values[0]) || Number(field) > Number(filter.values[1]);
					case EOperatorType.INCLUDE:
						return filter.values.includes(field);
					case EOperatorType.NOT_INCLUDE:
						return !filter.values.includes(field);
					default:
						return true;
				}
			}),
		);
	};

	// 	paramCondition?: Partial<T>,
	// 	filterParams?: TFilter<T>[],
	// 	sortParam?: { [k in keyof T]?: 1 | -1 },
	// 	paramPage?: number,
	// 	paramLimit?: number,
	// 	path?: string,
	// 	otherQuery?: Record<string, any>,
	// 	isSetDanhSach?: boolean,
	// 	isAbsolutePath?: boolean,
	// 	selectParams?: string[],
	// ): Promise<T[]> => {
	// 	setLoading(true);
	// 	const payload = {
	// 		page: paramPage || page,
	// 		limit: paramLimit || limit,
	// 		sort: sortParam || sort,
	// 		condition: { ...condition, ...paramCondition },
	// 		filters: [
	// 			...(filters?.filter((item) => item.active !== false)?.map(({ active, ...item }) => item) || []),
	// 			...(filterParams || []),
	// 		],
	// 		select: selectParams?.join(' '),
	// 		...(otherQuery ?? {}),
	// 	};

	// 	try {
	// 		const response = await getService(payload, path ?? 'page', isAbsolutePath ?? false);
	// 		let tempData: T[] = Array.isArray(response.data) ? response.data : [];

	// 		// Kiểm tra và log header X-Total-Count
	// 		const xTotalCount = response.headers['x-total-count'];
	// 		let tempTotal: number;
	// 		if (xTotalCount && !isNaN(parseInt(xTotalCount, 10))) {
	// 			tempTotal = parseInt(xTotalCount, 10);
	// 		} else {
	// 			console.warn('X-Total-Count header is missing or invalid. Falling back to getAllService.');
	// 			const allDataResponse = await getAllService(payload, path);
	// 			tempTotal = Array.isArray(allDataResponse.data) ? allDataResponse.data.length : 0;
	// 		}

	// 		// Áp dụng lọc phía client cho các toán tử không được JSON Server hỗ trợ
	// 		const complexFilters = payload.filters.filter(
	// 			(f) => f.operator !== undefined && ![EOperatorType.CONTAIN, EOperatorType.EQUAL].includes(f.operator),
	// 		);
	// 		if (complexFilters.length > 0) {
	// 			tempData = applyClientSideFilter(tempData, complexFilters);
	// 		}

	// 		// Kiểm tra trang không hợp lệ
	// 		if (tempData.length === 0 && tempTotal > 0 && payload.page > 1) {
	// 			const maxPage = Math.ceil(tempTotal / payload.limit) || 1;
	// 			setPage(maxPage);
	// 			return Promise.reject('Invalid page');
	// 		}

	// 		if (isSetDanhSach !== false) {
	// 			setDanhSach(tempData);
	// 		}
	// 		setTotal(tempTotal);
	// 		return tempData;
	// 	} catch (er) {
	// 		console.error('Error in getModel:', er);
	// 		return Promise.reject(er);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	// const getModel = async (
	// 	paramCondition?: Partial<T>,
	// 	filterParams?: TFilter<T>[],
	// 	sortParam?: { [k in keyof T]?: 1 | -1 },
	// 	paramPage?: number,
	// 	paramLimit?: number,
	// 	path?: string,
	// 	otherQuery?: Record<string, any>,
	// 	isSetDanhSach?: boolean,
	// 	isAbsolutePath?: boolean,
	// 	selectParams?: string[],
	// ): Promise<T[]> => {
	// 	setLoading(true);
	// 	const payload = {
	// 		page: paramPage || page,
	// 		limit: paramLimit || limit,
	// 		sort: sortParam || sort,
	// 		condition: { ...condition, ...paramCondition },
	// 		filters: [
	// 			...(filters?.filter((item) => item.active !== false)?.map(({ active, ...item }) => item) || []),
	// 			...(filterParams || []),
	// 		],
	// 		select: selectParams?.join(' '),
	// 		...(otherQuery ?? {}),
	// 	};

	// 	try {
	// 		const response = await getService(payload, path ?? 'page', isAbsolutePath ?? false);
	// 		let tempData: T[] = Array.isArray(response.data) ? response.data : [];

	// 		// Áp dụng lọc phía client cho tất cả filters
	// 		if (payload.filters.length > 0) {
	// 			tempData = applyClientSideFilter(tempData, payload.filters);
	// 		}

	// 		// Áp dụng sắp xếp phía client
	// 		if (payload.sort) {
	// 			const sortKey = Object.keys(payload.sort)[0] as keyof T;
	// 			const sortOrder = payload.sort[sortKey];
	// 			tempData = [...tempData].sort((a, b) => {
	// 				const aValue = typeof sortKey === 'string' && sortKey.includes('.') ? _.get(a, sortKey) : a[sortKey];
	// 				const bValue = typeof sortKey === 'string' && sortKey.includes('.') ? _.get(b, sortKey) : b[sortKey];
	// 				if (typeof aValue === 'string' && typeof bValue === 'string') {
	// 					return sortOrder === 1 ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
	// 				}
	// 				return sortOrder === 1 ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
	// 			});
	// 		}

	// 		// Kiểm tra và log header X-Total-Count
	// 		const xTotalCount = response.headers['x-total-count'];
	// 		let tempTotal: number;
	// 		if (xTotalCount && !isNaN(parseInt(xTotalCount, 10))) {
	// 			tempTotal = parseInt(xTotalCount, 10);
	// 		} else {
	// 			console.warn('X-Total-Count header is missing or invalid. Falling back to getAllService.');
	// 			const allDataResponse = await getAllService(payload, path);
	// 			tempTotal = Array.isArray(allDataResponse.data) ? allDataResponse.data.length : 0;
	// 		}

	// 		// Kiểm tra trang không hợp lệ
	// 		if (tempData.length === 0 && tempTotal > 0 && payload.page > 1) {
	// 			const maxPage = Math.ceil(tempTotal / payload.limit) || 1;
	// 			setPage(maxPage);
	// 			return Promise.reject('Invalid page');
	// 		}

	// 		if (isSetDanhSach !== false) {
	// 			setDanhSach(tempData);
	// 		}
	// 		setTotal(tempTotal);
	// 		return tempData;
	// 	} catch (er) {
	// 		console.error('Error in getModel:', er);
	// 		return Promise.reject(er);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	const getModel = async (
		paramCondition?: Partial<T>,
		filterParams?: TFilter<T>[],
		sortParam?: { [k in keyof T]?: 1 | -1 },
		paramPage?: number,
		paramLimit?: number,
		path?: string,
		otherQuery?: Record<string, any>,
		isSetDanhSach?: boolean,
		isAbsolutePath?: boolean,
		selectParams?: string[],
	): Promise<T[]> => {
		setLoading(true);
		const payload = {
			page: paramPage || page,
			limit: paramLimit || limit,
			sort: sortParam || sort,
			condition: { ...condition, ...paramCondition },
			filters: [
				...(filters?.filter((item) => item.active !== false)?.map(({ active, ...item }) => item) || []),
				...(filterParams || []),
			],
			select: selectParams?.join(' '),
			...(otherQuery ?? {}),
		};

		try {
			const response = await getService(payload, path ?? 'page', isAbsolutePath ?? false);
			let tempData: T[] = Array.isArray(response.data) ? response.data : [];

			// Áp dụng lọc phía client
			if (payload.filters.length > 0) {
				tempData = applyClientSideFilter(tempData, payload.filters);
			}

			// Áp dụng sắp xếp phía client chỉ khi sort được xác định rõ ràng
			if (payload.sort && Object.keys(payload.sort).length > 0) {
				const sortKey = Object.keys(payload.sort)[0] as keyof T;
				const sortOrder = payload.sort[sortKey];
				tempData = [...tempData].sort((a, b) => {
					const aValue =
						typeof sortKey === 'string' ? (sortKey.includes('.') ? _.get(a, sortKey) : a[sortKey]) : a[sortKey];
					const bValue =
						typeof sortKey === 'string' ? (sortKey.includes('.') ? _.get(b, sortKey) : b[sortKey]) : b[sortKey];
					if (typeof aValue === 'string' && typeof bValue === 'string') {
						return sortOrder === 1 ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
					}
					return sortOrder === 1 ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
				});
			}

			// Kiểm tra và log header X-Total-Count
			const xTotalCount = response.headers['x-total-count'];
			let tempTotal: number;
			if (xTotalCount && !isNaN(parseInt(xTotalCount, 10))) {
				tempTotal = parseInt(xTotalCount, 10);
			} else {
				console.warn('X-Total-Count header is missing or invalid. Falling back to getAllService.');
				const allDataResponse = await getAllService(payload, path);
				tempTotal = Array.isArray(allDataResponse.data) ? allDataResponse.data.length : 0;
			}

			// Kiểm tra trang không hợp lệ
			if (tempData.length === 0 && tempTotal > 0 && payload.page > 1) {
				const maxPage = Math.ceil(tempTotal / payload.limit) || 1;
				setPage(maxPage);
				return Promise.reject('Invalid page');
			}

			if (isSetDanhSach !== false) {
				setDanhSach(tempData);
			}
			setTotal(tempTotal);
			return tempData;
		} catch (er) {
			console.error('Error in getModel:', er);
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};
	const getAllModel = async (
		isSetRecord?: boolean,
		sortParam?: { [k in keyof T]?: 1 | -1 },
		conditionParam?: Partial<T>,
		filterParam?: TFilter<T>[],
		pathParam?: string,
		isSetDanhSach?: boolean,
		selectParams?: string[],
		otherQuery?: Record<string, any>,
	): Promise<T[]> => {
		setLoading(true);
		try {
			const payload = {
				condition: conditionParam,
				sort: sortParam,
				filters: filterParam,
				select: selectParams?.join(' '),
				...(otherQuery ?? {}),
			};
			const response = await getAllService(payload, pathParam);
			let data: T[] = Array.isArray(response.data) ? response.data : [];

			// Áp dụng lọc phía client
			if (payload.filters && payload.filters.length > 0) {
				data = applyClientSideFilter(data, payload.filters);
			}

			if (isSetDanhSach !== false) setDanhSach(data);
			if (isSetRecord) setRecord(data?.[0]);
			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getByIdModel = async (id: string | number, isSetRecord?: boolean): Promise<T> => {
		if (!id) return Promise.reject('Invalid id');
		setLoading(true);
		try {
			const response = await getByIdService(id);
			if (isSetRecord !== false) setRecord(response?.data ?? null);
			return response?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getOneModel = async (conditionParam: Partial<T>): Promise<T> => {
		if (!conditionParam) return Promise.reject('condition is required');
		setLoading(true);
		try {
			const response = await getService({ condition: conditionParam }, 'one');
			const data = Array.isArray(response.data) ? response.data[0] : response.data;
			setRecord(data ?? null);
			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (
		payload: Partial<T>,
		getData?: any,
		closeModal?: boolean,
		messageText?: string,
	): Promise<T> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postService(chuanHoaObject(payload));
			message.success(messageText ?? 'Thêm mới thành công');
			setLoading(false);
			if (getData) getData();
			else getModel();
			if (closeModal !== false) setVisibleForm(false);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (
		id: string | number,
		payload: Partial<T>,
		getData?: any,
		notGet?: boolean,
		closeModal?: boolean,
		messageText?: string,
	): Promise<T> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putService(id, chuanHoaObject(payload));
			message.success(messageText ?? 'Lưu thành công');
			setLoading(false);
			if (getData) getData();
			else if (!notGet) getModel();
			if (closeModal !== false) setVisibleForm(false);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putManyModel = async (
		ids: (string | number)[],
		payload: Partial<T>,
		getData?: any,
		notGet?: boolean,
		closeModal?: boolean,
		messageText?: string,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putManyService(ids, chuanHoaObject(payload));
			message.success(messageText ?? 'Lưu thành công');
			setLoading(false);
			if (getData) getData();
			else if (!notGet) getModel();
			if (closeModal !== false) setVisibleForm(false);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string | number, getData?: () => void): Promise<any> => {
		setLoading(true);
		try {
			const res = await deleteService(id);
			message.success('Xóa thành công');
			const maxPage = Math.ceil((total - 1) / limit) || 1;
			let newPage = page;
			if (newPage > maxPage) {
				newPage = maxPage;
				setPage(newPage);
			}
			if (getData) getData();
			else getModel(undefined, undefined, undefined, newPage);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const deleteManyModel = async (ids: (string | number)[], getData?: () => void): Promise<any> => {
		if (!ids.length) return;
		setLoading(true);
		try {
			const res = await deleteManyService(ids);
			message.success(`Xóa thành công ${ids.length} mục`);
			const maxPage = Math.ceil((total - ids.length) / limit) || 1;
			let newPage = page;
			if (newPage > maxPage) {
				newPage = maxPage;
				setPage(newPage);
			}
			if (getData) getData();
			else getModel(undefined, undefined, undefined, newPage);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (rec?: T) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: T) => {
		if (rec) setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	const getImportHeaderModel = async (): Promise<TImportHeader[]> => {
		try {
			const res = await getImportHeaders();
			setImportHeaders(res.data?.data ?? []);
			return res.data?.data ?? [];
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const getImportTemplateModel = async (): Promise<any> => {
		try {
			const res = await getImportTemplate();
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const postValidateModel = async (payload: any[]): Promise<TImportResponse> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postValidateImport({ rows: payload });
			message.success('Đã kiểm tra dữ liệu');
			const data = res.data?.data ?? [];
			const error =
				typeof data === 'object' &&
				data !== null &&
				'invalid' in data &&
				Array.isArray((data as any).invalid) &&
				(data as any).invalid.length > 0;
			return {
				error,
				...data,
			};
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const postExecuteImpotModel = async (payload: any[]): Promise<TImportResponse> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postExecuteImport({ rows: payload });
			message.success('Đã nhập dữ liệu');
			const data = res.data?.data ?? {};
			const error =
				typeof data === 'object' &&
				data !== null &&
				'invalid' in data &&
				Array.isArray((data as any).invalid) &&
				(data as any).invalid.length > 0;
			return {
				error,
				...data,
			};
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getExportFieldsModel = async (): Promise<TExportField[]> => {
		const genIdField = (data?: TExportField[], prefix?: string): TExportField[] | undefined => {
			if (!data?.length) return undefined;
			return data?.map((f, index) => ({
				...f,
				_id: [prefix ?? '0', index].join('-'),
				children: genIdField(f.children, [prefix ?? '0', index].join('-')),
			}));
		};

		try {
			const res = await getExportFields();
			const fields = genIdField(res.data?.data) ?? [];
			return fields;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const postExportModel = async (
		payload: { ids?: string[]; definitions: TExportField[] },
		paramCondition?: Partial<T>,
		paramFilters?: TFilter<T>[],
		otherQuery?: Record<string, any>,
	): Promise<Blob> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postExport(payload, {
				condition: { ...condition, ...paramCondition },
				filters: [
					...(filters?.filter((item) => item.active !== false)?.map(({ active, ...item }) => item) || []),
					...(paramFilters ?? []),
				],
				...(otherQuery ?? {}),
			});
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		sort,
		setSort,
		getByIdModel,
		getOneModel,
		getModel,
		deleteModel,
		deleteManyModel,
		putModel,
		putManyModel,
		postModel,
		getAllModel,
		page,
		setPage,
		limit,
		setLimit,
		loading,
		setLoading,
		filters,
		setFilters,
		condition,
		setCondition,
		edit,
		setEdit,
		isView,
		setIsView,
		visibleForm,
		setVisibleForm,
		total,
		setTotal,
		formSubmiting,
		setFormSubmiting,
		danhSach,
		setDanhSach,
		record,
		setRecord,
		importHeaders,
		setImportHeaders,
		handleEdit,
		handleView,
		getImportHeaderModel,
		getImportTemplateModel,
		postExecuteImpotModel,
		postValidateModel,
		getByIdService,
		getService,
		getAllService,
		postService,
		putService,
		getExportFieldsModel,
		postExportModel,
		selectedIds,
		setSelectedIds,
		initFilter,
	};
};

export default useInitModel;
