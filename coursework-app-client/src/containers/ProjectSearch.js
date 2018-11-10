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
      allSkills: ["Java", "C++", "Assembly", "R", "Python", "PHP", "SQL", "Swing", "CSS", "HTML", "JSON", "CSV", "Team Leader", "JavaScript", "Pascal", "MatLab", "SolidWorks"],
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
    
      if (this.state.searchName !== "" && typeof this.state.searchName != 'undefined') {
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
              projectResults.push(this.state.Project[i]);
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
            var differenceinSklls = this.getMissingSkills(this.state.searchSkills, projectResults[i].attributes);
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
            var differenceinSklls = this.getMissingSkills(this.state.searchSkills, this.state.Project[i].attributes);
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
              {"Status: " + project.projectStatus + "; " + "Created at: " + new Date(project.createdAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
          : <ListGroupItem>
          <font size="3">
        <b>Search results</b>
        </font>
      
       </ListGroupItem>
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
        <h1><font size="6">PROJECT LIST</font></h1>
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
      searchStatus: resultStat
    });
  }

  renderStatus() {
    var values = [];

    if (this.state.searchStatus === "") {
      values.push(<option value="" selected name="stat" ></option>);
      values.push(<option value="Pending" name="stat" >Pending</option>);
      values.push(<option value="Active" name="stat" >Active</option>);
      values.push(<option value="Completed" name="stat" >Completed</option>);
    } else if (this.state.searchStatus === "Pending") {
      values.push(<option value="" name="stat" ></option>);
      values.push(<option value="Pending" name="stat" selected >Pending</option>);
      values.push(<option value="Active" name="stat" >Active</option>);
      values.push(<option value="Completed" name="stat">Completed</option>);
    } else if (this.state.searchStatus === "Active") {

      values.push(<option value="" name="stat" ></option>);
      values.push(<option value="Pending" name="stat" >Pending</option>);
      values.push(<option value="Active" name="stat" selected >Active</option>);
      values.push(<option value="Completed" name="stat" >Completed</option>);
    } else if (this.state.searchStatus === "Completed") {
      values.push(<option value="" name="stat" ></option>);
      values.push(<option value="Pending" name="stat" >Pending</option>);
      values.push(<option value="Active" name="stat" >Active</option>);
      values.push(<option value="Completed" selected name="stat" >Completed</option>);
    } 


    return (<FormControl componentClass="select" placeholder="select" onChange={this.handleStatusChange}>
      {values}
    </FormControl>);
  }

  render() {
    return (
      <div className="ProjectsList">
        {this.props.isAuthenticated ?
          <form onSubmit={this.handleSubmit}>
            <ListGroup>
              <h1><font size="6">PROJECT FILTERS</font></h1>
              <FormGroup controlId="searchName">
              <h3><font size="4" ><b>Name:</b></font></h3>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchName}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="searchStatus">
              <h3><font size="4" ><b>Status:</b></font></h3>
                {this.renderStatus()}
              </FormGroup>
              <FormGroup controlId="searchDescription">
              <h3><font size="4" ><b>Description:</b></font></h3>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.searchDescription}
                  componentClass="textarea"
                />
              </FormGroup>
              <FormGroup controlId="skills">
              <h3><font size="4" ><b>Desired Skills:</b></font></h3>
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