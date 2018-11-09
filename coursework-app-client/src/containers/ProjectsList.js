import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./ProjectsList.css";
import { API, Auth } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default class ProjectsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      Project: [],
      isPM: false,
      currentUserID: "",
      currentCollaborators: [],
      allProjectsWithRequests: [],
      currentUserStatus: ""
    };
  }
  async componentDidMount() {
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    const Project = await this.projects();

    await Auth.currentAuthenticatedUser()
    .then(user => this.state.currentUserID = user.username)
    .catch(err => alert(err));

    const user = await this.getUser();
    const projectsWithRequests = this.retrieveProjectsWithRequests(Project);
    const { userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = user;
    this.setState({
      currentUserStatus: userStatus,
      Project,
      allProjectsWithRequests : projectsWithRequests
    });

  } catch (e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

retrieveProjectsWithRequests(projects){
  var results = [];
  projects.forEach(function (entry) {
    if (entry.projectPendingCollaborators.length !== 0){
      results.push(entry);
    }
  });
  return results;
}

projects() {
  return API.get("Project", "/Project");
}

getUser() {
  return API.get("User", `/User/${this.state.currentUserID}`);
}

  renderProjectsList(projects) {
    return [{}].concat(projects).map(
    (project, i) =>
      i !== 0
        ? <LinkContainer
            key={project.projectID}
            to={`/Project/specific/${project.userID}/id/${project.projectID}`}
          >
            <ListGroupItem header={project.projectName.trim().split("\n")[0]}>
              {"Created: " + new Date(project.createdAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
        : <LinkContainer
            key="new"
            to="/Project/new"
          >
            <ListGroupItem>
              <h4>
                <b>{"\uFF0B"}</b> Create a new project
              </h4>
            </ListGroupItem>
          </LinkContainer>
  );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  renderProjects() {
    return (
      <div className="projects">
        <PageHeader>Projects List</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderProjectsList(this.state.Project)}
        </ListGroup>
      </div>
    );
  }

  renderProjectRequestsList(projects) {
    return [{}].concat(projects).map(
    (project, i) =>
      i !== 0
        ? <LinkContainer
            key={project.projectID}
            to={`/Project/Approval/${project.userID}/id/${project.projectID}`}
          >
            <ListGroupItem header={"Project: " + project.projectName.trim().split("\n")[0]}>
              {"Users want to join this project. Click to check who and approve/decline."}
            </ListGroupItem>
          </LinkContainer>
        : <LinkContainer
        key=""
        to=""
      >
        <ListGroupItem>
         
        </ListGroupItem>
      </LinkContainer>
  );
  }

  renderProjectRequests() {
    return (
      <div className="projectRequests">
        <PageHeader>Collaborators requests</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderProjectRequestsList(this.state.allProjectsWithRequests)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="ProjectsList">
        {this.props.isAuthenticated ? 
          <form>
          {this.state.currentUserStatus === "Project Manager" &&
          <form>
            {this.renderProjectRequests()}
          </form> }
          {this.renderProjects()}
          </form>
          : this.renderLander()}
      </div>
    );
  }
}