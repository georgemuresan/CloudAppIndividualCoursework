import React, { Component } from "react";
import { API, Storage, Auth } from "aws-amplify";
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
      userID: "",
      emailValue: false,
      isAdmin: false,
      currentUserID: "",
      loggedID: ""
    };
  }

  async componentDidMount() {
    try {

      await Auth.currentAuthenticatedUser()
      .then(user => this.state.loggedID = user.username)
      .catch(err => alert(err));

      var viewedUSer = this.props.match.params.id;
      const user = await this.getUserChosen(viewedUSer);
    
      const loggedUser = await this.getUser();
     var checkAdmin = false;
     if (loggedUser.userStatus === "Admin"){
        checkAdmin = true;
      }

      const { userID, userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = user;
     
      this.setState({
        user,
        userEmail,
        userStatus,
        userFirstName,
        userLastName,
        userDepartment,
        userDescription,
        userSkills,
        userID,
        isAdmin: checkAdmin,
        currentUserID: viewedUSer
      });
    } catch (e) {
      alert(e);
    }
  }

  getUser() {
    return API.get("User", `/User/${this.state.loggedID}`);
  }

  getUserChosen(id) {
    return API.get("User", `/User/chosen/${id}`);
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

  handleStatusChange = event => {
    var selects = document.getElementsByName("stat");

    var resultStat = "";
    for (var i = 0, eachOption = selects.length; i < eachOption; i++) {
      var opt = selects[i];
      if (opt.selected) {
        resultStat = opt.value;
      }
    }
    this.setState({
      userStatus: resultStat
    });
  }

  renderStatus() {
    var currentStatus = this.state.userStatus;


    var values = [];

    if (currentStatus === "Admin") {
      values.push(<option value="Admin" selected name="stat" >Admin</option>);
      values.push(<option value="Project Manager"  name="stat" >Project Manager</option>);
      values.push(<option value="Developer, pending to become a Project Manager" name="stat" >Developer, pending to become a Project Manager</option>);
      values.push(<option value="Developer" name="stat" >Developer</option>);
    } else
      if (currentStatus === "Project Manager") {
        values.push(<option value="Admin"  name="stat" >Admin</option>);
        values.push(<option value="Project Manager" selected name="stat" >Project Manager</option>);
        values.push(<option value="Developer, pending to become a Project Manager" name="stat" >Developer, pending to become a Project Manager</option>);
        values.push(<option value="Developer" name="stat" >Developer</option>);
      } else
        if (currentStatus === "Developer, pending to become a Project Manager") {
          values.push(<option value="Admin"  name="stat" >Admin</option>);
          values.push(<option value="Project Manager"  name="stat" >Project Manager</option>);
          values.push(<option value="Developer, pending to become a Project Manager" selected name="stat" >Developer, pending to become a Project Manager</option>);
          values.push(<option value="Developer" name="stat" >Developer</option>);
        } else 
        if (currentStatus === "Developer") {
          values.push(<option value="Admin"  name="stat" >Admin</option>);
          values.push(<option value="Project Manager"  name="stat" >Project Manager</option>);
          values.push(<option value="Developer, pending to become a Project Manager" name="stat" >Developer, pending to become a Project Manager</option>);
          values.push(<option value="Developer" selected name="stat" >Developer</option>);
        } 


    return (<FormControl componentClass="select" placeholder="select" onChange={this.handleStatusChange}>
      {values}
    </FormControl>);
  }

  saveUser(user) {
    return API.put("User", `/User/chosen/${this.state.userID}`, {
      body: user
    });
  }
  
  handleSaveUser = async event => {

    event.preventDefault();

    this.setState({ isLoading: true });

    try {

      await this.saveUser({
        userFirstName: this.state.userFirstName,
        userLastName: this.state.userLastName,
        userDepartment: this.state.userDepartment,
        userDescription: this.state.userDescription,
        userStatus: this.state.userStatus,
        userSkills: this.state.userSkills,
      });
      this.setState({ isLoading: false });
      this.props.history.push(`/User/${this.state.userID}`);
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
            {this.state.isAdmin &&
            <FormGroup controlId="changeUserStatusTitle">
          
              <ControlLabel><font size="4" color="blue">Change the User Status:</font></ControlLabel>
              {this.renderStatus()}
           
              <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              isLoading={this.state.isLoading}
              onClick={this.handleSaveUser}
              text="Save changed status"
              loadingText="Saving..."
            />
             </FormGroup>
            }
            <LoaderButton
              block
              bsStyle="primary"
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