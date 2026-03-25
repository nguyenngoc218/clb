import React, { useMemo } from 'react';
import { Card, Col, Row, Statistic, Button, Space } from 'antd';
import { Column } from '@ant-design/plots';
import { useModel } from 'umi';
import * as XLSX from 'xlsx';
import { DownloadOutlined, ApartmentOutlined, FileTextOutlined } from '@ant-design/icons';

const DashboardPage: React.FC = () => {
  const { clubs } = useModel('useClubModel');
  const { registrations } = useModel('useRegModel');

  // --- 1. Tính toán số lượng chung ---
  const stats = useMemo(() => ({
    totalClubs: clubs.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  }), [clubs, registrations]);

  // --- 2. Xử lý dữ liệu cho ColumnChart ---
  // xAxis: Tên CLB, yAxis: Số lượng theo 3 trạng thái
  const chartData = useMemo(() => {
    const data: any[] = [];
    clubs.forEach(club => {
      const clubRegs = registrations.filter(r => r.clubId === club.id);
      
      data.push({ clubName: club.name, count: clubRegs.filter(r => r.status === 'pending').length, type: 'Pending' });
      data.push({ clubName: club.name, count: clubRegs.filter(r => r.status === 'approved').length, type: 'Approved' });
      data.push({ clubName: club.name, count: clubRegs.filter(r => r.status === 'rejected').length, type: 'Rejected' });
    });
    return data;
  }, [clubs, registrations]);

  const config = {
    data: chartData,
    isGroup: true,
    xField: 'clubName',
    yField: 'count',
    seriesField: 'type',
    columnStyle: { radius: [4, 4, 0, 0] },
    color: ['#1890ff', '#52c41a', '#f5222d'], // Blue, Green, Red
    label: { position: 'middle', layout: [{ type: 'interval-adjust-position' }] },
  };

  // --- 3. Hàm Xuất Excel ---
  const handleExportExcel = (clubId: string, clubName: string) => {
    const members = registrations
      .filter(r => r.clubId === clubId && r.status === 'approved')
      .map(m => ({
        'Họ và Tên': m.fullName,
        'Email': m.email,
        'Số điện thoại': m.phone,
        'Giới tính': m.gender === 'male' ? 'Nam' : 'Nữ',
        'Địa chỉ': m.address,
        'Sở trường': m.strength,
      }));

    if (members.length === 0) {
      return message.warning(`CLB ${clubName} chưa có thành viên chính thức.`);
    }

    const worksheet = XLSX.utils.json_to_sheet(members);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Thành viên');
    XLSX.writeFile(workbook, `Danh_sach_thanh_vien_${clubName}.xlsx`);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Thống kê dạng số */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card bordered={false} hoverable><Statistic title="Tổng số CLB" value={stats.totalClubs} prefix={<ApartmentOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable><Statistic title="Chờ duyệt" value={stats.pending} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable><Statistic title="Đã duyệt" value={stats.approved} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable><Statistic title="Từ chối" value={stats.rejected} valueStyle={{ color: '#f5222d' }} /></Card>
        </Col>
      </Row>

      {/* Biểu đồ cột */}
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Card title="Thống kê đơn đăng ký theo từng CLB" bordered={false}>
            <Column {...config} />
          </Card>
        </Col>
        
        {/* Xuất Excel theo từng CLB */}
        <Col span={6}>
          <Card title="Xuất danh sách (XLSX)" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {clubs.map(club => (
                <Button 
                  key={club.id} 
                  icon={<DownloadOutlined />} 
                  block 
                  onClick={() => handleExportExcel(club.id, club.name)}
                >
                  {club.name}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;