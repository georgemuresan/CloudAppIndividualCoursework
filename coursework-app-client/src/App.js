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
      isAuthenticating: true,
      newSearch: "",
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

  updateInput(key, value) {
    // update react state
    this.setState({ [key]: value });

    // update localStorage
    localStorage.setItem(key, value);
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
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"  onChange={e => this.updateInput("newSearch", e.target.value)} />
                      </form>
                    </nav>
                  </NavItem>
                  <NavItem>     
                    <DropdownButton title="Search in..">
                      <MenuItem >
                        <LinkContainer to="/userssearch">
                          <NavItem>Users</NavItem>
                        </LinkContainer>
                      </MenuItem>
                      <MenuItem >
                        <LinkContainer to="/projectssearch">
                          <NavItem>Projects</NavItem>
                        </LinkContainer>
                      </MenuItem>
                    </DropdownButton>
                  </NavItem>
                  <NavItem href="/">About Us</NavItem>
                  <NavItem href="/userslist">Users</NavItem>
                  <NavItem href="/projectslist">Projects</NavItem>
                </Nav>
                <Nav pullRight>
                  <NavItem>
                    <DropdownButton title="Profile">
                      <MenuItem >
                        <LinkContainer to="/myprofile">
                          <NavItem>My Profile</NavItem>
                        </LinkContainer>
                      </MenuItem>
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