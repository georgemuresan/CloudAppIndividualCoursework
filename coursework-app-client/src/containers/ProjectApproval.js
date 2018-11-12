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
    return API.get("User", `/User/chosen/${userID}`);
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
    var boxes = document.getElementsByName("box");

    var newCollaborators = this.state.collaborators;
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[0].checked == true) {
        var theId = boxes[0].value;
        var user = await this.getUser(theId);
        newCollaborators.push(JSON.stringify(user));
      }
    }
    this.setState({
      collaborators: newCollaborators,
      projectPendingCollaborators: [],
      isLoading: true
    });

    try {

      await this.saveProject({
        projectStatus: this.state.projectStatus,
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription,
        attributes: this.state.attributes,
        collaborators: newCollaborators,
        attachment: this.state.attachmentURL,
        projectPendingCollaborators: []
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }

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
              <font size="4">
                <b>Name:</b> {userFirstName + " " + userLastName}

              </font>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <FormGroup controlId="userDepartmentTitle">
                <h1><font size="3" ><b>Department: </b><font size="2" >{userDepartment}</font></font></h1>
              </FormGroup>
              <FormGroup controlId="userDescriptionTitle">
                <h1><font size="3" ><b>Description: </b></font></h1>
              </FormGroup>
              <FormGroup controlId="userDescription">
                <h1><font size="2"><font size="2" >{userDescription}</font></font></h1>
              </FormGroup>
              <FormGroup controlId="userSkillstitle">
                <h1><font size="3" ><b>Skills: </b></font></h1>
              </FormGroup>
              <FormGroup controlId="userSkills">
                {this.renderUserSkills(userSkills)}
              </FormGroup>
              <FormGroup controlId="userEmailTitle">
                <h1><font size="3" ><b>Email: </b><font size="2" >{userEmail}</font></font></h1>
              </FormGroup>
              <FormGroup controlId="userStatusTitle">
                <h1><font size="3" ><b>User status: </b><font size="2" >{userStatus}</font></font></h1>
              </FormGroup>
              <FormGroup controlId="userStatusTitle">
                <label><input type="checkbox" name="box" value={entry} /><font size="3" ><b>Check if you approve the request.</b></font></label>
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
              <h1><font size="6" ><b>USER REQUEST TO JOIN PROJECT</b></font></h1>
            </FormGroup>

            {this.renderUSerPanels(this.state.User)}

            <h1><font size="6" ><b>PROJECT DETAILS</b></font></h1>
            <h1><font size="4" ><b>Name: </b><font size="3" color="black">{this.state.projectName}</font></font></h1>

            <FormGroup controlId="projectDescriptiontitle">
              <h1><font size="4" ><b>Description:</b></font></h1>
            </FormGroup>
            <FormGroup controlId="projectDescription">
              <h1><font size="3" >{this.state.projectDescription}</font></h1>
            </FormGroup>

            <FormGroup controlId="projectSkillsTitle">
              <h1><font size="4" ><b>Desired Skills:</b></font></h1>
            </FormGroup>
            <div className="skills">
              {this.renderSkills()}
            </div>
            {this.state.project.attachment &&
              <FormGroup>
                <h1><font size="4" ><b>Attachment: </b></font></h1>
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
              <h1><font size="4" ><b>Status:</b> <font size="3" color="black">{this.state.projectStatus}</font></font></h1>
            </FormGroup>

            <FormGroup controlId="projectCollaboratorsTitle">
              <h1><font size="4" ><b>Collaborators:</b></font></h1>
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