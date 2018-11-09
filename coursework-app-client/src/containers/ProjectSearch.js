import React, { Component } from "react";
import { FormGroup, FormControl, PageHeader, ListGroup, ListGroupItem, ControlLabel } from "react-bootstrap";
import "./ProjectSearch.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default class ProjectSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allSkills: ["Java", "C++", "Assembly", "bb", "Python", "php", "sql", "swing", "css", "html", "json", "csv"],
      isLoading: true,
      Project: [],
      searchName: localStorage['newSearch'],
      searchStatus: "",
      searchDescription: "",
      searchSkills: [],
      searchedProjects: []
      //asta e updatat prima data pt nume
    };
  }
  async componentDidMount() {

    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const Project = await this.projects();
      var ls = localStorage['newSearch'];
      var tempProject = [];
      if (ls !== "") {
        for (var i = 0; i < Project.length; i++) {
          if (Project[i].projectName === ls) {
            tempProject.push(Project[i]);
          }
        }
      }
      localStorage.removeItem('newSearch');

      this.setState({ Project,
        searchedProjects: tempProject });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });

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
      searchSkills: attr
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // this.setState({ isLoading: true });

    try {

      var projectResults = [];
      var settingsFound = false;
      var keepLooking = true;

      if (this.state.searchName !== "") {
        settingsFound = true;
        for (var i = 0; i < this.state.Project.length; i++) {
          if (this.state.Project[i].projectName === this.state.searchName) {
            projectResults.push(this.state.Project[i]);
          }
        }
        if (projectResults.length === 0) {
          keepLooking = false;
        }
      }
      if (keepLooking) if (settingsFound) {
        if (this.state.searchStatus !== "") {
          var copy = [];
          for (var i = 0; i < projectResults.length; i++) {
            if (projectResults[i].projectStatus === this.state.searchStatus) {
              copy.push(projectResults[i]);
            }
          }
          projectResults = copy;
          if (projectResults.length === 0) {
            keepLooking = false;
          }
        }
      } else if (!settingsFound) {
        if (this.state.searchStatus !== "") {
          settingsFound = true;
          for (var i = 0; i < this.state.Project.length; i++) {
            if (this.state.Project[i].projectStatus === this.state.searchStatus) {
              projectResults.push(this.state.User[i]);
            }
          }
          if (projectResults.length === 0) {
            keepLooking = false;
          }
        }
      }

      if (keepLooking) if (settingsFound) {
        if (this.state.searchDescription !== "") {
          var copy = [];
          for (var i = 0; i < projectResults.length; i++) {
            if (projectResults[i].projectDescription === this.state.searchDescription) {
              copy.push(projectResults[i]);
            }
          }
          projectResults = copy;
          if (projectResults.length === 0) {
            keepLooking = false;
          }
        }
      } else if (!settingsFound) {
        if (this.state.searchDescription !== "") {
          settingsFound = true;
          for (var i = 0; i < this.state.Project.length; i++) {
            if (this.state.Project[i].projectDescription === this.state.searchDescription) {
              projectResults.push(this.state.Project[i]);
            }
          }
          if (projectResults.length === 0) {
            keepLooking = false;
          }
        }
      }

      if (keepLooking) if (settingsFound) {
        if (this.state.searchSkills.length !== 0) {
          var copy = [];
          for (var i = 0; i < projectResults.length; i++) {
            var differenceinSklls = this.getMissingSkills(projectResults[i].attributes, this.state.searchSkills);
            if (differenceinSklls.length === 0) {
              copy.push(projectResults[i]);
            }
          }
          projectResults = copy;
          if (projectResults.length === 0) {
            keepLooking = false;
          }
        }
      } else if (!settingsFound) {
        if (this.state.searchSkills.length !== 0) {
          settingsFound = true;
          for (var i = 0; i < this.state.Project.length; i++) {
            var differenceinSklls = this.getMissingSkills(this.state.Project[i].attributes, this.state.searchSkills);
            if (differenceinSklls.length === 0) {
              projectResults.push(this.state.Project[i]);
            }
          }
          if (projectResults.length === 0) {
            keepLooking = false;
          }
        }
      }

      this.setState({ searchedProjects: projectResults });
      this.render();

    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  getMissingSkills(attributes, searchedSkills) {
    //Find values that are in userSkills but not in searchedSkills
    var uniqueResultOne = attributes.filter(function (obj) {
      return !searchedSkills.some(function (obj2) {
        return obj === obj2;
      });
    });

    return uniqueResultOne;
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
              {"Creatd at: " + new Date(project.createdAt).toLocaleString()}
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

  renderLander() {
    return (
      <div className="lander">
        <h1>Not</h1>
        <p>Authenticated</p>
      </div>
    );
  }

  renderProjects() {
    return (
      <div className="projects">
        <PageHeader>Projects List</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderProjectsList(this.state.searchedProjects)}
        </ListGroup>
      </div>
    );
  }

  renderSkills() {

    var skillset = this.state.allSkills;
    var values = [];
    for (var i = 0; i < skillset.length; i++) {
      values.push(<div class="checkbox"><label><input type="checkbox" name="box" value={skillset[i]} onClick={this.handleAttributes} />{skillset[i]}</label></div>);
    }
    return (<div>
      {values}
    </div>);

  }

  render() {
    return (
      <div className="ProjectsList">
        {this.props.isAuthenticated ?
          <form onSubmit={this.handleSubmit}>
            <ListGroup>
              <ControlLabel><font size="6" color="blue">FILTERS</font></ControlLabel>
              <FormGroup controlId="searchName">
                <ControlLabel><font size="4" color="blue">Name search</font></ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchName}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="searchStatus">
                <ControlLabel><font size="4" color="blue">Status - Pending/Active/Completed</font></ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchStatus}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="searchDescription">
                <ControlLabel><font size="4" color="blue">Description</font></ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchDescription}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="skills">
                <ControlLabel><font size="4" color="blue">Desired Skills</font></ControlLabel>
                {this.renderSkills()}
              </FormGroup>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                type="submit"
                isLoading={this.state.isLoading}
                text="SEARCH"
                loadingText="Searching..."
              />
              {this.renderProjects()}
            </ListGroup>
          </form>
          : this.renderLander()}
      </div>
    );
  }
}