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
      allSkills: ["Java", "C++", "Assembly", "R", "Python", "PHP", "SQL", "Swing", "CSS", "HTML", "JSON", "CSV", "Team Leader", "JavaScript", "Pascal", "MatLab", "SolidWorks"],
      missingSkills: [],
      isLoading: null,
      isDeleting: null,
      project: null,
      projectStatus: "",
      projectName: "",
      projectDescription: "",
      attributes: [],
      collaborators: [],
      oldCollaborators: [],
      attachmentURL: null,
      User: [],
      missingUsers: [],
      projectPendingCollaborators: []
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const project = await this.getProject();
      const { projectStatus, projectName, projectDescription, attributes, collaborators, attachment, projectPendingCollaborators } = project;

      const us = await this.users();
      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      const missin = await this.getMissingUsers(us, collaborators);
      this.setState({
        project,
        projectStatus,
        projectName,
        projectDescription,
        attributes,
        collaborators,
        oldCollaborators: collaborators,
        attachmentURL,
        projectPendingCollaborators,
        missingSkills: [...this.state.allSkills].filter(x => !attributes.includes(x)),
        missingUsers: missin,
        User: us
      });
    } catch (e) {
      alert(e);
    }
  }

  getMissingUsers(allusers, collbusers) {


    //Find values that are in allusers but not in collbusers
    var uniqueResultOne = allusers.filter(function (obj) {
      return !collbusers.some(function (obj2) {
        return obj.userID == JSON.parse(obj2).userID;
      });
    });

    return uniqueResultOne;


  }

  users() {
    return API.get("User", "/User");
  }

  getProject() {
    return API.get("Project", `/Project/specific/${this.props.match.params.uid}/id/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.projectName.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  saveProject(project) {
    return API.put("Project", `/Project/specific/${this.props.match.params.uid}/id/${this.props.match.params.id}`, {
      body: project
    });
  }

  handleSubmit = async event => {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      await this.saveProject({
        projectStatus: this.state.projectStatus,
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription,
        attributes: this.state.attributes,
        collaborators: this.state.collaborators,
        attachment: attachment || this.state.project.attachment,
        projectPendingCollaborators : this.state.projectPendingCollaborators
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }


  deleteProject() {
    return API.del("Project", `/Project/specific/${this.props.match.params.uid}/id/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteProject();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  handleCollaborators = event => {
    var collabs = document.getElementsByName("collaborators");
    var multiselect = collabs[0];
    var resultCollabs = [];
    for (var i = 0, eachOption = multiselect.length; i < eachOption; i++) {
      var opt = multiselect[i];
      if (opt.selected) {
        resultCollabs.push(opt.value);
      }
    }
    this.setState({
      collaborators: resultCollabs
    });
  }

  renderCollaborators() {
    var order = [];


    this.state.oldCollaborators.forEach(function (entry) {
      var newR = {
        user: JSON.parse(entry),
        present: true,
      };
      order.push(newR);
    });
    this.state.missingUsers.forEach(function (entry) {
      var newR = {
        user: entry,
        present: false,
      };
      order.push(newR);
    });

    var values = [];
    for (var i = 0; i < order.length; i++) {
      var usrSet = order[i];
      //alert(order[0].user.userID);
      const { userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = usrSet.user;
      if (usrSet.present) {
        values.push(<option selected={true} value={JSON.stringify(usrSet.user)}>Name: {userFirstName} {userLastName} ; Status: {userStatus} ; Department: {userDepartment}</option>);
      } else {
        if (userStatus !== "Admin"){
        values.push(<option value={JSON.stringify(usrSet.user)}>Name: {userFirstName} {userLastName} ; Status: {userStatus} ; Department: {userDepartment}</option>);
        }
      }
    }
    return (<div class="form-group">
      <select multiple class="form-control" id="collabID" name="collaborators" onClick={this.handleCollaborators}>
        {values}
      </select>
    </div>);

  }
  renderSkills() {

    var order = [];


    this.state.attributes.forEach(function (entry) {
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
        values.push(<div class="checkbox"><label><input type="checkbox" name="box" value={order[i].skill} checked key={i} />{order[i].skill}</label></div>);
      } else {
        values.push(<div class="checkbox"><label><input type="checkbox" name="box" value={order[i].skill} key={i} />{order[i].skill}</label></div>);
      }
    }
    return (<div>
      {values}
    </div>);

  }

  handleStatusChange = event => {
    var selects = document.getElementsByName("stat");

    var resultStat = "";
    for (var i = 0, eachOption = selects.length; i < eachOption; i++) {
      var opt = selects[i];
      if (opt.selected) {
        resultStat = opt.value;
      }
    }
    this.setState({
      projectStatus: resultStat
    });
  }

  renderStatus() {
    var currentProjStatus = this.state.projectStatus;


    var values = [];

    if (currentProjStatus === "Active") {
      values.push(<option value="Pending" name="stat" >Pending</option>);
      values.push(<option value="Active" selected name="stat" >Active</option>);
      values.push(<option value="Completed" name="stat" >Completed</option>);
    } else
      if (currentProjStatus === "Completed") {
        values.push(<option value="Pending" name="stat" >Pending</option>);
        values.push(<option value="Active" name="stat" >Active</option>);
        values.push(<option value="Completed" selected name="stat" >Completed</option>);
      } else
        if (currentProjStatus === "Pending") {

          values.push(<option value="Pending" selected name="stat" >Pending</option>);
          values.push(<option value="Active" name="stat" >Active</option>);
          values.push(<option value="Completed" name="stat" >Completed</option>);
        }


    return (<FormControl componentClass="select" placeholder="select" onChange={this.handleStatusChange}>
      {values}
    </FormControl>);
  }

  render() {
    return (
      <div className="Projects">
        {this.state.project &&
          <form >
            <FormGroup controlId="projectName">
            <h1><font size="6" ><b>PROJECT EDIT</b></font></h1>
            <h1><font size="4" ><b>Name:</b></font></h1>
              <FormControl
                onChange={this.handleChange}
                value={this.state.projectName}
                componentClass="textarea"
              />
            </FormGroup>

            <FormGroup controlId="projectDescription">
            <h1><font size="4" ><b>Description:</b></font></h1>
              <FormControl
                onChange={this.handleChange}
                value={this.state.projectDescription}
                componentClass="textarea"
              />
            </FormGroup>

           <h1><font size="4" ><b>Desired Skills:</b></font></h1>
            <div className="skills">
              {this.renderSkills()}

            </div>
            {this.state.project.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
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

            <FormGroup controlId="file">
              {!this.state.project.attachment &&
                 <h1><font size="4" ><b>Attachment:</b></font></h1>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>

            <FormGroup controlId="collaborators">
               <h1><font size="4" ><b>Collaborators:</b></font></h1>
              <div class="form-group">
                {this.renderCollaborators()}

              </div>
            </FormGroup>

            <FormGroup controlId="status">
              <h1><font size="4">Status:</font></h1>

              {this.renderStatus()}

            </FormGroup>

            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              onClick={this.handleSubmit}
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