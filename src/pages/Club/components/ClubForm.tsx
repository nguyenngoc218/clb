import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, notification } from 'antd'; 
import { useModel } from 'umi';
import dayjs from 'dayjs';

interface ClubFormProps {
  visible: boolean;
  onCancel: () => void;
  initialValues?: any;
}

const ClubForm: React.FC<ClubFormProps> = ({ visible, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const { addClub, editClub } = useModel('useClubModel');

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          // Chuyển đổi string từ API thành đối tượng dayjs để DatePicker hiển thị được
          foundingDate: initialValues.foundingDate ? dayjs(initialValues.foundingDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const onFinish = (values: any) => {
    // QUAN TRỌNG: Bạn thiếu phần định nghĩa formattedValues ở đây dẫn đến lỗi reactRender
    const formattedValues = {
      ...values,
      // Chuyển đối tượng dayjs ngược lại thành string để lưu vào database
      foundingDate: values.foundingDate ? values.foundingDate.format('YYYY-MM-DD') : undefined,
    };

    if (initialValues?.id) {
      editClub(initialValues.id, formattedValues);
      notification.success({ message: 'Cập nhật thành công' }); 
    } else {
      addClub(formattedValues);
      notification.success({ message: 'Thêm mới thành công' }); 
    }
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm mới Câu lạc bộ'}
      visible={visible} // Dùng visible phù hợp với phiên bản antd hiện tại của bạn
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
          name="name" 
          label="Tên câu lạc bộ" 
          rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="leader" label="Chủ nhiệm">
          <Input />
        </Form.Item>
        <Form.Item name="foundingDate" label="Ngày thành lập">
          <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} placeholder="Nhập mô tả câu lạc bộ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClubForm;