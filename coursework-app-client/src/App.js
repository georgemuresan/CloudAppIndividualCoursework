import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, MenuItem, DropdownButton } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { Auth, API } from "aws-amplify";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      newSearch: "",
      currentUserID: "",
      userStatus: "",
      userFirstName: "",
      userLastName: ""
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);

      await Auth.currentAuthenticatedUser()
        .then(user => this.state.currentUserID = user.username)
        .catch(err => alert(err));


      const user = await this.getUser();

      const { userStatus, userFirstName, userLastName } = user;
      this.setState({
        userStatus,
        userFirstName,
        userLastName
      });


    }
    catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }
  getUser() {
    //alert(this.state.currentUserID);
    return API.get("User", `/User/${this.state.currentUserID}`);
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
        <Navbar inverse collapseOnSelect >
          <Navbar.Collapse>
            {this.state.isAuthenticated
              ? <Fragment>
                <Nav pullLeft>
                  <NavItem>
                    <nav class="navbar navbar-light bg-light">
                      <form class="form-inline">

                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={e => this.updateInput("newSearch", e.target.value)} />
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
                  <NavItem href="/"><font size="5" color="white">About Us</font></NavItem>
                  <NavItem href="/userslist"><font size="5" color="white">Users</font></NavItem>
                  <NavItem href="/projectslist"><font size="5" color="white">Projects</font></NavItem>
                </Nav>
                <Nav pullRight>
                  <NavItem>
                    <b>
                    <font size="4">
                    {this.state.userFirstName + " " + this.state.userLastName}
                    </font>
                    </b>
                    
                    <br />
                    <font size="2"><i>
                    {this.state.userStatus}
                    </i>
                    </font>
                  </NavItem>
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
                  <NavItem></NavItem>
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