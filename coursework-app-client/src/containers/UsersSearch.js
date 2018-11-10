import React, { Component } from "react";
import { FormGroup, FormControl, PageHeader, ListGroup, ListGroupItem, ControlLabel } from "react-bootstrap";
import "./UsersSearch.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default class UsersSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allSkills: ["Java", "C++", "Assembly", "R", "Python", "PHP", "SQL", "Swing", "CSS", "HTML", "JSON", "CSV", "Team Leader", "JavaScript", "Pascal", "MatLab", "SolidWorks"],
      isLoading: true,
      User: [],
      searchName: localStorage['newSearch'],
      searchStatus: "",
      searchDepartment: "",
      searchSkills: [],
      searchedUsers: [],
      allDepartments: ["", "Engineering", "Computer Science", "Environmental Studies", "Electronics", "Maths and Sciences"]
      //asta e updatat prima data pt nume
    };
  }
  async componentDidMount() {

    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const User = await this.users();
      var ls = localStorage['newSearch'];
      var tempUser = [];
      if (ls !== "") {
        for (var i = 0; i < User.length; i++) {
          if (User[i].userFirstName === ls || User[i].userLastName === ls) {
            tempUser.push(User[i]);
          }
        }
      }
      localStorage.removeItem('newSearch');

      this.setState({
        User,
        searchedUsers: tempUser
      });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });

  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleAttributes = event => {
    var attr = [];
    var number = 0;
    var boxes = document.getElementsByName("box");
    for (var e = 0; e < boxes.length; e++) {
      if (boxes[e].checked == true) {
        attr.push(boxes[e].value);
      }
    }
    this.setState({
      searchSkills: attr
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // this.setState({ isLoading: true });

    try {

      var usersResults = [];
      var settingsFound = false;
      var keepLooking = true;


      if (this.state.searchName !== "" && typeof this.state.searchName != 'undefined') {
        settingsFound = true;
        for (var i = 0; i < this.state.User.length; i++) {
          if (this.state.User[i].userFirstName === this.state.searchName || this.state.User[i].userLastName === this.state.searchName) {
            usersResults.push(this.state.User[i]);
          }
        }
        if (usersResults.length === 0) {
          keepLooking = false;
        }
      }
      
      if (keepLooking) if (settingsFound) {
        if (this.state.searchStatus !== "") {
          var copy = [];
          for (var i = 0; i < usersResults.length; i++) {
            if (usersResults[i].userStatus === this.state.searchStatus) {
              copy.push(usersResults[i]);
            }
          }
          usersResults = copy;
          if (usersResults.length === 0) {
            keepLooking = false;
          }
        }
      } else if (!settingsFound) {
        
        if (this.state.searchStatus !== "") {
          settingsFound = true;
          for (var i = 0; i < this.state.User.length; i++) {
            if (this.state.User[i].userStatus === this.state.searchStatus) {
              usersResults.push(this.state.User[i]);
            }
          }
          if (usersResults.length === 0) {
            keepLooking = false;
          }
        }
      }

      if (keepLooking) if (settingsFound) {
        if (this.state.searchDepartment !== "") {
          var copy = [];
          for (var i = 0; i < usersResults.length; i++) {
            if (usersResults[i].userDepartment === this.state.searchDepartment) {
              copy.push(usersResults[i]);
            }
          }
          usersResults = copy;
          if (usersResults.length === 0) {
            keepLooking = false;
          }
        }
      } else if (!settingsFound) {
        if (this.state.searchDepartment !== "") {
          settingsFound = true;
          for (var i = 0; i < this.state.User.length; i++) {
            if (this.state.User[i].userDepartment === this.state.searchDepartment) {
              usersResults.push(this.state.User[i]);
            }
          }
          if (usersResults.length === 0) {
            keepLooking = false;
          }
        }
      }

      if (keepLooking) if (settingsFound) {
        if (this.state.searchSkills.length !== 0) {
          var copy = [];
          for (var i = 0; i < usersResults.length; i++) {
            var differenceinSklls = this.getMissingSkills(this.state.searchSkills, usersResults[i].userSkills);
            if (differenceinSklls.length === 0) {
              copy.push(usersResults[i]);
            }
          }
          usersResults = copy;
          if (usersResults.length === 0) {
            keepLooking = false;
          }
        }
      } else if (!settingsFound) {
        if (this.state.searchSkills.length !== 0) {
          settingsFound = true;
          for (var i = 0; i < this.state.User.length; i++) {
            var differenceinSklls = this.getMissingSkills(this.state.searchSkills, this.state.User[i].userSkills);
            if (differenceinSklls.length === 0) {
              usersResults.push(this.state.User[i]);
            }
          }
          if (usersResults.length === 0) {
            keepLooking = false;
          }
        }
      }

      this.setState({ searchedUsers: usersResults });
      this.render();

    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  getMissingSkills(userSkills, searchedSkills) {
    //Find values that are in userSkills but not in searchedSkills
    var uniqueResultOne = userSkills.filter(function (obj) {
      return !searchedSkills.some(function (obj2) {
        return obj === obj2;
      });
    });

    return uniqueResultOne;
  }
  users() {
    return API.get("User", "/User");
  }

  renderUsersList(users) {
    return [{}].concat(users).map(
      (user, i) =>
        i !== 0
          ? <LinkContainer
            key={user.userID}
            to={`/User/${user.userID}`}
          >
            <ListGroupItem header={user.userFirstName.trim().split("\n")[0] + " " + user.userLastName.trim().split("\n")[0]}>
              {"Status: " + user.userStatus + "; " + "Joined: " + new Date(user.joinedAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
          : <ListGroupItem>
            <font size="3">
            <b>Search results</b>
          </font>
        
         </ListGroupItem>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Not</h1>
        <p>Authenticated</p>
      </div>
    );
  }

  renderUsers() {
    return (
      <div className="users">
         <h1><font size="6" ><b>USER LIST</b></font></h1>
        <ListGroup>
          {!this.state.isLoading && this.renderUsersList(this.state.searchedUsers)}
        </ListGroup>
      </div>
    );
  }

  renderSkills() {

    var skillset = this.state.allSkills;
    var values = [];
    for (var i = 0; i < skillset.length; i++) {
      values.push(<div class="checkbox"><label><input type="checkbox" name="box" value={skillset[i]} onClick={this.handleAttributes} />{skillset[i]}</label></div>);
    }
    return (<div>
      {values}
    </div>);

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
      searchDepartment: resultStat
    });
  }
  renderDepartments() {

    var values = [];
    var depts = this.state.allDepartments;
    for (var i = 0; i < depts.length; i++) {
      if (depts[i] === this.state.searchDepartment) {
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
      searchStatus: resultStat
    });
  }

  renderStatus() {
    var values = [];

    if (this.state.searchStatus === "") {
      values.push(<option value="" selected name="stat" ></option>);
      values.push(<option value="Admin" name="stat" >Admin</option>);
      values.push(<option value="Project Manager" name="stat" >Project Manager</option>);
      values.push(<option value="Developer, pending to become a Project Manager" name="stat" >Developer, pending to become a Project Manager</option>);
      values.push(<option value="Developer" name="stat" >Developer</option>);
    } else if (this.state.searchStatus === "Admin") {
      values.push(<option value="" name="stat" ></option>);
      values.push(<option value="Admin" name="stat" selected >Admin</option>);
      values.push(<option value="Project Manager" name="stat" >Project Manager</option>);
      values.push(<option value="Developer, pending to become a Project Manager" name="stat" >Developer, pending to become a Project Manager</option>);
      values.push(<option value="Developer" name="stat" >Developer</option>);
    } else if (this.state.searchStatus === "Project Manager") {
      values.push(<option value="" name="stat" ></option>);
      values.push(<option value="Admin" name="stat" >Admin</option>);
      values.push(<option value="Project Manager" name="stat" selected >Project Manager</option>);
      values.push(<option value="Developer, pending to become a Project Manager" name="stat" >Developer, pending to become a Project Manager</option>);
      values.push(<option value="Developer" name="stat" >Developer</option>);
    } else if (this.state.searchStatus === "Developer, pending to become a Project Manager") {
      values.push(<option value="" name="stat" ></option>);
      values.push(<option value="Admin" name="stat" >Admin</option>);
      values.push(<option value="Project Manager" name="stat" >Project Manager</option>);
      values.push(<option value="Developer, pending to become a Project Manager" selected name="stat" >Developer, pending to become a Project Manager</option>);
      values.push(<option value="Developer" name="stat" >Developer</option>);
    } else if (this.state.searchStatus === "Developer") {
      values.push(<option value="" name="stat" ></option>);
      values.push(<option value="Admin" name="stat" >Admin</option>);
      values.push(<option value="Project Manager" name="stat" >Project Manager</option>);
      values.push(<option value="Developer, pending to become a Project Manager" name="stat" >Developer, pending to become a Project Manager</option>);
      values.push(<option value="Developer" selected name="stat" >Developer</option>);
    }


    return (<FormControl componentClass="select" placeholder="select" onChange={this.handleStatusChange}>
      {values}
    </FormControl>);
  }

  render() {
    return (
      <div className="UsersList">
        {this.props.isAuthenticated ?
          <form onSubmit={this.handleSubmit}>
            <ListGroup>
              <h1><font size="6" ><b>USER FILTERS</b></font></h1>
              <FormGroup controlId="searchName">
                <h3><font size="4" ><b>Name search - please input either First or Last name:</b></font></h3>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchName}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="searchStatus">
                <h3><font size="4" ><b>Status:</b></font></h3>
                {this.renderStatus()}
              </FormGroup>
              <FormGroup controlId="searchDepartment">
                <h3><font size="4" ><b>Department:</b></font></h3>
                {this.renderDepartments()}
              </FormGroup>
              <FormGroup controlId="skills">
                <h3><font size="4"><b>Skills:</b></font></h3>
                {this.renderSkills()}
              </FormGroup>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                type="submit"
                isLoading={this.state.isLoading}
                text="SEARCH"
                loadingText="Searching..."
              />
              {this.renderUsers()}
            </ListGroup>
          </form>
          : this.renderLander()}
      </div>
    );
  }
}