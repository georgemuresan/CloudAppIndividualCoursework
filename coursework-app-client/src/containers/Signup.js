import React, { Component } from "react";
import { HelpBlock, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Auth, API } from "aws-amplify";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      userFirstName: "",
      userLastName: "",
      userDepartment: "",
      userSkills: [],
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.userFirstName.length > 0 &&
      this.state.userLastName.length > 0 &&
      this.state.userDepartment.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({
        newUser
      });

    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });
  }


  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
      await this.createUser({
        userFirstName: this.state.userFirstName,
        userLastName: this.state.userLastName,
        userDepartment: this.state.userDepartment,
        userSkills: ["bb"]
      });

      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  createUser(user) {
      return API.post("User", "/User", {
        body: user
      });
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="userFirstName" bsSize="large">
          <ControlLabel>First Name</ControlLabel>
          <FormControl
            autoFocus
            type="userFirstName"
            value={this.state.userFirstName}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="userLastName" bsSize="large">
          <ControlLabel>Last Name</ControlLabel>
          <FormControl
            autoFocus
            type="userLastName"
            value={this.state.userLastName}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="userDepartment" bsSize="large">
          <ControlLabel>Department</ControlLabel>
          <FormControl
            autoFocus
            type="userDepartment"
            value={this.state.userDepartment}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}