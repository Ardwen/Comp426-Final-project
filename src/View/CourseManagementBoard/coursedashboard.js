import React,{useEffect,useState} from "react";
import "antd/dist/antd.css";
import CourseBox from "./Components/box.js";
import FriendsInvite from "./Components/Invite.js";
import API from "../../Utils/api.js";
import {Link} from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Table,
  Tag,
  Space
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { RangePicker } = TimePicker;


function CourseDashboard(props){
  const columns=[
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
      render: (text) => <p>{text}</p>
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => <p>{`${time[0]}-${time[1]}`}</p>
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
      dataIndex: "courseID",
      render: (text) => (
        <Space size="middle">
          <Link to={`/room/${text}`}> Enter Room</Link>
        </Space>
      )
    },
    {
      title: "Delete",
      key: "delete",
      dataIndex: "key",
      render: (id) => (
        <Space size="middle">
          <button onClick={()=>handleDelete(id)}> Delete </button>
        </Space>
      )
    }

  ];

  const [courselist, setcourselist] = useState([]);
  const [visible, setvisible] = useState(false);
  const [confirmLoading, setconfirmLoading] = useState(false);
  const [title, settitle] = useState("");
  const [date, setdate] = useState("");
  const [time, settime] = useState([]);
  const [participants, setparticipants] = useState([]);

  const refresh=()=>{
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('access_token');
    API.get(`user/${username}`,{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(res => {
        console.log(res.data);
        let rows = res.data.courses.map((item,i) => {
           return {
             key:i,
             courseName:item.courseName,
             date:item.date,
             time:item.time,
             participants:item.participants,
             courseID:item._id};
        });
        setcourselist(rows);
      })
  }

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('access_token');
    API.get(`user/${username}`,{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(res => {
        console.log(res.data);
        let rows = res.data.courses.map((item,i) => {
           return {
             key:i,
             courseName:item.courseName,
             date:item.date,
             time:item.time,
             participants:item.participants,
             courseID:item._id};
        });
        setcourselist(rows);
      })
  },[]);

  const handleCancel=()=>{
    setvisible(false);
    setdate("");
    settime([]);
    setparticipants([]);
    settitle("");
  }

  const onTitleChange=(event)=>{
    settitle(event.currentTarget.value);
  }

  const onDateChange=(value, dateString)=>{
    setdate(dateString);
  }

  const onTimeChange=(value, timeString)=>{
    console.log(timeString[0] + "-" + timeString[1]);
    settime(timeString);
  }


    const enterRoom=(id)=> {
      console.log(id);
    };

    const handleDelete=(key)=> {
      var dataSource = [...courselist];
      var id = dataSource[key].courseID;
      var username = sessionStorage.getItem('username');
      console.log(dataSource[key].courseID);
      setcourselist(dataSource.filter(item => item.key !== key));
      API.delete(`course/${username}/${id}`).then((res) => {
        console.log(res.data);
      });
    };

    const callbackFunction = (childData) => {
      setparticipants([...participants,childData]);
    }

    const handleOk=()=>{
      let user = sessionStorage.getItem('username');
      let dataToSubmit = {
        courseName: title,
        date: date,
        time: time,
        participants: participants,
        host: user
      };
      console.log(dataToSubmit);


      API.post(`course/add`, dataToSubmit).then((res) => {
        if (res.status !== 200) {
          alert("submit error");
          return;
        } else {
          refresh();
        }
      });
      setvisible(false);
      setdate("");
      settime([]);
      setparticipants([]);
      settitle("");
    }



    return(
      <div>
        <CourseBox box1={courselist.length} c2={props.c2} c3={props.c3}/>
        <br />
        <Button
          type="dashed"
          onClick={() => setvisible(true)}
          style={{ width: "60%" }}
        >
          <PlusOutlined /> Add Course
        </Button>
        <Modal
          title="Schedule new course"
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Form
            labelCol={{
              span: 6
            }}
            wrapperCol={{
              span: 14
            }}
            layout="horizontal"
          >
            <Form.Item label="CourseName">
              <Input onChange={onTitleChange} value={title} />
            </Form.Item>
            <Form.Item label="Select Date">
              <DatePicker
                onChange={onDateChange}
                //value={this.state.date}
              />
            </Form.Item>
            <Form.Item label="Select Time">
              <RangePicker
                onChange={onTimeChange}
                //value={this.state.time}
              />
            </Form.Item>
            <Form.Item label="Invite Friends">
              <FriendsInvite parentCallback = {callbackFunction}/>
            </Form.Item>
          </Form>
        </Modal>
        <div style={{ width: "80%", margin: "3rem auto" }}>
          <div style={{ textAlign: "center" }}>
            <h1> Lecture Schedule</h1>
          </div>
          <br />
          <Table columns={columns} dataSource={courselist} />
        </div>
      </div>
    );
}

export default CourseDashboard;
