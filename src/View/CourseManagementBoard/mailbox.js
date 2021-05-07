import React from "react";
import { Col, Card, Row } from "antd";
import { TeamOutlined, DeleteOutlined } from "@ant-design/icons";
import API from "../../Utils/api.js";

const { Meta } = Card;

class Mailbox extends React.Component {
  state = {
    invitations: []
  };

  componentWillMount() {
    let user= sessionStorage.getItem('username');
    const token = sessionStorage.getItem('access_token');
    API.get(`user/${user}`,{ headers: {"Authorization" : `Bearer ${token}`}})
      .then(res => {
        console.log(res.data.mailBox);
        let rows = res.data.mailBox.map((item,i) => {
           return {
             key:i,
             _id:item._id,
             courseName:item.courseName,
             date:item.date,
             time:item.time,
             participants:item.participants,
             sendById:item.sentByID,
             courseID:item.courseID};
        });

        this.setState({
          invitations: rows
        });
      })
  }

  HandleDelete(id, index){
    API.delete(`/mailBox/${id}`)
      .then((response) => {
        var array = [...this.state.invitations];
        array.splice(index, 1);
        this.setState({
          invitations: array
        });
        this.props.history.push('/dashboard');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  HandleSubmit(id, index){
    API.get(`/mailBox/accept/${id}`)
      .then((response) => {
        var array = [...this.state.invitations];
        array.splice(index, 1);
        this.setState({
          invitations: array
        });
        this.props.history.push('/dashboard');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCards(invitations){
    invitations.map((Item, index) => {
      return (
        <Col span={6}>
          <Card
            title={`${Item.sendById} invitation`}
            style={{ width: 300 }}
            hoverable={true}
            actions={[
              <TeamOutlined
              onClick={this.HandleSubmit(Item._id, Item.key)}
               key="Join" />,
              <DeleteOutlined
                onClick={this.HandleDelete(Item._id, Item.key)}
                key="Decline"
              />
            ]}
          >
            <p>
              {`${Item.sendById} invites you to join the studying on course ${Item.courseName}
                  The meeting will start at ${Item.time[0]}-${Item.time[1]} on ${Item.date}`}
            </p>
          </Card>
        </Col>
      );
    });
  }

  render() {
    return (
      <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
        <br />
        {this.state.invitations.length === 0 ? (
          <div
            style={{
              display: "flex",
              height: "300px",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <h2>No post yet...</h2>
          </div>
        ) : (
          <div>
            <Row>
            {this.state.invitations.map((Item, index) => {
              return (
                <Col span={12}>
                  <Card
                    title={`${Item.sendById} invitation`}
                    style={{ width: 300 }}
                    hoverable={true}
                    actions={[
                      <TeamOutlined
                      onClick={()=>this.HandleSubmit(Item._id, Item.key)}
                       key="Join" />,
                      <DeleteOutlined
                        onClick={()=>this.HandleDelete(Item._id, Item.key)}
                        key="Decline"
                      />
                    ]}
                  >
                    <p>
                      {`${Item.sendById} invites you to join the studying on course ${Item.courseName}
                          The meeting will start at ${Item.time[0]}-${Item.time[1]} on ${Item.date}`}
                    </p>
                  </Card>
                </Col>
              );
            })}

            </Row>
          </div>
        )}
      </div>
    );
  }
}
export default Mailbox;
