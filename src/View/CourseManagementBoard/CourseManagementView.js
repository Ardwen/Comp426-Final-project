import React from "react";
import axios from "axios";
import "antd/dist/antd.css";
import "./index.css";
import { Layout, Menu, Badge } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MessageOutlined,
  DashboardOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import CourseDashboard from "./coursedashboard.js";
import Mailbox from "./mailbox.js";
import CourseHistory from "./history.js";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
class CourseManagementView extends React.Component {
  state = {
    collapsed: false,
    content: "1",
    theme: "dark",
    color: "#003366",
    color1:"black",
    color2: "#188fffd0",
    color3:"#f1855ad0"
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  switchToDashboard = () => {
    this.setState({
      content: "1"
    });
    console.log(this.state.content);
  };

  switchToHistory = () => {
    this.setState({
      content: "2"
    });
  };

  switchToMessage = () => {
    this.setState({
      content: "3"
    });
  };

  changeTheme = () => {
    console.log("clocked");
    let lightcolor = (col,amt) => {
        var usePound = false;
        if ( col[0] == "#" ) {
            col = col.slice(1);
            usePound = true;
        }

        var num = parseInt(col,16);

        var r = (num >> 16) + amt;

        if ( r > 255 ) r = 255;
        else if  (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;

        if ( b > 255 ) b = 255;
        else if  (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;

        if ( g > 255 ) g = 255;
        else if  ( g < 0 ) g = 0;

        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
     }
    axios.post(`https://tenapi.cn/color/`)
      .then((response) => {
        console.log(response.data);
        let data=response.data;
        let c1 = lightcolor(data,-30);
        let c2 = lightcolor(data,30);
        this.setState({
          theme: "light",
          color: `${data}`,
          color2: `${c1}`,
          color3: `${c2}`
        });
      }, (error) => {
        console.log(error);
      });
    /*if(this.state.theme == "light"){
      this.setState({
        theme: "dark",
        color: "#003366",
        color2:
        color:
      });
    } else {
      this.setState({
        theme: "light",
        color: "white"
      });
    }*/
  }

  logout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("access_token");
    this.props.history.push('/');
  }

  renderSwitch(param,color1,color2,color3) {
    switch (param) {
      case "1":
        return <CourseDashboard c1={color1} c2={color2} c3={color3}/>;
      case "2":
        return <CourseHistory c1={color1} c2={color2} c3={color3}/>;
      case "3":
        return <Mailbox c1={color1} c2={color2} c3={color3}/>;
      default:
    }
  }

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <Menu theme={this.state.theme} mode="inline" defaultSelectedKeys={["1"]} style={{ height: '100%', borderRight: 0 }}>
            <Menu.Item
              key="1"
              icon={<DashboardOutlined />}
              onClick={this.switchToDashboard}
            >
              Course Dashboard
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<HistoryOutlined />}
              onClick={this.switchToHistory}
            >
              History
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={
                <Badge count={1} dot>
                  {" "}
                  <MessageOutlined />
                </Badge>
              }
              onClick={this.switchToMessage}
            >
              Message
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={
                  <DashboardOutlined />
              }
              onClick={this.changeTheme}
            >
              Change Theme
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="1" onClick={this.logout}>Log out</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">

          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              backgroundColor: this.state.color,
              color:this.state.color1
            }}
          >
            {this.renderSwitch(this.state.content,this.state.color1,this.state.color2,this.state.color3)}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default CourseManagementView;
