import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./AboutUs.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default class AboutUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      Project: []
    };
  }
  async componentDidMount() {
  if (!this.props.isAuthenticated) {
    return;
  }

  try {
    const Project = await this.projects();
    this.setState({ Project });
  } catch (e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

projects() {
  return API.get("Project", "/Project");
}

  renderProjectsList(projects) {
    return [{}].concat(projects).map(
    (project, i) =>
      i !== 0
        ? <LinkContainer
            key={project.projectID}
            to={`/Project/${project.projectID}`}
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

  render() {
    return (
      <div className="AboutUs">
        <div className="lander">
          <h1>Scratch</h1>
          <p>A simple note taking app</p>
        </div>
      </div>
    );
  }
}