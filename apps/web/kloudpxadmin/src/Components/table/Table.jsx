import { Table, Space, Avatar, Card, Tag } from "antd";

const columns = [
  {
    title: "Avatar",
    render: (_, record) => (
      <Avatar src={`https://i.pravatar.cc/150?u=${record.id}`} />
    ),
  },
  {
    title: "Name",
    render: (_, record) => `${record.first_name} ${record.last_name}`,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Email Verified",
    dataIndex: "email_verified",
    render: (verified) =>
      verified ? (
        <Tag color="green">Verified</Tag>
      ) : (
        <Tag color="red">Not Verified</Tag>
      ),
  },
];

export default function UsersTable({ userData }) {
  return (
    <Card title="All Users" style={{ margin: 20 }}>
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={userData?.users || []}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </Card>
  );
}
