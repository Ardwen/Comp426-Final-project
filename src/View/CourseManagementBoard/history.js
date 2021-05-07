import React from "react";
import "antd/dist/antd.css";
import { Table, Tag } from "antd";

const columns = [
  {
    title: "Course Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <p>{text}</p>
  },
  {
    videolink: "course video",
    dataIndex: "videos",
    key: "videos",
    render: (text) => <p>{text}</p>
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
  }
];
class CourseHistory extends React.Component {
  state = {
    history: []
  };

  componentWillMount() {
    this.setState({});
  }

  render() {
    return (
      <div>
        <Table columns={columns} dataSource={this.state.history} />
      </div>
    );
  }
}

export default CourseHistory;
