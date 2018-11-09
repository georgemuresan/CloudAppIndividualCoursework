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
      allSkills: ["Java", "C++", "Assembly", "bb", "Python", "php", "sql", "swing", "css", "html", "json", "csv"],
      missingSkills: []
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
      await Auth.signOut();

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

  //FOR SIMPLY LISTINg WITH BULLET POINTS
  //renderSkills() {
  //  return (
  //   <ul>
  //   {this.state.allSkills.map(function(name, index){
  //       return <li key={ index }>{name}</li>;
  //     })}
  //  </ul>
  //    );
  // }

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
            <FormGroup controlId="userDescription">
              <ControlLabel><font size="4" color="blue">Description</font></ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.userDescription}
                componentClass="textarea"
              />
            </FormGroup>
            <FormGroup controlId="userSkills">
              <ControlLabel><font size="4" color="blue">Skills: </font></ControlLabel>
              <div className="skills">
                {this.renderSkills()}

              </div>
            </FormGroup>
            <FormGroup controlId="userEmail">
              <ControlLabel><font size="4" color="blue">Email: </font></ControlLabel>
              <ControlLabel><font size="3" color="black">{this.state.userEmail} </font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="userStatus">
              <ControlLabel><font size="4" color="blue">Status: </font></ControlLabel>
              <ControlLabel><font size="3" color="black">{this.state.userStatus} </font></ControlLabel>
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