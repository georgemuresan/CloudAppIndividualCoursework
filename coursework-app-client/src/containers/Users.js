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
            <FormGroup controlId="userFirstNameTitle">
              <ControlLabel><font size="4" color="blue">First Name</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userFirstName">
              <ControlLabel><font size="2" color="black">{this.state.userFirstName}</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userLastNameTitle">
              <ControlLabel><font size="4" color="blue">First Name</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userLastName">
              <ControlLabel><font size="2" color="black">{this.state.userLastName}</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userDepartmentTitle">
              <ControlLabel><font size="4" color="blue">First Name</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userDepartment">
              <ControlLabel><font size="2" color="black">{this.state.userDepartment}</font></ControlLabel>
            </FormGroup>
          </form>}
      </div>
    );
  }
}