import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Projects.css";
import { s3Upload } from "../libs/awsLib";

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
      attachmentURL: null,
      User: [],
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const project = await this.getProject();
      const { projectStatus, projectName, projectDescription, attributes, collaborators, attachment } = project;

      const us = await this.users();
      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        project,
        projectStatus,
        projectName,
        projectDescription,
        attributes,
        collaborators,
        attachmentURL,
        User: us
      });
    } catch (e) {
      alert(e);
    }
  }



  users() {
    return API.get("User", "/User");
  }

  getProject() {
    return API.get("Project", `/Project/${this.props.match.params.id}`);
  }


  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  

  renderCollaborators() {
    return (
      <ul>
      {this.state.collaborators.map(function(name, index){
          return <li key={ index }>{JSON.parse(name).userFirstName} {JSON.parse(name).userLastName}, {JSON.parse(name).userDepartment}</li>;
        })}
     </ul>
       );

  }
  
  renderSkills() {

    return (
      <ul>
      {this.state.attributes.map(function(name, index){
          return <li key={ index }>{name}</li>;
        })}
     </ul>
       );
  }


  render() {
    return (
      <div className="Projects">
        {this.state.project &&
          <form onSubmit={this.handleSubmit}>
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
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isLoading}
              text="JOIN PROJECT"
              loadingText="Sending request..."
            />
          </form>}
      </div>
    );
  }
}