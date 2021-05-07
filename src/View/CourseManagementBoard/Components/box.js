import React from "react";
import "antd/dist/antd.css";
import { Card, Col, Row } from "antd";

function CourseBox(props) {
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Schedule"
            bordered={true}
            style={{ backgroundColor: props.c2 }}
          >
            You have {props.box1} lectures scheduled
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Achievement"
            bordered={true}
            style={{ backgroundColor: props.c3 }}
          >
            You have completed 0 Lectures
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CourseBox;
