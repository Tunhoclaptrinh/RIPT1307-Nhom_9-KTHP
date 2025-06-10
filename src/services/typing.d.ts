// import { Table } from "antd";
// // Types for import functionality
// export type TImportHeader = {
//   field: string;
//   label: string;
//   type: 'String' | 'Number' | 'Boolean' | 'Date';
//   required?: boolean;
// };

// export type TImportRowResponse = {
//   index: number;
//   rowErrors?: string[];
// };

// export type TImportResponse = {
//   validate?: TImportRowResponse[];
//   error: boolean;
// };

// // Column interface for tables
// export interface IColumn<T = any> {
//   title?: React.ReactNode;
//   dataIndex?: string;
//   width?: number;
//   align?: 'left' | 'center' | 'right';
//   fixed?: 'left' | 'right';
//   render?: (value: any, record: T, index: number) => React.ReactNode;
//   onCell?: (record: T, index?: number) => any;
//   sortable?: boolean;
//   filterType?: 'string' | 'number' | 'date' | 'select';
// }

// // Modal import props
// export type ModalImportProps = {
//   /** Modal có hiện ko? */
//   visible: boolean;

//   /** Đóng modal hoặc làm gì đó */
//   onCancel: () => void;

//   /** Get data hoặc làm gì đó */
//   onOk: () => void;

//   /** Tên model kế thừa initModel */
//   modelName: any;

//   /** Ấn ra ngoài để đóng, mặc định KHÔNG */
//   maskCloseableForm?: boolean;

//   /** Data thêm vào mỗi record khi validate và execute import */
//   extendData?: Record<string, string | number>;

//   /** Hàm gọi API để get file import mẫu */
//   getTemplate?: () => Promise<Blob>;

//   /** Tên file Excel mẫu, mặc định `File biểu mẫu.xlsx` */
//   titleTemplate?: string;
// };