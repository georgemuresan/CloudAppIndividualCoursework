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
            <h1><font size="6" ><b>USER REQUEST</b></font></h1>
            </FormGroup>
            <FormGroup controlId="userStatusTitle">
             <h1><font size="4" ><b>User status: </b><font size="3" >{this.state.userStatus}</font></font></h1>
            </FormGroup>

            <FormGroup controlId="userFirstNameTitle">
            <h1><font size="4" ><b>First Name: </b><font size="3" color="black">{this.state.userFirstName}</font></font></h1>
            </FormGroup>
           
            <FormGroup controlId="userLastNameTitle">
            <h1><font size="4" ><b>Last Name: </b><font size="3" color="black">{this.state.userLastName}</font></font></h1>
            </FormGroup>

            <FormGroup controlId="userDepartmentTitle">
            <h1><font size="4" ><b>Department: </b><font size="3" color="black">{this.state.userDepartment}</font></font></h1>
            </FormGroup>
          
            <FormGroup controlId="userDescriptionTitle">
            <h1><font size="4" ><b>Description: </b><font size="3" color="black">{this.state.userDescription}</font></font></h1>
            </FormGroup>
           
            <FormGroup controlId="userSkillstitle">
            <h1><font size="4" ><b>Skills: </b></font></h1>
            </FormGroup>
            <FormGroup controlId="userSkills">
              {this.renderSkills()}
            </FormGroup>
            <FormGroup controlId="userEmailTitle">
            <h1><font size="4" ><b>Email: </b><font size="3" color="black">{this.state.userEmail}</font></font></h1>
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