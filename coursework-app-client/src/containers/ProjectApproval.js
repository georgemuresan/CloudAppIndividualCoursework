import React, { Component } from "react";
import { API, Storage, Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Panel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./ProjectApproval.css";
import { s3Upload } from "../libs/awsLib";

export default class ProjectApproval extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.state = {
      isLoading: null,
      isDeleting: null,
      project: null,
      projectStatus: "",
      projectName: "",
      projectDescription: "",
      attributes: [],
      collaborators: [],
      attachmentURL: null,
      projectPendingCollaborators: [],
      User: [],
      currentUserID: ""
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const project = await this.getProject();
      const { projectStatus, projectName, projectDescription, attributes, collaborators, attachment, projectPendingCollaborators
      } = project;

      const us = await this.users();
      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      await Auth.currentAuthenticatedUser()
        .then(user => this.state.currentUserID = user.username)
        .catch(err => alert(err));



      this.setState({
        project,
        projectStatus,
        projectName,
        projectDescription,
        attributes,
        collaborators,
        attachmentURL,
        projectPendingCollaborators,
        User: us
      });
    } catch (e) {
      alert(e);
    }
  }

  users() {
    return API.get("User", "/User");
  }

  getUser(userID) {
    return API.get("User", `/User/${userID}`);
  }
  getProject() {
    return API.get("Project", `/Project/specific/${this.props.match.params.uid}/id/${this.props.match.params.id}`);
  }


  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }


  renderCollaborators() {
    return (
      <ul>
        {this.state.collaborators.map(function (name, index) {
          return <li key={index}>{JSON.parse(name).userFirstName} {JSON.parse(name).userLastName}, {JSON.parse(name).userDepartment}</li>;
        })}
      </ul>
    );

  }

  renderSkills() {

    return (
      <ul>
        {this.state.attributes.map(function (name, index) {
          return <li key={index}>{name}</li>;
        })}
      </ul>
    );
  }




  saveProject(project) {
    return API.put("Project", `/Project/specific/${this.props.match.params.uid}/id/${this.props.match.params.id}`, {
      body: project
    });
  }

  handleSubmitDecsion = async event => {
    event.preventDefault();
    //ideea e simpla: un for loop printre toate checkboxurile.Daca e checked,, atunci ia checkbox.value (currentID), apoi cauta userul cu id-ul ala, il stocheaza intr-o variabila, il stringify si il baga ca si colaborator la proiectul curent. La sfarsit da stergere la pendingcollaborators  si da save la project.
/*
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
    */
  }


  renderUserSkills(userSkills) {

    var result = [];
    for (var i = 0; i < userSkills.length; i++) {
      result.push(<li key={i}>{userSkills[i]}</li>);
    }
    return (
      <ul>
        {result}
      </ul>
    );
  }

  renderUSerPanels(users) {
    var order = [];
    alert(this.state.projectPendingCollaborators.length);
    for (var i = 0; i < this.state.projectPendingCollaborators.length; i++) {
      var entry = this.state.projectPendingCollaborators[i];

      var user;
      users.forEach(function (entry2) {
        const { userID, userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = entry2;
        if (userID === entry) {
          user = entry2;
        }
      });
      const { userID, userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = user;

      
      order.push(
        <Panel id="collapsible-panel-example-2" defaultExpanded>
          <Panel.Heading>
            <Panel.Title toggle>
              {"Name: " + userFirstName + " " + userLastName}
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <FormGroup controlId="userDepartmentTitle">
                <ControlLabel><font size="3" color="black">Department: {userDepartment}</font></ControlLabel>
              </FormGroup>
              <FormGroup controlId="userDescriptionTitle">
                <ControlLabel><font size="3" color="black">Description: </font></ControlLabel>
              </FormGroup>
              <FormGroup controlId="userDescription">
                <ControlLabel><font size="2" color="black">{userDescription}</font></ControlLabel>
              </FormGroup>
              <FormGroup controlId="userSkillstitle">
                <ControlLabel><font size="3" color="black">Skills: </font></ControlLabel>
              </FormGroup>
              <FormGroup controlId="userSkills">
                {this.renderUserSkills(userSkills)}
              </FormGroup>
              <FormGroup controlId="userEmailTitle">
                <ControlLabel><font size="3" color="black">Email: {userEmail}</font></ControlLabel>
              </FormGroup>
              <FormGroup controlId="userStatusTitle">
                <ControlLabel><font size="3" color="black">User status: {userStatus}</font></ControlLabel>
              </FormGroup>
              <FormGroup controlId="userStatusTitle">
              <label><input type="checkbox" name="box" value={entry} />Check if you approve the request.</label>
              </FormGroup>
              
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      );
    };

    return (<div>
      {order}
    </div>);

  }
  render() {
    return (
      <div className="Projects">
        {this.state.project &&
          <form >
            <FormGroup controlId="titlePage">
              <ControlLabel><font size="4" color="blue">USER REQUEST TO JOIN PROJECT</font></ControlLabel>
            </FormGroup>

            {this.renderUSerPanels(this.state.User)}



            <FormGroup controlId="projectNameTitle">
              <ControlLabel><font size="4" color="blue">PROJECT NAME</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="projectName">
              <ControlLabel><font size="3" color="black">{this.state.projectName}</font></ControlLabel>
            </FormGroup>

            <FormGroup controlId="projectDescriptiontitle">
              <ControlLabel><font size="4" color="blue">PROJECT DESCRIPTION</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="projectDescription">
              <ControlLabel><font size="3" color="black">{this.state.projectDescription}</font></ControlLabel>
            </FormGroup>

            <FormGroup controlId="projectSkillsTitle">
              <ControlLabel><font size="4" color="blue">DESIRED SKILLS</font></ControlLabel>
            </FormGroup>
            <div className="skills">
              {this.renderSkills()}
            </div>
            {this.state.project.attachment &&
              <FormGroup>
                <ControlLabel><font size="4" color="blue">ATTACHMENT</font></ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.project.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}

            <FormGroup controlId="projectStatusTitle">
              <ControlLabel><font size="4" color="blue">PROJECT STATUS</font></ControlLabel>
            </FormGroup>
            <FormGroup controlId="projectStatus">
              <ControlLabel><font size="3" color="black">{this.state.projectStatus}</font></ControlLabel>
            </FormGroup>

            <FormGroup controlId="projectCollaboratorsTitle">
              <ControlLabel><font size="4" color="blue">COLLABORATORS</font></ControlLabel>
            </FormGroup>
            <div className="collabs">
              {this.renderCollaborators()}
            </div>

            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              isLoading={this.state.isLoading}
              onClick={this.handleSubmitDecsion}
              text="SUBMIT DECISION"
              loadingText="Submitting..."
            />
          </form>}
      </div>
    );
  }
}