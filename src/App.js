import React from "react";
import "./styles.css";
import CourseManagementView from "./View/CourseManagementBoard/CourseManagementView.js";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Room from "./View/CourseRoomView.js";
import Login from "./View/LoginView.js"
import Register from "./View/RegisterView.js"
export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={CourseManagementView} />
          <Route exact path="/room/:roomID" component={Room} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
