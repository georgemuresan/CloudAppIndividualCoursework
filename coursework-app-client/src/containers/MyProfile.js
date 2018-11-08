import React, { Component } from "react";
import { API, Auth} from "aws-amplify";
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
      userFirstName: "",
      userLastName: "",
      userDepartment: "",
      userSkills: [],
      currentUserID: ""
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentAuthenticatedUser()
      .then(user => this.state.currentUserID = user.username)
      .catch(err => alert(err));


      const user = await this.getUser();
      
      const { userFirstName, userLastName, userDepartment, userSkills } = user;
      this.setState({
        user,
        userFirstName,
        userLastName,
        userDepartment,
        userSkills
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
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }


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
      await Auth.signOut();

    this.userHasAuthenticated(false);
    this.props.history.push("/login");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="MyProfile">
        {this.state.user &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="userFirstName">
              <ControlLabel><font size="4" color="blue">First Name</font></ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.userFirstName}
                componentClass="textarea"
              />
            </FormGroup>

            <FormGroup controlId="userLastName">
              <ControlLabel><font size="4" color="blue">Last Name</font></ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.userLastName}
                componentClass="textarea"
              />
            </FormGroup>
            <FormGroup controlId="userDepartment">
              <ControlLabel><font size="4" color="blue">Department</font></ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.userDepartment}
                componentClass="textarea"
              />
            </FormGroup>

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