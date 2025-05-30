import React, { useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Modal, message, Space } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import UserForm from '@/pages/Users/components/Form';
const { Option } = Select;
const { TextArea } = Input;

interface PersonalInfoProps {
	record?: any;
	edit?: boolean;
	setVisibleForm?: (visible: boolean) => void;
	postModel?: (data: any) => Promise<void>;
	putModel?: (id: string, data: any) => Promise<void>;
	visibleForm?: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
	record = {},
	edit = false,
	setVisibleForm,
	postModel,
	putModel,
	visibleForm,
}) => {
	const [form] = Form.useForm();
	const intl = useIntl();
	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();
	const [submitting, setSubmitting] = useState(false);
	const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// Reset form and address states when form visibility changes
	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
			setSelectedProvince(undefined);
			setSelectedDistrict(undefined);
			setSelectedWard(undefined);
		} else if (record?.id) {
			const formData = {
				...record,
				ho: record.hoTen?.split(' ').slice(0, -1).join(' ') || '',
				ten: record.hoTen?.split(' ').slice(-1)[0] || '',
				ngayCap: record.ngayCap ? moment(record.ngayCap) : undefined,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
				hoKhauThuongTru: {
					tinh_ThanhPho: record.hoKhauThuongTru?.tinh_ThanhPho,
					quanHuyen: record.hoKhauThuongTru?.quanHuyen,
					xaPhuong: record.hoKhauThuongTru?.xaPhuong,
					diaChi: record.hoKhauThuongTru?.diaChi,
				},
			};
			form.setFieldsValue(formData);

			const province = record.hoKhauThuongTru?.tinh_ThanhPho;
			const district = record.hoKhauThuongTru?.quanHuyen;
			const ward = record.hoKhauThuongTru?.xaPhuong;

			setSelectedProvince(province);
			if (province && district) {
				setTimeout(() => {
					setSelectedDistrict(district);
					if (ward) {
						setTimeout(() => {
							setSelectedWard(ward);
						}, 500);
					}
				}, 500);
			}
		}
	}, [record?.id, visibleForm, form]);

	const onFinish = async (values: any) => {
		try {
			setSubmitting(true);
			const submitData = {
				...values,
				hoTen: `${values.ho} ${values.ten}`.trim(),
				ngayCap: values.ngayCap?.format('YYYY-MM-DD'),
				ngaySinh: values.ngaySinh?.format('YYYY-MM-DD'),
				hoKhauThuongTru: {
					tinh_ThanhPho: values.hoKhauThuongTru?.tinh_ThanhPho,
					quanHuyen: values.hoKhauThuongTru?.quanHuyen,
					xaPhuong: values.hoKhauThuongTru?.xaPhuong,
					diaChi: values.hoKhauThuongTru?.diaChi,
				},
			};

			if (!edit && (!values.password || values.password.trim() === '')) {
				submitData.password = values.soCCCD;
			}

			if (edit) {
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				await putModel?.(record.id, submitData);
			} else {
				await postModel?.(submitData);
			}
			setVisibleForm?.(false);
			form.resetFields();
		} catch (error) {
			console.error('Form submission error:', error);
			message.error('Lỗi khi gửi biểu mẫu');
		} finally {
			setSubmitting(false);
		}
	};

	return <UserForm hideFooter={true}></UserForm>;
};

export default PersonalInfo;
