import React, { Component } from "react";
import { API, Storage, Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./ProjectView.css";
import { s3Upload } from "../libs/awsLib";
import { AlexaForBusiness } from "aws-sdk/clients/all";

export default class Projects extends Component {
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
      includesCurrentUser: false,
      attachmentURL: null,
      projectPendingCollaborators: [],
      currentUserID: "",
      isCompleted: false,
      isPending: false
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const project = await this.getProject();
      const { projectStatus, projectName, projectDescription, attributes, collaborators, attachment, projectPendingCollaborators
      } = project;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      await Auth.currentAuthenticatedUser()
        .then(user => this.state.currentUserID = this.props.match.params.uid)
        .catch(err => alert(err));


        var checkCompleted;
        if (projectStatus === "Completed"){
          checkCompleted = true;
        }
        var checkPending;
        if (projectStatus === "Pending"){
          checkPending = true;
        }
      const partOfTheProject = this.checkIfIncludesHim(this.state.currentUserID, collaborators);
      this.setState({
        project,
        projectStatus,
        projectName,
        projectDescription,
        attributes,
        collaborators,
        attachmentURL,
        projectPendingCollaborators,
        includesCurrentUser: partOfTheProject,
        isCompleted: checkCompleted,
        isPending: checkPending
      });
    } catch (e) {
      alert(e);
    }
  }

  checkIfIncludesHim(id, collaborators) {
    
    var found = false;
    collaborators.forEach(function (entry) {
      
      if (JSON.parse(entry).userID === id) {
        found = true;
      }
    });
    return found;
  }
  checkIfPending(number) {
    var found = false;
    this.state.projectPendingCollaborators.forEach(function (entry) {
      
      if (entry === number) {
        found = true;
      }
    });
    return found;
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

  

  handleGoToEdit = async event => {

    event.preventDefault();

    this.setState({ isLoading: true });

    try {

     
      this.props.history.push(`/Project/edit/${this.props.match.params.uid}/id/${this.props.match.params.id}`);
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  saveProject(project) {
    return API.put("Project", `/Project/specific/${this.props.match.params.uid}/id/${this.props.match.params.id}`, {
      body: project
    });
  }

  handleJoin = async event => {

    event.preventDefault();

    

    try {

      var pending = this.state.projectPendingCollaborators;
      pending.push(this.state.currentUserID);

      this.setState({ isLoading: true,
        projectPendingCollaborators: pending,
        includesCurrentUser : true
        });

        await this.saveProject({
          projectStatus: this.state.projectStatus,
          projectName: this.state.projectName,
          projectDescription: this.state.projectDescription,
          attributes: this.state.attributes,
          collaborators: this.state.collaborators,
          projectPendingCollaborators: pending,
        });
        this.setState({ isLoading: false });
      this.props.history.push(`/Project/specific/${this.props.match.params.uid}/id/${this.props.match.params.id}`);
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }


  render() {
    return (
      <div className="Projects">
        {this.state.project &&
          <form >
            <FormGroup controlId="projectNameTitle">
            <h1><font size="6" ><b>PROJECT VIEW</b></font></h1>
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


            {!this.state.includesCurrentUser && !this.checkIfPending(this.state.currentUserID) && !this.state.isCompleted && !this.state.isPending &&

              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                isLoading={this.state.isLoading}
                onClick={this.handleJoin}
                text="JOIN PROJECT"
                loadingText="Sending request..."
              />
            }
             {!this.state.isCompleted && 
             <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                isLoading={this.state.isLoading}
                onClick={this.handleGoToEdit}
                text="EDIT PROJECT"
                loadingText="Processing"
              />
             }
          </form>}
      </div>
    );
  }
}