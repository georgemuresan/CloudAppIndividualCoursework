import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./UsersApproval.css";
import LoaderButton from "../components/LoaderButton";

export default class UsersApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isDeleting: null,
      user: null,
      currentUserID: "",
      userEmail: "",
      userStatus: "",
      userFirstName: "",
      userLastName: "",
      userDepartment: "",
      userDescription: "",
      userSkills: [],
      emailValue: false

    };
  }

  async componentDidMount() {
    try {
      const user = await this.getUser();
      
      const { userID, userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = user;
      this.setState({
        user,
        currentUserID : userID,
        userEmail,
        userStatus,
        userFirstName,
        userLastName,
        userDepartment,
        userDescription,
        userSkills
      });
    } catch (e) {
      alert(e);
    }
  }

  getUser() {
    return API.get("User", `/User/chosen/${this.props.match.params.id}`);
  }

  saveUser(user) {
    return API.put("User", `/User/chosen/${this.state.currentUserID}`, {
      body: user
    });
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }


    renderSkills() {
    return (
     <ul>
     {this.state.userSkills.map(function(name, index){
         return <li key={ index }>{name}</li>;
       })}
    </ul>
      );
   }

   
  handleApprove = async event => {
    event.preventDefault();

    this.setState({ isLoading: true,
      userStatus: "Project Manager" });
    try {

      await this.saveUser({
        userStatus: "Project Manager",
        userFirstName: this.state.userFirstName,
        userLastName: this.state.userLastName,
        userDepartment: this.state.userDepartment,
        userDescription: this.state.userDescription,
        userSkills: this.state.userSkills,
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

   handleEmail = async event => {
    this.setState({
      newUser: true
    });
  }
 
  handleDecline = async event => {
    event.preventDefault();

    this.setState({ isLoading: true,
    userStatus: "Developer" });

    try {

      await this.saveUser({
        userStatus: "Developer",
        userFirstName: this.state.userFirstName,
        userLastName: this.state.userLastName,
        userDepartment: this.state.userDepartment,
        userDescription: this.state.userDescription,
        userSkills: this.state.userSkills,
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  render() {
    return (
      <div className="Users">
        {this.state.user &&
          <form >
            <FormGroup controlId="titlePage">
              <ControlLabel><font size="4" color="blue">USER REQUEST</font></ControlLabel>
            </FormGroup>
             <FormGroup controlId="userStatusTitle">
              <ControlLabel><font size="4" color="blue">User status: </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userStatus">
              <ControlLabel><font size="3" color="black">{this.state.userStatus}</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userFirstNameTitle">
              <ControlLabel><font size="4" color="blue">First Name: </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userFirstName">
              <ControlLabel><font size="3" color="black">{this.state.userFirstName}</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userLastNameTitle">
              <ControlLabel><font size="4" color="blue">Last Name: </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userLastName">
              <ControlLabel><font size="3" color="black">{this.state.userLastName}</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userDepartmentTitle">
              <ControlLabel><font size="4" color="blue">Department: </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userDepartment">
              <ControlLabel><font size="3" color="black">{this.state.userDepartment}</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userDescriptionTitle">
              <ControlLabel><font size="4" color="blue">Description: </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userDescription">
              <ControlLabel><font size="3" color="black">{this.state.userDescription}</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userSkillstitle">
              <ControlLabel><font size="4" color="blue">Skills: </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userSkills">
              {this.renderSkills()}
            </FormGroup>
            <FormGroup controlId="userEmailTitle">
              <ControlLabel><font size="4" color="blue">Email: </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userEmail">
              <ControlLabel><font size="3" color="black">{this.state.userEmail}</font></ControlLabel>
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              isLoading={this.state.isLoading}
              onClick={this.handleApprove}
              text="APPROVE"
              loadingText="Processing..."
            />
             <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isLoading}
              onClick={this.handleDecline}
              text="DECLINE"
              loadingText="Processing..."
            />
          </form>}
      </div>
    );
  }

//FOR EMAILING USERS
  //render() {
   // return (
   //   <div className="UserProfile">
   //     {this.state.emailValue === false
   //       ? this.renderUserPage()
   //       : this.renderEmailUserPage()}
   //   </div>
   // );
 // }
}