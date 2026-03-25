import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, Select, message, Tag } from 'antd';
import { useRef, useState } from 'react';
import { useModel } from 'umi';
import { RegistrationItem } from '@/interfaces/registration';
import { SwapOutlined } from '@ant-design/icons';

const MemberPage = () => {
  const { registrations, changeClub } = useModel('useRegModel');
  const { clubs } = useModel('useClubModel');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [targetClubId, setTargetClubId] = useState<string | null>(null);

  // Lọc danh sách thành viên đã được duyệt
  const memberData = registrations.filter(item => item.status === 'approved');

  const handleTransfer = () => {
    if (!targetClubId) return message.error('Vui lòng chọn câu lạc bộ đích');
    changeClub(selectedRowKeys as string[], targetClubId);
    message.success(`Đã chuyển ${selectedRowKeys.length} thành viên thành công`);
    setIsTransferModalVisible(false);
    setSelectedRowKeys([]);
    setTargetClubId(null);
  };

  const columns: ProColumns<RegistrationItem>[] = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    {
      title: 'Câu lạc bộ hiện tại',
      dataIndex: 'clubId',
      valueType: 'select',
      // Dùng valueEnum để map ID sang tên CLB và hỗ trợ bộ lọc (Filter)
      valueEnum: clubs.reduce((acc, cur) => ({ ...acc, [cur.id]: { text: cur.name } }), {}),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      valueEnum: {
        male: { text: 'Nam' },
        female: { text: 'Nữ' },
        other: { text: 'Khác' },
      },
    },
  ];

  return (
    <>
      <ProTable<RegistrationItem>
        columns={columns}
        dataSource={memberData}
        rowKey="id"
        headerTitle="Danh sách Thành viên chính thức"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        tableAlertOptionRender={() => (
          <Button 
            type="primary" 
            icon={<SwapOutlined />} 
            onClick={() => setIsTransferModalVisible(true)}
          >
            Đổi CLB cho {selectedRowKeys.length} thành viên
          </Button>
        )}
      />

      {/* Modal Chuyển Câu Lạc Bộ */}
      <Modal
        title="Chuyển Câu lạc bộ hàng loạt"
        open={isTransferModalVisible}
        onOk={handleTransfer}
        onCancel={() => setIsTransferModalVisible(false)}
        okText="Xác nhận chuyển"
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          Bạn đang thực hiện thay đổi câu lạc bộ cho <b>{selectedRowKeys.length}</b> thành viên.
        </div>
        <p>Chọn câu lạc bộ muốn chuyển đến:</p>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn câu lạc bộ đích"
          onChange={(value) => setTargetClubId(value)}
          options={clubs
            .filter(c => c.isActive) // Chỉ hiện các CLB đang hoạt động
            .map(c => ({ label: c.name, value: c.id }))
          }
        />
      </Modal>
    </>
  );
};

export default MemberPage;