import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Users.css";
import LoaderButton from "../components/LoaderButton";

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isDeleting: null,
      user: null,
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
      
      const { userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = user;
      this.setState({
        user,
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
    return API.get("User", `/User/${this.props.match.params.id}`);
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

   handleEmail = async event => {
    this.setState({
      newUser: true
    });
  }


  render() {
    return (
      <div className="Users">
        {this.state.user &&
          <form >
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
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isLoading}
              onClick={this.handleEmail}
              text="EMAIL"
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