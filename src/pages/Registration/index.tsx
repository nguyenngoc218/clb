import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, Input, message, Tag, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useModel } from 'umi';
import { RegistrationItem } from '@/interfaces/registration';
import { CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons';

const RegistrationPage = () => {
  const { registrations, updateStatus } = useModel('useRegModel');
  const { clubs } = useModel('useClubModel'); // Lấy danh sách CLB để hiển thị tên
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null); // null nếu duyệt hàng loạt

  const handleApprove = (ids: string[]) => {
    Modal.confirm({
      title: `Xác nhận duyệt ${ids.length} đơn đã chọn?`,
      onOk: () => {
        updateStatus(ids, 'approved');
        setSelectedRowKeys([]);
        message.success('Đã duyệt đơn đăng ký');
      },
    });
  };

  const columns: ProColumns<RegistrationItem>[] = [
    { title: 'Họ tên', dataIndex: 'fullName', copyable: true },
    { title: 'Email', dataIndex: 'email', hideInSearch: true },
    { title: 'SĐT', dataIndex: 'phone' },
    { 
      title: 'Câu lạc bộ', 
      dataIndex: 'clubId',
      valueType: 'select',
      valueEnum: clubs.reduce((acc, cur) => ({ ...acc, [cur.id]: { text: cur.name } }), {}),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueEnum: {
        pending: { text: 'Chờ duyệt', status: 'Processing' },
        approved: { text: 'Đã duyệt', status: 'Success' },
        rejected: { text: 'Từ chối', status: 'Error' },
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => [
        <a key="history" onClick={() => Modal.info({
          title: 'Lịch sử thao tác',
          content: (
            <div>
              {record.history?.map((h, i) => (
                <p key={i}>- {h.operator} đã {h.action} lúc {h.time} {h.note ? `(Lý do: ${h.note})` : ''}</p>
              ))}
            </div>
          )
        })}>Lịch sử</a>,
        record.status === 'pending' && (
          <Space key="action">
            <a onClick={() => handleApprove([record.id])} style={{ color: '#52c41a' }}>Duyệt</a>
            <a onClick={() => { setCurrentId(record.id); setIsRejectModalVisible(true); }} style={{ color: '#f5222d' }}>Từ chối</a>
          </Space>
        ),
      ],
    },
  ];

  return (
    <>
      <ProTable<RegistrationItem>
        columns={columns}
        dataSource={registrations}
        rowKey="id"
        headerTitle="Quản lý đơn đăng ký"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>Đã chọn {selectedRowKeys.length} đơn</span>
            <a onClick={onCleanSelected}>Bỏ chọn</a>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleApprove(selectedRowKeys as string[])}>Duyệt hàng loạt</Button>
            <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => { setCurrentId(null); setIsRejectModalVisible(true); }}>Từ chối hàng loạt</Button>
          </Space>
        )}
      />

      {/* Modal nhập lý do từ chối */}
      <Modal
        title="Lý do từ chối"
        open={isRejectModalVisible}
        onOk={() => {
          if (!rejectNote) return message.error('Vui lòng nhập lý do');
          const ids = currentId ? [currentId] : (selectedRowKeys as string[]);
          updateStatus(ids, 'rejected', rejectNote);
          setIsRejectModalVisible(false);
          setRejectNote('');
          setSelectedRowKeys([]);
        }}
        onCancel={() => setIsRejectModalVisible(false)}
      >
        <Input.TextArea 
          rows={4} 
          placeholder="Nhập lý do từ chối bắt buộc..." 
          value={rejectNote} 
          onChange={(e) => setRejectNote(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default RegistrationPage;