import React, { useState } from "react";
import "antd/dist/antd.css";
import { Form, Input, DatePicker, TimePicker } from "antd";
import FriendsInvite from "./Invite.js";

const { RangePicker } = TimePicker;
const CourseAdd = (props) => {
  const [componentSize, setComponentSize] = useState("default");
  const [TitleValue, setTitleValue] = useState();
  const [DateValue, setDateValue] = useState();
  const [TimeValue, setTimeValue] = useState();

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onTitleChange = (event) => {
    setTitleValue(event.currentTarget.value);
  };

  const onDateChange = (event) => {
    setDateValue(event.dateString);
  };

  const onTimeChange = (event) => {
    setTimeValue(event.timeString);
  };

  return (
    <>
      <Form
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 14
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
      >
        <Form.Item label="CourseName">
          <Input onChange={onTitleChange} value={TitleValue} />
        </Form.Item>
        <Form.Item label="Select Date">
          <DatePicker onChange={onDateChange} value={DateValue} />
        </Form.Item>
        <Form.Item label="Select Time">
          <RangePicker onChange={onTimeChange} value={TimeValue} />
        </Form.Item>
        <Form.Item label="Invite Friends">
          <FriendsInvite />
        </Form.Item>
      </Form>
    </>
  );
};

export default CourseAdd;
