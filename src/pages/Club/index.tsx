import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Tag, Space, Popconfirm, Avatar, message } from 'antd';
import { useRef, useState } from 'react';
import { useModel, history } from 'umi';
import { ClubItem } from '@/interfaces/club';
import ClubForm from './components/ClubForm';

const ClubListPage = () => {
  const actionRef = useRef<ActionType>();
  const { clubs, deleteClub } = useModel('useClubModel');
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<ClubItem | undefined>();

  const columns: ProColumns<ClubItem>[] = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      hideInSearch: true,
      render: (url: any) => <Avatar src={url} shape="square" size={48} />,
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      copyable: true,
      sorter: (a, b) => a.name.localeCompare(b.name), // Sắp xếp theo tên
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundingDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'leader',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      filters: true,
      onFilter: true,
      valueEnum: {
        true: { text: 'Đang hoạt động', status: 'Success' },
        false: { text: 'Ngừng hoạt động', status: 'Error' },
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => { setEditingClub(record); setModalVisible(true); }}>
            <EditOutlined /> Sửa
          </a>
          <a onClick={() => history.push(`/members?clubId=${record.id}`)}>
            <TeamOutlined /> Thành viên
          </a>
          <Popconfirm 
            title="Xóa câu lạc bộ này?" 
            onConfirm={() => { deleteClub(record.id); message.success('Đã xóa'); }}
          >
            <a style={{ color: 'red' }}><DeleteOutlined /> Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<ClubItem>
        headerTitle="Danh sách Câu lạc bộ"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        dataSource={clubs} // Sử dụng dữ liệu từ Model
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { setEditingClub(undefined); setModalVisible(true); }}>
            Thêm mới
          </Button>,
        ]}
        columns={columns}
      />
      
      {/* Component Form (Thêm/Sửa) - Chúng ta sẽ code ở file riêng */}
      <ClubForm 
        visible={isModalVisible} 
        onCancel={() => setModalVisible(false)} 
        initialValues={editingClub}
      />
    </>
  );
};

export default ClubListPage;