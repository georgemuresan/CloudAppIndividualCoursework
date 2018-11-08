import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Users.css";

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      user: null,
      userFirstName: "",
      userLastName: "",
      userDepartment: "",
      userSkills: [],
      currentUserID: ""
    };
  }

  async componentDidMount() {
    try {
      const user = await this.getUser();
      
      const { userFirstName, userLastName, userDepartment, userSkills } = user;
      this.setState({
        user,
        userFirstName,
        userLastName,
        userDepartment,
        userSkills
      });
    } catch (e) {
      alert(e);
    }
  }

  getUser() {
    return API.get("User", `/User/${this.props.match.params.id}`);
  }


  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }


  render() {
    return (
      <div className="Users">
        {this.state.user &&
          <form >
            <FormGroup controlId="projectName">
              <ControlLabel><font size="4" color="blue">PROJECT NAME</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="projectDescription">
              <ControlLabel><font size="4" color="blue">PROJECT DESCRIPTION</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="status">
              <ControlLabel><font size="4" color="blue">STATUS:</font><font size="3" color="red"><i> va trebui sa mai bag un atribut la project - statusul</i></font></ControlLabel>
            </FormGroup>
          </form>}
      </div>
    );
  }
}