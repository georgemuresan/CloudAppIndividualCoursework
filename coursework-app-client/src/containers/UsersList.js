import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./UsersList.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      User: []
    };
  }
  async componentDidMount() {
    
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    const User = await this.users();
    this.setState({ User });
  } catch (e) {
    alert(e);
  }
  
  this.setState({ isLoading: false });
  
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
          {!this.state.isLoading && this.renderUsersList(this.state.User)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="UsersList">
        {this.props.isAuthenticated ? this.renderUsers() : this.renderLander()}
      </div>
    );
  }
}