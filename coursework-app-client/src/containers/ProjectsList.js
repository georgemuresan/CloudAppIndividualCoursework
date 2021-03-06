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
      MyProject: [],
      OtherProjects: [],
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
    const { userID, userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = user;
   
    const MyProject = await this.myProjects(Project, userID);

    const OtherProjects = await this.getMissingProjects(Project, MyProject);
    this.setState({
      currentUserStatus: userStatus,
      Project,
      MyProject,
      OtherProjects,
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
myProjects(projects, thisUserID) {
  var myprojects = [];
  for (var i=0; i<projects.length; i++){
    const { userID, projectID, projectStatus, projectName, projectDescription, attributes, collaborators, attachment, projectPendingCollaborators } = projects[i];
    for (var j=0; j<collaborators.length; j++){
      var collaborator = JSON.parse(collaborators[j]);
      const { userID, userEmail, userStatus, userFirstName, userLastName, userDepartment, userDescription, userSkills } = collaborator;
   
      if (userID === thisUserID){
        myprojects.push(projects[i]);
      }
    }
  }
  
  return myprojects;
}

getUser() {
  return API.get("User", `/User/${this.state.currentUserID}`);
}
getMissingProjects(allProjects, myProjects) {

  //Find values that are in allProjects but not in myProjects
  var uniqueResultOne = allProjects.filter(function (obj) {
    return !myProjects.some(function (obj2) {
      return obj.projectID == obj2.projectID;
    });
  });

  return uniqueResultOne;


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
              {"Status: " + project.projectStatus + "; " + "Created: " + new Date(project.createdAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
        : <ListGroupItem>
            {!(this.state.currentUserStatus === "Developer") &&
            <LinkContainer
            key="new"
            to="/Project/new"
          >
          
            <ListGroupItem>
            <font size="3">
                <b>{"\uFF0B"} Create a new project</b>
                </font>
                </ListGroupItem>
          </LinkContainer>
            }
            {(this.state.currentUserStatus === "Developer") &&
            <font size="3">
                <b>All the current Projects within the company.</b>
                </font>
            }
           
          </ListGroupItem>
  );
  }

  renderMyProjectsList(projects) {
    return [{}].concat(projects).map(
    (project, i) =>
      i !== 0
        ? <LinkContainer
            key={project.projectID}
            to={`/Project/specific/${project.userID}/id/${project.projectID}`}
          >
            <ListGroupItem header={project.projectName.trim().split("\n")[0]}>
              {"Status: " + project.projectStatus + "; " + "Created: " + new Date(project.createdAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
        : 
        <ListGroupItem>
        <font size="3">
        <b>All the Projects that I am/were involved in.</b>
      </font>
     </ListGroupItem>

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
           <h1><font size="6" ><b>OTHER PROJECTS</b></font></h1>
        <ListGroup>
          {!this.state.isLoading && this.renderProjectsList(this.state.OtherProjects)}
        </ListGroup>
      </div>
    );
  }

  renderMyProjects() {
    return (
      <div className="projects">
           <h1><font size="6" ><b>MY PROJECTS</b></font></h1>
        <ListGroup>
          {!this.state.isLoading && this.renderMyProjectsList(this.state.MyProject)}
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
            <ListGroupItem header={project.projectName.trim().split("\n")[0]}>
              {"Users want to join this project. Click to check who and approve/decline."}
            </ListGroupItem>
          </LinkContainer>
        :  <ListGroupItem>
        <font size="3">
        <b>All the pending User requests to become a collaborator to a Project.</b>
      </font>
     </ListGroupItem>
  );
  }

  renderProjectRequests() {
    return (
      <div className="projectRequests">
         <h1><font size="6" ><b>COLLABORATOR REQUESTS</b></font></h1>
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
          {this.renderMyProjects()}
          {this.renderProjects()}
          </form>
          : this.renderLander()}
      </div>
    );
  }
}