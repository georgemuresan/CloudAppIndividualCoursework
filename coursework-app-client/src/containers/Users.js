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
            <h1><font size="6" ><b>USER PROFILE</b></font></h1>
              
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
            
            {this.state.isAdmin &&
            <FormGroup controlId="changeUserStatusTitle">
          
          <h1><font size="4" ><b>Change the User Status:</b></font></h1>
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