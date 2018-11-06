import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Projects.css";
import { s3Upload } from "../libs/awsLib";

export default class Notes extends Component {
	bol: true
  constructor(props) {
    super(props);

    this.file = null;
	this.bol = true;
    this.state = {
  isLoading: null,
  isDeleting: null,
  project: null,
  projectName: "",
  projectDescription: "",
  attributes: [],
  collaborators: [],
  attachmentURL: null
};
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const project = await this.getProject();
      const { projectName, projectDescription, attributes, collaborators, attachment } = project;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        project,
        projectName,
		projectDescription,
		attributes,
		collaborators,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  fetchCollaborators(){
	  
  }
  getProject() {
    return API.get("Project", `/Project/${this.props.match.params.id}`);
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
  return API.put("Project", `/Project/${this.props.match.params.id}`, {
    body: project
  });
}

handleSubmit = async event => {
  let attachment;

  event.preventDefault();

  if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
    alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
    return;
  }

  this.setState({ isLoading: true });

  try {
    if (this.file) {
      attachment = await s3Upload(this.file);
    }

    await this.saveProject({
      projectName: this.state.projectName,
	  projectDescription: this.state.projectDescription,
	  attributes: this.state.attributes,
	  collaborators: this.state.collaborators,
      attachment: attachment || this.state.project.attachment,
	  
    });
    this.props.history.push("/");
  } catch (e) {
    alert(e);
    this.setState({ isLoading: false });
  }
}


deleteProject() {
  return API.del("Project", `/Project/${this.props.match.params.id}`);
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

render() {
  return (
    <div className="Projects">
      {this.state.project &&
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="projectName">
		    <ControlLabel><font size="4" color="blue">PROJECT NAME</font></ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.projectName}
              componentClass="textarea"
            />
          </FormGroup>
          
		  <FormGroup controlId="projectDescription">
				<ControlLabel><font size="4" color="blue">PROJECT DESCRIPTION</font></ControlLabel>
				<FormControl
					onChange={this.handleChange}
					value={this.state.projectDescription}
					componentClass="textarea"
				/>
		  </FormGroup>
				
			<ControlLabel><font size="4" color="blue">PROJECT ATTRIBUTES</font></ControlLabel>
						<div class="checkbox">
							<label><input type="checkbox" name="box" value="Java developer" onClick={this.handleAttributes}/>Java developer</label>
						</div>
						<div class="checkbox">
							<label><input type="checkbox" name="box" value="Database specialist" onClick={this.handleAttributes}/>Database specialist</label>
						</div>
						<div class="checkbox">
							<label><input type="checkbox" name="box" value="Security manager" onClick={this.handleAttributes}/>Security manager</label>
						</div>
						<div class="checkbox">
							<label><input type="checkbox" name="box" value="Design editor" onClick={this.handleAttributes}/>Design editor</label>
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
              <ControlLabel><font size="4" color="blue">PROJECT ATTACHMENT</font></ControlLabel>}
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          
		  <FormGroup controlId="collaborators">
				<ControlLabel><font size="4" color="blue">COLLABORATORS</font></ControlLabel>
				<div class="form-group">
					<select multiple class="form-control" id="collabID" name="collaborators" onClick={this.handleCollaborators}>
						<option selected={this.bol}>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</select>
				</div>
			</FormGroup>
			
			<FormGroup controlId="status">
				<ControlLabel><font size="4" color="blue">STATUS:</font><font size="3" color="red"><i> va trebui sa mai bag un atribut la project - statusul</i></font></ControlLabel>
				<FormControl
					onChange={this.handleChange}
					value={this.state.projectName}
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