declare module NganhDaoTao {
    export interface IRecord {
        id: string;
        ma: string;
        ten: string;
        moTa: string;
        toHopXetTuyenId: string;
    }

    // Types for import functionality
    export type TImportHeader = {
        field: string;
        label: string;
        type: 'String' | 'Number' | 'Boolean' | 'Date';
        required?: boolean;
    };

    export type TImportRowResponse = {
        index: number;
        rowErrors?: string[];
    };

    export type TImportResponse = {
        validate?: TImportRowResponse[];
        error: boolean;
    };
}

// Types for import functionality (shared with PhuongThucXT)
export type TImportHeader = {
    field: string;
    label: string;
    type: 'String' | 'Number' | 'Boolean' | 'Date';
    required?: boolean;
};

export type TImportRowResponse = {
    index: number;
    rowErrors?: string[];
};

export type TImportResponse = {
    validate?: TImportRowResponse[];
    error: boolean;
};

// Column interface for tables
export interface IColumn<T = any> {
    title?: React.ReactNode;
    dataIndex?: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: (value: any, record: T, index: number) => React.ReactNode;
    onCell?: (record: T, index?: number) => any;
    sortable?: boolean;
    filterType?: 'string' | 'number' | 'date' | 'select';
}

// Modal import props
export type ModalImportProps = {
    /** Modal visibility */
    visible: boolean;

    /** Close modal or perform action */
    onCancel: () => void;

    /** Get data or perform action */
    onOk: () => void;

    /** Model name inheriting initModel */
    modelName: any;

    /** Allow closing by clicking outside, default is false */
    maskCloseableForm?: boolean;

    /** Additional data for each record during validate and execute import */
    extendData?: Record<string, string | number>;

    /** Function to get import template file */
    getTemplate?: () => Promise<Blob>;

    /** Excel template file name, default is 'File biểu mẫu.xlsx' */
    titleTemplate?: string;
};