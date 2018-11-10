import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewProject.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default class NewProject extends Component {
	constructor(props) {
		super(props);

		this.file = null;

		this.state = {
			allSkills: ["Java", "C++", "Assembly", "R", "Python", "PHP", "SQL", "Swing", "CSS", "HTML", "JSON", "CSV", "Team Leader", "JavaScript", "Pascal", "MatLab", "SolidWorks"],
			isLoading: null,
			project: null,
			projectName: "",
			projectDescription: "",
			attributes: [],
			collaborators: [],
			projectStatus: "",
			projectPendingCollaborators: [],
			User: []
		};
	}


	async componentDidMount() {
		try {

			const us = await this.users();

			this.setState({ User: us });
		} catch (e) {
			alert(e);
		}
	}

	users() {
		return API.get("User", "/User");
	}

	validateForm() {
		return this.state.projectName.length > 0 && this.state.projectDescription.length > 0 && this.state.attributes.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	handleAttributes = event => {
		var attr = [];
		var number = 0;
		var boxes = document.getElementsByName("box");
		for (var e = 0; e < boxes.length; e++) {
			if (boxes[e].checked == true) {
				attr.push(boxes[e].value);
			}
		}
		this.setState({
			attributes: attr
		});
	};

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

	handleFileChange = event => {
		this.file = event.target.files[0];
	}

	handleSubmit = async event => {
		event.preventDefault();

		if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
			alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
			return;
		}

		this.setState({ isLoading: true });

		try {
			const attachment = this.file
				? await s3Upload(this.file)
				: null;

			await this.createProject({
				attachment,
				projectStatus: "Active",
				projectName: this.state.projectName,
				projectDescription: this.state.projectDescription,
				attributes: this.state.attributes,
				collaborators: this.state.collaborators,
				projectPendingCollaborators: this.state.projectPendingCollaborators
			});
			this.props.history.push("/");
		} catch (e) {
			alert(e);
			this.setState({ isLoading: false });
		}
	}

	createProject(project) {
		return API.post("Project", "/Project", {
			body: project
		});
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
		
		var values = [];
	
		
			  values.push(<option value="Pending" selected name="stat" >Pending</option>);
			  values.push(<option value="Active" name="stat" >Active</option>);
			  values.push(<option value="Completed" name="stat" >Completed</option>);
	
	
		return (<FormControl componentClass="select" placeholder="select" onChange={this.handleStatusChange}>
		  {values}
		</FormControl>);
	  }

	renderProjectAttributes() {

		var skillset = this.state.allSkills;
		var values = [];
		for (var i = 0; i < skillset.length; i++) {
			values.push(<div class="checkbox"><label><input type="checkbox" name="box" value={skillset[i]} onClick={this.handleAttributes} />{skillset[i]}</label></div>);
		}
		return (<div>
			{values}
		</div>);

	}
	renderProjectCollaborators() {

		var list = this.state.User;
		var values = [];
		for (var i = 0; i < list.length; i++) {
			const { userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = list[i];
			if (userStatus !== "Admin"){
			values.push(<option value={JSON.stringify(list[i])}>Name: {userFirstName} {userLastName} ; Status: {userStatus} ; Department: {userDepartment}</option>);
			}
		}
		return (<div class="form-group">
			<select multiple class="form-control" id="collabID" name="collaborators" onClick={this.handleCollaborators}>
				{values}
			</select>
		</div>);

	}

	render() {
		return (
			<div className="NewProject">
				<form onSubmit={this.handleSubmit}>
					<div class="pname">
						<FormGroup controlId="projectName">
							<ControlLabel><font size="4" color="blue">PROJECT NAME</font></ControlLabel>
							<FormControl
								onChange={this.handleChange}
								value={this.state.projectName}
								componentClass="textarea"
							/>
						</FormGroup>
					</div>
					<div class="pdesc">
						<FormGroup controlId="projectDescription">
							<ControlLabel><font size="4" color="blue">PROJECT DESCRIPTION</font></ControlLabel>
							<FormControl
								onChange={this.handleChange}
								value={this.state.projectDescription}
								componentClass="textarea"
							/>
						</FormGroup>
					</div>
					<div class="pabilities">
						<ControlLabel><font size="4" color="blue">PROJECT ATTRIBUTES</font></ControlLabel>
					</div>
					{this.renderProjectAttributes()}
					<FormGroup controlId="file">
						<ControlLabel><font size="4" color="blue">PROJECT ATTACHMENT</font></ControlLabel>
						<FormControl onChange={this.handleFileChange} type="file" />
					</FormGroup>
					<FormGroup controlId="collaborators">
						<ControlLabel><font size="4" color="blue">COLLABORATORS</font></ControlLabel>
						<div class="form-group">
							{this.renderProjectCollaborators()}
						</div>
					</FormGroup>
					<FormGroup controlId="status">
						<ControlLabel><font size="4" color="blue">STATUS:</font></ControlLabel>
						{this.renderStatus()}

					</FormGroup>
					<LoaderButton
						block
						bsStyle="primary"
						bsSize="large"
						disabled={!this.validateForm()}
						type="submit"
						isLoading={this.state.isLoading}
						text="PUBLISH"
						loadingText="Publishing..."
					/>
				</form>
			</div>
		);
	}

}