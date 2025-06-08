import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
const localhost = 'http://localhost:3000';
export enum EFileScope {
	PUBLIC = 'Public',
	INTERNAL = 'Internal',
	PRIVATE = 'Private',
}

const handleSingleFile = async (file: any, scope: EFileScope = EFileScope.PUBLIC): Promise<string | null> => {
	if (file?.originFileObj) {
		try {
			const response = await uploadFile({
				file: file?.originFileObj,
				scope,
			});
			return response?.data?.data?.url;
		} catch (er) {
			return Promise.reject(er);
		}
	} else return file?.url || null;
};

export async function uploadFile(payload: { file: string | Blob; scope: EFileScope }) {
	const form = new FormData();
	form.append('file', payload?.file);
	form.append('scope', payload?.scope);
	return axios.post(`${localhost}/api`, form);
}

/**
 * Build upload file from values in form
 * @param values: get from Form
 * @param fieldName: fieldName in Form is Upload
 * @param scope: Phạm vi của file : Public, Internal, Private
 * @returns Url of file uploaded or NULL
 */
export const buildUpLoadFile = async (
	values: any,
	fieldName: string,
	scope: EFileScope = EFileScope.PUBLIC,
): Promise<string | null> => {
	// File updload chưa onChange => value vẫn là string
	if (typeof values?.[fieldName] === 'string') return values[fieldName];
	else if (values?.[fieldName]?.fileList?.[0]) {
		return handleSingleFile(values?.[fieldName]?.fileList?.[0], scope);
	}
	return null;
};

/**
 * Build upload multiple files from values in form
 * @param values: get from Form
 * @param fieldName: fieldName in Form is Upload
 * @returns Array Url of files uploaded or NULL
 */
export const buildUpLoadMultiFile = async (
	values: any,
	fieldName: string,
	scope: EFileScope = EFileScope.PUBLIC,
): Promise<string[] | null> => {
	// File upload chưa onChange => value vẫn là sring[]
	if (Array.isArray(values?.[fieldName])) return values[fieldName];
	else if (
		values?.[fieldName]?.fileList &&
		Array.isArray(values?.[fieldName]?.fileList) &&
		values?.[fieldName]?.fileList?.length
	) {
		// Upload từng file lên
		return Promise.all(values?.[fieldName]?.fileList.map((file: any) => handleSingleFile(file, scope)));
	}
	return null;
};

export const getFileInfo = (id: string, ip?: string) => {
	return axios.get(`${ip ?? ip3}/file/${id}/info`);
};
