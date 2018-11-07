import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, MenuItem, DropdownButton } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect >
          <Navbar.Collapse>
            {this.state.isAuthenticated
              ? <Fragment>
                <Nav pullLeft>
                  <NavItem>
                    <nav class="navbar navbar-light bg-light">
                      <form class="form-inline">
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                      </form>
                    </nav>
                  </NavItem>
                  <NavItem>
                    <DropdownButton title="Search in..">
                      <MenuItem href="#books">Users</MenuItem>
                      <MenuItem href="#podcasts">Projects</MenuItem>
                    </DropdownButton>
                  </NavItem>
                  <NavItem href="/">About Us</NavItem>
                  <NavItem href="/userslist">Users</NavItem>
                  <NavItem href="/projectslist">Projects</NavItem>
                </Nav>
                <Nav pullRight>
                  <NavItem>
                    <DropdownButton title="Profile">
                      <MenuItem href="#books">My Profile</MenuItem>
                      <MenuItem href="#podcasts" onClick={this.handleLogout}>Logout</MenuItem>
                    </DropdownButton>
                  </NavItem>
                </Nav>
              </Fragment>
              : <Fragment>
                <Nav pullRight>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Nav>
              </Fragment>
            }

          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }

}

export default withRouter(App);