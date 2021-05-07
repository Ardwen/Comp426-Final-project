import React, { useState } from "react";
import "antd/dist/antd.css";
import { Table, Tag, Space } from "antd";

function CourseTable(props) {
  const [Courselist, setCourselist] = useState(props.courselist);

  //const [LectureList,setLectureList] = useState([])

  /*useEffect( () => {
    Axios.get(`${USER_SERVER}/ListMuseume/${window.localStorage.getItem('username')}`)
    .then(response => {
        setMuseumeList(response.data)
    })
  },[])*/

  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time"
    },
    {
      title: "Participants",
      key: "participants",
      dataIndex: "participants",
      render: (participants) => (
        <>
          {participants.map((name) => {
            return (
              <Tag color={"geekblue"} key={name}>
                {name}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a> Invite </a>
          <a> Delete</a>
        </Space>
      )
    }
  ];

  return (
    <div style={{ width: "80%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1> Lecture Schedule</h1>
      </div>
      <br />
      <Table columns={columns} dataSource={Courselist} />
    </div>
  );
}

export default CourseTable;
