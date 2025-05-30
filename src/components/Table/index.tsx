import { primaryColor } from '@/services/base/constant';
import { inputFormat } from '@/utils/utils';
import {
	CloseOutlined,
	ExportOutlined,
	FilterOutlined,
	FilterTwoTone,
	ImportOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	ReloadOutlined,
	SearchOutlined,
	FullscreenExitOutlined,
	FullscreenOutlined,
} from '@ant-design/icons';
import {
	AutoComplete,
	Button,
	Card,
	ConfigProvider,
	Drawer,
	Empty,
	Input,
	message,
	Modal,
	Popconfirm,
	Space,
	Table,
	Tooltip,
	type InputRef,
	type PaginationProps,
} from 'antd';
import type { FilterValue, SortOrder } from 'antd/lib/table/interface';
import classNames from 'classnames';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import type { SortEnd, SortableContainerProps } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useModel } from 'umi';
import ButtonExtend from './ButtonExtend';
import ModalExport from './Export';
import ModalImport from './Import';
import ModalCustomFilter from './ModalCustomFilter';
import { EOperatorType } from './constant';
import { findFiltersInColumns, updateSearchStorage } from './function';
import './style.less';
import type { IColumn, TDataOption, TFilter, TableBaseProps } from './typing';

const TableBase = (props: TableBaseProps) => {
	const { modelName, Form, title, dependencies = [], params, buttons, widthDrawer, destroyModal } = props;
	const [isExpanded, setIsExpanded] = useState(false);
	const model = useModel(modelName);
	const {
		visibleForm,
		setVisibleForm,
		setEdit,
		setRecord,
		setIsView,
		selectedIds,
		setSelectedIds,
		page,
		limit,
		total,
		setPage,
		setLimit,
		condition,
		loading,
		sort,
		setSort,
		setFilters,
		deleteManyModel,
		initFilter,
	} = model;
	const filters: TFilter<any>[] = model?.filters;
	const getData = props.getData ?? model?.getModel;
	const hasFilter = props.columns?.filter((item) => item.filterType)?.length;
	const [finalColumns, setColumns] = useState<IColumn<any>[]>([]);
	const [visibleFilter, setVisibleFilter] = useState(false);
	const [visibleImport, setVisibleImport] = useState(false);
	const [visibleExport, setVisibleExport] = useState(false);
	const searchInputRef = useRef<InputRef>(null);

	useEffect(() => {
		setPage(1);
	}, [JSON.stringify(filters ?? [])]);

	useEffect(() => {
		console.log('TableBase: Fetching data with page:', page, 'limit:', limit, 'total:', total);
		getData(params);
	}, [...dependencies, filters, condition, sort, page, limit]);

	useEffect(() => {
		return () => {
			if (props.noCleanUp !== true) {
				setFilters(initFilter);
				setSelectedIds(undefined);
			}
		};
	}, []);

	const getFilterColumn = (fieldName: any, operator?: EOperatorType, active?: boolean) =>
		filters?.find(
			(item) =>
				JSON.stringify(item.field) === JSON.stringify(fieldName) &&
				(operator === undefined || item.operator === operator) &&
				(active === undefined || item.active === undefined || item.active === active),
		);

	const getCondValue = (dataIndex: any) => {
		const type = typeof dataIndex;
		return _.get(sort, type === 'string' ? dataIndex : dataIndex?.join('.'), []);
	};

	const getSortValue = (dataIndex: any): SortOrder => {
		const value = getCondValue(dataIndex);
		return value === 1 ? 'ascend' : value === -1 ? 'descend' : null;
	};

	const getSort = (dataIndex: any): Partial<IColumn<unknown>> => ({
		sorter: true,
		sortDirections: ['ascend', 'descend'],
		sortOrder: getSortValue(dataIndex),
	});

	const handleSearch = (dataIndex: any, value: string, confirm?: () => void) => {
		if (!value) {
			const tempFilters = filters?.filter((item) => JSON.stringify(item.field) !== JSON.stringify(dataIndex));
			setFilters(tempFilters);
		} else {
			const filter = getFilterColumn(dataIndex);
			let tempFilters: TFilter<any>[] = [...(filters ?? [])];
			if (filter) {
				tempFilters = tempFilters.map((item) =>
					JSON.stringify(item.field) === JSON.stringify(dataIndex)
						? { ...item, active: true, operator: EOperatorType.CONTAIN, values: [value] }
						: item,
				);
			} else {
				tempFilters.push({
					active: true,
					field: dataIndex,
					operator: EOperatorType.CONTAIN,
					values: [value],
				});
			}
			setFilters(tempFilters);
		}
		if (confirm) confirm();
	};

	const getColumnSearchProps = (dataIndex: any, columnTitle: any): Partial<IColumn<unknown>> => {
		const filterColumn = getFilterColumn(dataIndex, EOperatorType.CONTAIN, true);
		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
				const options = (JSON.parse(localStorage.getItem('dataTimKiem') || '{}')[dataIndex] || []).map(
					(value: string) => ({
						value,
						label: value,
					}),
				);

				return (
					<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
						<AutoComplete
							options={options}
							onSelect={(value: string) => {
								setSelectedKeys([value]);
								handleSearch(dataIndex, value, confirm);
							}}
						>
							<Input.Search
								placeholder={`Tìm ${columnTitle}`}
								allowClear
								enterButton
								value={selectedKeys[0]}
								onChange={(e) => {
									if (e.type === 'click') {
										setSelectedKeys([]);
										confirm();
									} else {
										setSelectedKeys(e.target.value ? [e.target.value] : []);
									}
								}}
								onSearch={(value) => {
									if (value) updateSearchStorage(dataIndex, value);
									handleSearch(dataIndex, value, confirm);
								}}
								ref={searchInputRef}
							/>
						</AutoComplete>
						{buttons?.filter !== false && hasFilter ? (
							<div>
								Xem thêm{' '}
								<a
									onClick={() => {
										setVisibleFilter(true);
										confirm();
									}}
								>
									Bộ lọc tùy chỉnh
								</a>
							</div>
						) : null}
					</div>
				);
			},
			filteredValue: filterColumn?.values ?? [],
			filterIcon: () => {
				const values = getFilterColumn(dataIndex, undefined, true)?.values;
				const filtered = values && values[0];
				return <SearchOutlined className={filtered ? 'text-primary' : undefined} />;
			},
			onFilterDropdownVisibleChange: (vis) => vis && setTimeout(() => searchInputRef?.current?.select(), 100),
		};
	};

	const handleFilter = (dataIndex: any, values: string[]) => {
		if (!values || !values.length) {
			const tempFilters = filters?.filter((item) => JSON.stringify(item.field) !== JSON.stringify(dataIndex));
			setFilters(tempFilters);
		} else {
			const filter = getFilterColumn(dataIndex);
			let tempFilters: TFilter<any>[] = [...(filters ?? [])];
			if (filter) {
				tempFilters = tempFilters.map((item) =>
					JSON.stringify(item.field) === JSON.stringify(dataIndex)
						? { ...item, active: true, operator: EOperatorType.INCLUDE, values }
						: item,
				);
			} else {
				tempFilters.push({
					active: true,
					field: dataIndex,
					operator: EOperatorType.INCLUDE,
					values,
				});
			}
			setFilters(tempFilters);
		}
	};

	const getFilterColumnProps = (dataIndex: any, filterData?: any[]): Partial<IColumn<unknown>> => {
		const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);
		return {
			filters: filterData?.map((item: string | TDataOption) =>
				typeof item === 'string'
					? { key: item, value: item, text: item }
					: { key: item.value, value: item.value, text: item.label },
			),
			filteredValue: filterColumn?.values ?? [],
			filterSearch: true,
		};
	};

	const getColumnSelectProps = (dataIndex: any, filterCustomSelect?: JSX.Element): Partial<IColumn<unknown>> => {
		if (!filterCustomSelect) return {};
		const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);
		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
				<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
					<Space size={0}>
						<div style={{ width: 300 }}>
							{React.cloneElement(filterCustomSelect, {
								value: selectedKeys,
								onChange: (value: any) => setSelectedKeys(Array.isArray(value) ? value : [value]),
								style: { width: '100%' },
							})}
						</div>
						<Button
							type='primary'
							icon={<FilterOutlined />}
							onClick={() => {
								handleFilter(dataIndex, selectedKeys as string[]);
								confirm();
							}}
						/>
					</Space>
					{buttons?.filter !== false && hasFilter ? (
						<div>
							Xem thêm{' '}
							<a
								onClick={() => {
									setVisibleFilter(true);
									confirm();
								}}
							>
								Bộ lọc tùy chỉnh
							</a>
						</div>
					) : null}
				</div>
			),
			filteredValue: filterColumn?.values ?? [],
		};
	};

	const getColumns = () => {
		let final: IColumn<any>[] = props.columns.map((item) => ({
			...item,
			...(item.sortable && getSort(item.dataIndex)),
			...(item.filterType === 'string'
				? getColumnSearchProps(item.dataIndex, item.title)
				: item.filterType === 'select'
				? getFilterColumnProps(item.dataIndex, item.filterData)
				: item.filterType === 'customselect'
				? getColumnSelectProps(item.dataIndex, item.filterCustomSelect)
				: undefined),
			children: item.children?.map((child) => ({
				...child,
				...(child.sortable && getSort(child.dataIndex)),
				...(child.filterType === 'string'
					? getColumnSearchProps(child.dataIndex, child.title)
					: child.filterType === 'select'
					? getFilterColumnProps(child.dataIndex, child.filterData)
					: child.filterType === 'customselect'
					? getColumnSelectProps(child.dataIndex, child.filterCustomSelect)
					: undefined),
			})),
		}));

		final = final?.filter((item) => item?.hide !== true);
		if (props.addStt !== false)
			final.unshift({
				title: 'TT',
				dataIndex: 'index',
				align: 'center',
				width: 50,
			});

		setColumns(final);
	};

	useEffect(() => {
		getColumns();
	}, [JSON.stringify(filters), sort, ...props.columns]);

	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

	const SortableItem = SortableElement((props1: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props1} />);
	const SortableBody = SortableContainer((props1: React.HTMLAttributes<HTMLTableSectionElement>) => (
		<tbody {...props1} />
	));

	if (props.rowSortable)
		finalColumns.unshift({
			title: '',
			width: 30,
			align: 'center',
			render: () => <DragHandle />,
		});

	const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		if (oldIndex !== newIndex) {
			const record = model?.[props.dataState || 'danhSach']?.[oldIndex];
			if (props.onSortEnd) props.onSortEnd(record, newIndex);
		}
	};

	const DraggableContainer = (props1: SortableContainerProps) => (
		<SortableBody useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props1} />
	);

	const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
		const index = restProps['data-row-key'];
		return <SortableItem index={index ?? 0} {...restProps} />;
	};

	const onChange = (pagination: PaginationProps, fil: Record<string, FilterValue | null>, sorter: any) => {
		const allColumns = finalColumns
			.map((col) => {
				if (col.children?.length) return [col, ...col.children];
				else return [col];
			})
			.flat();

		Object.entries(fil).map(([field, values]) => {
			const dataIndex = field.includes('.') ? field.split('.') : field;
			const col = allColumns.find((item) => JSON.stringify(item.dataIndex) === JSON.stringify(dataIndex));
			if (col?.filterType === 'select') handleFilter(dataIndex, values as any);
			else if (col?.filterType === 'string') handleSearch(dataIndex, values?.[0] as any);
			else if (col?.filterType === 'customselect') handleFilter(dataIndex, values as any);
		});

		const { order, field } = sorter;
		const orderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : undefined;
		if (setSort) setSort(orderValue ? { [Array.isArray(field) ? field.join('.') : field]: orderValue } : {});

		const { current, pageSize } = pagination;
		setPage(current);
		setLimit(pageSize);
	};

	// const handleDeleteMany = () => {
	// 	if (deleteManyModel && selectedIds?.length)
	// 		deleteManyModel(selectedIds, () => getData(params))
	// 			.then(() => setSelectedIds(undefined))
	// 			.catch((er: any) => console.log(er));
	// };

	const handleDeleteMany = async () => {
		if (!selectedIds?.length) {
			message.warning('Vui lòng chọn ít nhất một mục để xóa');
			return;
		}

		try {
			await deleteManyModel(selectedIds);
			message.success(`Đã xóa ${selectedIds.length} mục`);
			setSelectedIds([]); // Reset selected items
			getData(params); // Refresh data
		} catch (error) {
			console.error('Delete many error:', error);
			message.error('Có lỗi xảy ra khi xóa dữ liệu');
		}
	};

	const mainContent = (
		<div className='table-base'>
			{props.children}

			<div className='header'>
				<div className='action'>
					{buttons?.create !== false ? (
						<ButtonExtend
							size={props?.otherProps?.size}
							onClick={() => {
								setRecord({});
								setEdit(false);
								setIsView(false);
								setVisibleForm(true);
							}}
							icon={<PlusCircleOutlined />}
							type='primary'
							notHideText
							tooltip='Thêm mới dữ liệu'
						>
							Thêm mới
						</ButtonExtend>
					) : null}

					{buttons?.import ? (
						<ButtonExtend
							size={props?.otherProps?.size}
							icon={<ImportOutlined />}
							onClick={() => setVisibleImport(true)}
						>
							Nhập dữ liệu
						</ButtonExtend>
					) : null}
					{buttons?.export ? (
						<ButtonExtend
							size={props?.otherProps?.size}
							icon={<ExportOutlined />}
							onClick={() => setVisibleExport(true)}
						>
							Xuất dữ liệu {selectedIds?.length > 0 ? `(${selectedIds.length})` : ''}
						</ButtonExtend>
					) : null}

					{props.otherButtons}

					{props.rowSelection && props.deleteMany && selectedIds?.length ? (
						<Popconfirm title={`Xác nhận xóa ${selectedIds?.length} mục đã chọn?`} onConfirm={handleDeleteMany}>
							<ButtonExtend type='link' danger>
								Xóa {selectedIds?.length} mục
							</ButtonExtend>
						</Popconfirm>
					) : null}
				</div>

				<div className='extra'>
					{buttons?.reload !== false ? (
						<ButtonExtend
							size={props?.otherProps?.size}
							icon={<ReloadOutlined />}
							onClick={() => getData(params)}
							loading={loading}
							tooltip='Tải lại dữ liệu'
						>
							Tải lại
						</ButtonExtend>
					) : null}

					{buttons?.filter !== false && hasFilter ? (
						<ButtonExtend
							size={props?.otherProps?.size}
							icon={
								findFiltersInColumns(finalColumns, filters)?.length ? (
									<FilterTwoTone twoToneColor={primaryColor} />
								) : (
									<FilterOutlined />
								)
							}
							onClick={() => setVisibleFilter(true)}
							tooltip='Áp dụng bộ lọc tùy chỉnh'
						>
							Bộ lọc tùy chỉnh
						</ButtonExtend>
					) : null}

					{!props?.hideTotal ? (
						<Tooltip title='Tổng số dữ liệu'>
							<div className={classNames({ total: true, small: props?.otherProps?.size === 'small' })}>
								Tổng số:
								<span>{inputFormat(total || 0)}</span>
							</div>
						</Tooltip>
					) : null}
				</div>
			</div>

			<ConfigProvider
				renderEmpty={() => (
					<Empty
						style={{ marginTop: 32, marginBottom: 32 }}
						description={props.emptyText ?? 'Không có dữ liệu'}
						image={props.otherProps?.size === 'small' ? Empty.PRESENTED_IMAGE_SIMPLE : undefined}
					/>
				)}
			>
				<Table
					scroll={{ x: _.sum(finalColumns.map((item) => item.width ?? 80)), ...props.scroll }}
					// rowSelection={
					// 	props?.rowSelection
					// 		? {
					// 				type: 'checkbox',
					// 				selectedRowKeys: selectedIds ?? [],
					// 				preserveSelectedRowKeys: true,
					// 				onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys),
					// 				columnWidth: 40,
					// 				...props.detailRow,
					// 		  }
					// 		: undefined
					// }
					rowSelection={
						props?.rowSelection
							? {
									type: 'checkbox',
									selectedRowKeys: selectedIds ?? [],
									preserveSelectedRowKeys: true,
									onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys),
									columnWidth: 40,
									...props.detailRow,
									// Thêm getCheckboxProps để lấy đúng ID
									getCheckboxProps: (record) => ({
										id: record.id,
									}),
							  }
							: undefined
					}
					rowKey={(record) => record.id}
					loading={loading}
					bordered={props.border || true}
					pagination={{
						current: page,
						pageSize: limit,
						position: ['bottomRight'],
						total,
						showSizeChanger: true,
						pageSizeOptions: ['5', '10', '25', '50', '100'],
						showTotal: (tongSo: number) => (
							<Space>
								{props?.rowSelection ? (
									<>
										<span>Đã chọn: {selectedIds?.length ?? 0}</span>
										{selectedIds?.length > 0 ? (
											<span>
												(
												<a href='#!' onClick={() => setSelectedIds(undefined)}>
													Bỏ chọn tất cả
												</a>
												)
											</span>
										) : null}
									</>
								) : null}
								<span>Tổng số: {tongSo}</span>
							</Space>
						),
					}}
					onChange={onChange}
					dataSource={model?.[props.dataState || 'danhSach']?.map((item: any, index: number) => ({
						...item,
						index: index + 1 + (page - 1) * limit * (props.pageable === false ? 0 : 1),
						key: item?._id ?? index,
						children:
							!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
								? item.children
								: undefined,
					}))}
					columns={finalColumns as any[]}
					components={
						props.rowSortable
							? {
									body: {
										wrapper: DraggableContainer,
										row: DraggableBodyRow,
									},
							  }
							: undefined
					}
					{...props.otherProps}
				/>
			</ConfigProvider>
		</div>
	);

	return (
		<>
			{props.hideCard ? (
				mainContent
			) : (
				<Card title={title || false} bordered={props.border || false}>
					{mainContent}
				</Card>
			)}

			{Form && (
				<>
					{props.formType === 'Drawer' ? (
						<Drawer
							// className={widthDrawer === 'full' ? 'drawer-full' : ''}
							className={isExpanded || widthDrawer === 'full' ? 'drawer-full' : ''}
							maskClosable={props.maskCloseableForm || false}
							width={widthDrawer !== 'full' ? widthDrawer : undefined}
							footer={false}
							bodyStyle={{ padding: 0 }}
							visible={visibleForm}
							destroyOnClose={destroyModal || false}
						>
							<Form title={title ?? ''} {...props.formProps} />
							<div className='expand-button'>
								{/* Expand Button */}
								<div
									onClick={() => setIsExpanded(!isExpanded)}
									style={{ transform: 'translate(-30px, -5px)', cursor: 'pointer' }}
								>
									{isExpanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
								</div>
								{/* Close Button */}
							</div>
							<CloseOutlined
								className='close-button'
								onClick={() => setVisibleForm(false)}
								style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }}
							/>
						</Drawer>
					) : (
						<Modal
							// className={widthDrawer === 'full' ? 'modal-full' : ''}
							className={isExpanded || widthDrawer === 'full' ? 'modal-full' : ''}
							maskClosable={props.maskCloseableForm || false}
							width={widthDrawer !== 'full' ? widthDrawer : undefined}
							onCancel={() => setVisibleForm(false)}
							footer={false}
							bodyStyle={{ padding: 0 }}
							visible={visibleForm}
							destroyOnClose={destroyModal || false}
						>
							<Form title={title ?? ''} {...props.formProps} />
							<div className='expand-button' onClick={() => setIsExpanded(!isExpanded)}>
								{/* Expand Button */}
								{isExpanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
							</div>
						</Modal>
					)}
				</>
			)}

			{buttons?.filter !== false && hasFilter ? (
				<ModalCustomFilter
					visible={visibleFilter}
					setVisible={setVisibleFilter}
					columns={finalColumns}
					filters={filters}
					setFilters={setFilters}
				/>
			) : null}

			{buttons?.import ? (
				<ModalImport
					visible={visibleImport}
					modelName={props.modelImportName ?? modelName}
					onCancel={() => setVisibleImport(false)}
					onOk={() => getData(params)}
					titleTemplate={title ? `Biểu mẫu ${title}.xlsx` : undefined}
					extendData={params}
				/>
			) : null}

			{buttons?.export ? (
				<ModalExport
					visible={visibleExport}
					modelName={props.modelExportName ?? modelName}
					onCancel={() => setVisibleExport(false)}
					fileName={`Danh sách ${title ?? 'dữ liệu'}.xlsx`}
					condition={params}
				/>
			) : null}
		</>
	);
};

export default TableBase;
