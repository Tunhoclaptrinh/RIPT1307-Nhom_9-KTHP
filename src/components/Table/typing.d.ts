import type { ColumnType } from 'antd/lib/table';
import { type EOperatorType } from './constant';

export interface IColumn<T> extends Omit<ColumnType<T>, 'dataIndex' | 'width' | 'children'> {
	/** Ẩn cột khi hiển thị trên table, nhưng vẫn có trong filter, import, export */
	hide?: boolean;

	children?: IColumn<T>[];

	/** Cho phép sắp xếp hay ko, thường chỉ nên cho sắp xêp các trường: Mã, tên (ngắn), số lượng, ngày */
	sortable?: boolean;

	/** Data để filter với trường họp chọn filterType là 'select' */
	filterData?: string[] | TDataOption[];

	/** Các loại filter, đối với
	 * - 'customselect' thì phải có 'filterCustomSelect'
	 * - 'select' thì phải có 'filterData' */
	filterType?: 'string' | 'number' | 'date' | 'datetime' | 'select' | 'customselect';

	/** JSX Element trả về 1 mảng value, thường là id */
	filterCustomSelect?: JSX.Element;

	/** Bắt buộc phải có để dùng custom Filter hoặc Import dữ liệu
	 * Có thể filter 'string' với các trường populated
	 */
	dataIndex?: keyof T | 'index' | [keyof T, string];

	/** Bắt buộc phải có
	 * Lưu ý: độ rộng phải fit tương đối với nội dung của column, ko để quá rộng, hẹp
	 * Phải check cả ở mobile view
	 */
	width: number;

	/** CHỈ DÙNG TRONG TABLE STATIC
	 * Hàm sort tùy chỉnh (có thể dùng để sắp xếp họ tên theo AB)
	 */
	customSort?: (value1: any, value2: any) => number;
}

export type TDataOption = {
	label: string;
	value: string | number;
};

export type TableBaseProps = {
	/** Tên model */
	modelName: any;

	/** Import dùng model khác? */
	modelImportName?: any;
	/** Export dùng model khác? */
	modelExportName?: any;

	/** Component để hiển thị chi tiết bản ghi */
	ViewForm?: React.FC;
	/** Có hiển thị cột hành động "Xem chi tiết" không? Mặc định: true */
	showViewAction?: boolean;

	ViewModal?: React.ComponentType<any>; // Thêm dòng này
	viewModalProps?: any; // Th

	Form?: React.FC;
	formType?: 'Modal' | 'Drawer';
	columns: IColumn<any>[];
	title?: React.ReactNode;
	widthDrawer?: number | 'full';

	/** Hàm getData tùy chỉnh, nếu ko có thì 'getModel' của model sẽ là mặc định */
	getData?: (params: any) => void;

	/** Tham số phụ thuộc để getData được gọi */
	dependencies?: any[];

	/** Tham số để truyền vào hàm getData, ModalImport, ModalExport */
	params?: any;

	/** Các nội dung hiển thị trên header, bên cạnh button thêm mới */
	children?: React.ReactNode;

	border?: boolean;

	/** Tùy chọn các nút mặc định */
	buttons?: {
		/** Được thêm mới ko? Mặc định: Có */
		create?: boolean;
		/** Được nhập dữ liệu ko? Mặc định: Không */
		import?: boolean;
		/** Được xuất dữ liệu ko? Mặc định: Không */
		export?: boolean;
		/** Được lọc tùy chỉnh ko? Mặc định: Có */
		filter?: boolean;
		/** Có nút tải lại ko? Mặc định: Có */
		reload?: boolean;
	};

	/** Danh sách các nút khác bên cạnh Thêm mới */
	otherButtons?: JSX.Element[];

	/** Biến lưu dữ liệu trong model, Mặc định: danhSach */
	dataState?: string;

	otherProps?: TableProps<any>;

	/** Click vào mask để đóng form ko? Mặc định: Không */
	maskCloseableForm?: boolean;

	noCleanUp?: boolean;

	rowSelection?: boolean;
	/** View antd Row Selection */
	detailRow?: any;

	/** Cho phép xóa nhiều, đi kèm với props `rowSelection` */
	deleteMany?: boolean;

	hideTotal?: boolean;
	pageable?: boolean;
	hideCard?: boolean;

	/** Text hiển thị khi ko có dữ liệu */
	emptyText?: string;

	/** Ko cần thiết */
	scroll?: { x?: number; y?: number };

	formProps?: any;

	/** Có destroy Modal sau khi thêm mới, chỉnh sửa ko? Mặc định: Không */
	destroyModal?: boolean;

	/** Có thêm cột STT ko? Mặc định: Có */
	addStt?: boolean;

	/** Có hiển thị thị kéo thả sắp xêp hàng ko? Mặc định: Không */
	rowSortable?: boolean;

	/**
	 * Sự kiện khi hàng được kéo đến vị trí mới
	 * @param record Record ứng với hàng được kéo thả
	 * @param newIndex Vị trí mới được kéo đến: 0 -> (limit-1)
	 * @returns
	 */
	onSortEnd?: (record: any, newIndex: number) => void;

	hideChildrenRows?: boolean;
};

export type TFilter<T> = {
	field: keyof T | [keyof T, string];
	operator?: EOperatorType;
	values: (string | number)[];
	active?: boolean;
};

export type TableStaticProps = {
	data: any[];
	columns: IColumn<any>[];

	title?: React.ReactNode;
	Form?: any;
	formProps?: any;

	showEdit?: boolean;
	setShowEdit?: (vi: boolean) => void;
	addStt?: boolean;
	children?: any;
	hasCreate?: boolean;
	hasTotal?: boolean;
	size?: 'small' | 'middle';
	otherProps?: TableProps<any>;
	loading?: boolean;
	formType?: 'Modal' | 'Drawer';
	widthDrawer?: number;

	/** Có hiển thị thị kéo thả sắp xêp hàng ko? Mặc định: Không */
	rowSortable?: boolean;

	/**
	 * Sự kiện khi hàng được kéo đến vị trí mới
	 * @param record Record ứng với hàng được kéo thả
	 * @param newIndex Vị trí mới được kéo đến: 0 -> (limit-1)
	 * @returns
	 */
	onSortEnd?: (record: any, newIndex: number) => void;

	hideChildrenRows?: boolean;
};

// IMPORT HEADER

export type TImportHeader = {
	field: string;
	label: string;
	required: boolean;
	type: TImportDataType;
};

export type TImportDataType = 'String' | 'Number' | 'Boolean' | 'Date';

export type TImportResponse = {
	error: boolean;
	validate?: TImportRowResponse[];
};

export type TImportRowResponse = {
	index: number;
	rowIndex: number;
	row: { row: number };
	rowErrors?: string[];
};

// EXPORT FIELD

export type TExportField = {
	_id: string;
	label: string;
	fields: string[];
	labels: string[];
	required: boolean;
	type: string;
	children?: TExportField[];
	selected?: boolean;
	disableImport?: boolean;
};
