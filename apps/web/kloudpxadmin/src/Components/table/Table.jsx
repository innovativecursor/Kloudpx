import { Table, Space, Avatar, Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const data = [
  {
    key: "1",
    name: "Leslie Alexander",
    email: "lesie.alexander@example.com",
    date: "10/10/2020",
    time: "09:15-09:45am",
    doctor: "Dr. Jacob Jones",
    condition: "Mumps Stage II",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    key: "2",
    name: "Ronald Richards",
    email: "ronald.richards@example.com",
    date: "10/12/2020",
    time: "12:00-12:45pm",
    doctor: "Dr. Theresa Webb",
    condition: "Depression",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    key: "3",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    date: "10/13/2020",
    time: "01:15-01:45pm",
    doctor: "Dr. Jacob Jones",
    condition: "Arthritis",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    key: "4",
    name: "Robert Fox",
    email: "robert.fox@gmail.com",
    date: "10/14/2020",
    time: "02:00-02:45pm",
    doctor: "Dr. Arlene McCoy",
    condition: "Fracture",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    key: "5",
    name: "Jenny Wilson",
    email: "jenny.wilson@example.com",
    date: "10/15/2020",
    time: "12:00-12:45pm",
    doctor: "Dr. Esther Howard",
    condition: "Depression",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    key: "6",
    name: "Cody Fisher",
    email: "cody.fisher@example.com",
    date: "10/16/2020",
    time: "10:00-10:30am",
    doctor: "Dr. Marvin McKinney",
    condition: "Flu",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    key: "7",
    name: "Kristin Watson",
    email: "kristin.watson@example.com",
    date: "10/17/2020",
    time: "03:00-03:45pm",
    doctor: "Dr. Darlene Robertson",
    condition: "Migraine",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    key: "8",
    name: "Savannah Nguyen",
    email: "savannah.nguyen@example.com",
    date: "10/18/2020",
    time: "09:00-09:30am",
    doctor: "Dr. Wade Warren",
    condition: "Asthma",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    key: "9",
    name: "Guy Hawkins",
    email: "guy.hawkins@example.com",
    date: "10/19/2020",
    time: "01:00-01:30pm",
    doctor: "Dr. Leslie Alexander",
    condition: "Fever",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    key: "10",
    name: "Eleanor Pena",
    email: "eleanor.pena@example.com",
    date: "10/20/2020",
    time: "11:00-11:45am",
    doctor: "Dr. Jerome Bell",
    condition: "Back Pain",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (_, record) => (
      <Space>
        <Avatar src={record.avatar} />
        {record.name}
      </Space>
    ),
  },
  { title: "Email", dataIndex: "email" },
  { title: "Date", dataIndex: "date" },
  { title: "Visit Time", dataIndex: "time" },
  { title: "Doctor", dataIndex: "doctor" },
  { title: "Conditions", dataIndex: "condition" },
  {
    title: "Actions",
    render: () => (
      <Space>
        <EditOutlined style={{ color: "blue" }} />
        <DeleteOutlined style={{ color: "red" }} />
      </Space>
    ),
  },
];

export default function UsersTable() {
  return (
    <Card title="All Users" style={{ margin: 20 }}>
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "1000px" }}
        />
      </div>
    </Card>
  );
}
