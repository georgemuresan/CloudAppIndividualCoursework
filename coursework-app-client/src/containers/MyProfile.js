import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./MyProfile.css";

export default class MyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      user: null,
      userEmail: "",
      userStatus: "",
      userFirstName: "",
      userLastName: "",
      userDepartment: "",
      userDescription: "",
      userSkills: [],
      currentUserID: "",
      oldState: "",
      allSkills: ["Java", "C++", "Assembly", "R", "Python", "PHP", "SQL", "Swing", "CSS", "HTML", "JSON", "CSV", "Team Leader", "JavaScript", "Pascal", "MatLab", "SolidWorks"],
      missingSkills: [],
      allDepartments: ["Engineering", "Computer Science", "Environmental Studies", "Electronics", "Maths and Sciences"]
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentAuthenticatedUser()
        .then(user => this.state.currentUserID = user.username)
        .catch(err => alert(err));


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
        userSkills,
        oldState: userStatus,
        missingSkills: [...this.state.allSkills].filter(x => !userSkills.includes(x))
      });

    } catch (e) {
      alert(e);
    }
  }

  //AICI trebuie sa lucrez  
  getUser() {
    //alert(this.state.currentUserID);
    return API.get("User", `/User/${this.state.currentUserID}`);
  }

  validateForm() {

    return this.state.userFirstName.length > 0 &&
      this.state.userLastName.length > 0 &&
      this.state.userDepartment.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  saveUser(user) {
    return API.put("User", `/User/${this.state.currentUserID}`, {
      body: user
    });
  }

  handleSubmit = async event => {
    let attachment;

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
      this.props.history.push("/");
      window.location.reload(false); 
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleRequest = event => {


    var currentUserState = this.state.userStatus;
    var boxes = document.getElementsByName("boxst");
    if (boxes[0].checked == true) {
      currentUserState = "Developer, pending to become a Project Manager";
    } else {
      currentUserState = "Developer";
    }
    this.setState({
      userStatus: currentUserState
    });
  };

  deletUser() {

    return API.del("User", `/User/${this.state.currentUserID}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deletUser();
      
      this.userHasAuthenticated(false);
      this.props.history.push("/login");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  renderSkills() {

    var order = [];


    this.state.userSkills.forEach(function (entry) {
      var newR = {
        skill: entry,
        present: true,
      };
      order.push(newR);
    });
    this.state.missingSkills.forEach(function (entry) {
      var newR = {
        skill: entry,
        present: false,
      };
      order.push(newR);
    });

    var values = [];
    for (var i = 0; i < order.length; i++) {
      if (order[i].present) {
        values.push(<div class="checkbox"><label><input type="checkbox" name="box" onClick={this.handleSkills} value={order[i].skill} checked key={i} />{order[i].skill}</label></div>);
      } else {
        values.push(<div class="checkbox"><label><input type="checkbox" name="box" onClick={this.handleSkills} value={order[i].skill} key={i} />{order[i].skill}</label></div>);
      }
    }
    return (<div>
      {values}
    </div>);

  }

  handleSkills = event => {
    var skillsChecked = [];
    var number = 0;
    var boxes = document.getElementsByName("box");
    for (var e = 0; e < boxes.length; e++) {
      if (boxes[e].checked == true) {
        skillsChecked.push(boxes[e].value);
      }
    }
    var missing = [...this.state.allSkills].filter(x => !skillsChecked.includes(x))
    this.setState({
      userSkills: skillsChecked,
      missingSkills: missing
    });
    this.render();
  };

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

  handleDepartmentChange = event => {
    var selects = document.getElementsByName("dep");

    var resultStat = "";
    for (var i = 0, eachOption = selects.length; i < eachOption; i++) {
      var opt = selects[i];
      if (opt.selected) {
        resultStat = opt.value;
      }
    }
    this.setState({
      userDepartment: resultStat
    });
  }

  renderStatus() {

    var values = [];

    values.push(<option value="Admin" selected name="stat" >Admin</option>);
    values.push(<option value="Project Manager" name="stat" >Project Manager</option>);
    values.push(<option value="Developer" name="stat" >Developer</option>);


    return (<FormControl componentClass="select" placeholder="select" onChange={this.handleStatusChange}>
      {values}
    </FormControl>);
  }
  renderDepatments(depart) {

    var values = [];

    var depts = this.state.allDepartments;
    for (var i = 0; i < depts.length; i++) {
      if (depts[i] === depart) {

        values.push(<option value={depts[i]} selected name="dep" >{depts[i]}</option>);
      }
      else {
        values.push(<option value={depts[i]} name="dep" >{depts[i]}</option>);
      }
    }


    return (<FormControl componentClass="select" placeholder="select" onChange={this.handleDepartmentChange}>
      {values}
    </FormControl>);
  }

  render() {
    return (
      <div className="MyProfile">
        {this.state.user &&
          <form onSubmit={this.handleSubmit}>
             <FormGroup controlId="titlePage">
             <h1><font size="6" ><b>MY PROFILE</b></font></h1>
              
            </FormGroup>
            <FormGroup controlId="userFirstName">
            <h1><font size="4" ><b>First Name:</b></font></h1>
              <FormControl
                onChange={this.handleChange}
                value={this.state.userFirstName}
                componentClass="textarea"
              />
            </FormGroup>

            <FormGroup controlId="userLastName">
            <h1><font size="4" ><b>Last Name:</b></font></h1>
              <FormControl
                onChange={this.handleChange}
                value={this.state.userLastName}
                componentClass="textarea"
              />
            </FormGroup>
            <FormGroup controlId="userDepartment">
            <h1><font size="4" ><b>Department:</b></font></h1>
              {this.renderDepatments(this.state.userDepartment)}
            </FormGroup>
            <FormGroup controlId="userDescription">
            <h1><font size="4" ><b>Description:</b></font></h1>
              <FormControl
                onChange={this.handleChange}
                value={this.state.userDescription}
                componentClass="textarea"
              />
            </FormGroup>
            <FormGroup controlId="userSkills">
            <h1><font size="4" ><b>Skills: </b></font></h1>
              <div className="skills">
                {this.renderSkills()}

              </div>
            </FormGroup>
            <FormGroup controlId="userEmail">
            <h1><font size="4" ><b>Email: </b><font size="3" >{this.state.userEmail} </font></font></h1>
            
            </FormGroup>
            <FormGroup controlId="userStatus">
            <h1><font size="4" ><b>Status: </b><font size="3" color="black">{this.state.userStatus} </font></font></h1>

              
              {(this.state.userStatus === "Admin" || this.state.oldState === "Admin") &&
                <form>
                  {this.renderStatus()}
                </form>}


            </FormGroup>
            {this.state.user && this.state.oldState === "Developer" &&
              <form>
                <div class="pstatus">
                  <div class="checkbox">
                    <label><input type="checkbox" name="boxst" value="Submit query to become a Project Manager" onClick={this.handleRequest} />Submit query to become a Project Manager</label>
                  </div>
                </div>
              </form>}

            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}