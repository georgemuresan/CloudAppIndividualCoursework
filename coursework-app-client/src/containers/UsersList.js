import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./UsersList.css";
import { API, Auth } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      User: [],
      isAdmin: false,
      currentUserID: "",
      currentUserStatus: "",
      usersPending: []
    };
  }
  async componentDidMount() {
    
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    const UserList = await this.users();

    await Auth.currentAuthenticatedUser()
        .then(user => this.state.currentUserID = user.username)
        .catch(err => alert(err));


      const user = await this.getUser();
      const usersRequested = this.retrieveUsersRequests(UserList);
      const { userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = user;
      this.setState({
        currentUserStatus: userStatus,
        User: UserList,
      //  usersPending: UserList,
        usersPending: usersRequested
      });

  } catch (e) {
    alert(e);
  }
  
  this.setState({ isLoading: false });
  
}

getUser() {
  return API.get("User", `/User/${this.state.currentUserID}`);
}

retrieveUsersRequests(users){
  var results = [];
  users.forEach(function (entry) {
    if (entry.userStatus == "Developer, pending to become a Project Manager"){
  // if (entry.userStatus == "Admin"){
      results.push(entry);
    }
  });
  return results;
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
        : <ListGroupItem>
        All the pending User requests to become a Project Manager.
       </ListGroupItem>
  );
  }

  renderUsersRequestsList(users) {
    return [{}].concat(users).map(
    (user, i) =>
      i !== 0
        ? <LinkContainer
            key={user.userID}
            to={`/User/Approval/${user.userID}`}
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
          {!this.state.isLoading && this.renderUsersList(this.state.User)}
        </ListGroup>
      </div>
    );
  }
  renderUserRequests() {
    return (
      <div className="userRequests">
        <PageHeader>Users Requests</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderUsersRequestsList(this.state.usersPending)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="UsersList">
        {this.props.isAuthenticated ? 
        <form>
          {this.state.currentUserStatus === "Admin" &&
          <form>
            {this.renderUserRequests()}
          </form> }
          {this.renderUsers()}
          </form>
          : this.renderLander()}
      </div>
    );
  }
}