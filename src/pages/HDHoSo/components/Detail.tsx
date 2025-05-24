import React from 'react';
import { Modal, Descriptions, Button, Typography } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';
import { getNameFile } from '@/utils/utils'; // Assuming getNameFile is available for extracting file names

interface HuongDanHSRecord {
	id?: string;
	title?: string;
	category?: string;
	date?: string;
	summary?: string;
	fileUrl?: string;
	fileSize?: string;
}

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: HuongDanHSRecord;
	onEdit: () => void;
}

const HuongDanHSDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	const intl = useIntl();

	if (!record) return null;

	// Format fileSize to human-readable format (e.g., KB or MB)
	const formatFileSize = (size: string) => {
		const bytes = parseInt(size, 10);
		if (isNaN(bytes)) return 'N/A';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'huongdanhs.detail.title', defaultMessage: 'Chi tiết hướng dẫn hồ sơ' })}
			visible={isVisible}
			onCancel={onClose}
			width={800}
			footer={[
				<div key='footer' style={{ textAlign: 'center' }}>
					<Button type='primary' onClick={onEdit} style={{ marginRight: 8 }} size='large'>
						{intl.formatMessage({ id: 'global.button.chinhsua', defaultMessage: 'Chỉnh sửa' })}
					</Button>
					<Button onClick={onClose} size='large'>
						{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
					</Button>
				</div>,
			]}
		>
			<Descriptions
				column={2}
				bordered
				labelStyle={{ fontWeight: 600, width: 150 }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='Tiêu đề' span={2}>
					{record.title || 'Không có tiêu đề'}
				</Descriptions.Item>
				<Descriptions.Item label='Danh mục'>{record.category || 'Không có danh mục'}</Descriptions.Item>
				<Descriptions.Item label='Ngày đăng'>
					{record.date ? moment(record.date, 'DD/MM/YYYY').format('DD/MM/YYYY') : 'N/A'}
				</Descriptions.Item>
				<Descriptions.Item label='Tóm tắt' span={2}>
					{record.summary || 'Không có tóm tắt'}
				</Descriptions.Item>
				<Descriptions.Item label='Tệp hướng dẫn' span={2}>
					{record.fileUrl ? (
						<Typography.Link href={record.fileUrl} target='_blank'>
							<DownloadOutlined style={{ marginRight: 8 }} />
							{getNameFile(record.fileUrl) || 'Tải tệp'}
						</Typography.Link>
					) : (
						'Không có tệp'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Dung lượng tệp'>
					{record.fileSize ? formatFileSize(record.fileSize) : 'N/A'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default HuongDanHSDetail;
