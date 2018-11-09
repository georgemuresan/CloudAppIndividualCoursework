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
      allSkills: ["Java", "C++", "Assembly", "bb", "Python", "php", "sql", "swing", "css", "html", "json", "csv"],
      isLoading: true,
      User: [],
      searchName: localStorage['newSearch'],
      searchStatus: "",
      searchDepartment: "",
      searchSkills: [],
      searchedUsers: []
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

      this.setState({ User,
        searchedUsers: tempUser });
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

      if (this.state.searchName !== "") {
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
            var differenceinSklls = this.getMissingSkills(usersResults[i].userSkills, this.state.searchSkills);
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
            var differenceinSklls = this.getMissingSkills(this.state.User[i].userSkills, this.state.searchSkills);
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
            <ListGroupItem header={user.userFirstName.trim().split("\n")[0]}>
              {"Joined: " + new Date(user.joinedAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
          : <LinkContainer
            key=""
            to=""
          >
            <ListGroupItem>
            </ListGroupItem>
          </LinkContainer>
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
        <PageHeader>Users List</PageHeader>
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

  render() {
    return (
      <div className="UsersList">
        {this.props.isAuthenticated ?
          <form onSubmit={this.handleSubmit}>
            <ListGroup>
              <ControlLabel><font size="6" color="blue">FILTERS</font></ControlLabel>
              <FormGroup controlId="searchName">
                <ControlLabel><font size="4" color="blue">Name search - please input either First or Last name.</font></ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchName}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="searchStatus">
                <ControlLabel><font size="4" color="blue">Status - Developer or Project Manager</font></ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchStatus}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="searchDepartment">
                <ControlLabel><font size="4" color="blue">Department</font></ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchDepartment}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="skills">
                <ControlLabel><font size="4" color="blue">Skills</font></ControlLabel>
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