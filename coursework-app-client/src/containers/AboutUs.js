import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Panel} from "react-bootstrap";
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
   
   
  } catch (e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

  render() {
    return (
      <div className="AboutUs">
        <div className="lander">
          <Panel >
    <Panel.Body>
    <h4><font size="6" ><b>WELCOME!</b></font></h4>
   
							<h4><font size="4" ><b>Who are we?</b></font></h4>
              <h4><font size="2" >We are a small-based company that handles a Project Management platform.</font></h4>
              <h4><font size="4" ><b>Why?</b></font></h4>
              <h4><font size="2" >Just because it's so great!</font></h4>
              <h4><font size="4" ><b>How?</b></font></h4>
              <h4><font size="2" >By using the Amazon Web Services of course!</font></h4>
              <h4><font size="4" ><b>What features are there?</b></font></h4>
              <h4><font size="2" ><ul>
     <li key="0">The posibility of creating a profile of your own and editing it at any point after Authentication;</li>
     <li key="0">Being able to see current logged-in profile at any time;</li>
     <li key="1">Platform handling 3 different levels of Users: Admin, Project Manager and Developer;</li>
     <li key="6">Upon the creation of the Project, being able to upload an Attachment;;</li>
     <li key="2">As a Developer, you can submit a request to join ACTIVE Projects at any time;</li>
     <li key="2">As a Developer, you can submit a request to become a Project Manager at any time;</li>
     <li key="2">As a Project Manager, you can either Approve or Decline a Developer's request to join an ACTIVE Project;</li>
     <li key="2">As a Project Manager, you can Create any new Project;</li>
     <li key="2">As a Project Manager, you can Edit any Project that is not COMPLETED;</li>
     <li key="2">As a Project Manager, you can Join any Project that is not COMPLETED OR PENDING;</li>
     <li key="2">As an Admin, you can either Approve or Decline a Developer's request to become a Project Manager;</li>
     <li key="2">As an Admin, you can change the Status of any User in the system including yours;</li>
     <li key="2">As an Admin, you can Create any new Project;</li>
     <li key="2">As an Admin, you can Edit any Project that is not COMPLETED;</li>
     <li key="2">As an Admin, you can Join any Project that is not COMPLETED OR PENDING;</li>
     <li key="3">Check the list of all the Users on the platform;</li>
     <li key="4">Check the list of all the Projects on the platform;</li>
     <li key="5">Being able to search a Project or User by name;</li>
     <li key="6">Being able to search a Project or User by any other field.</li>
    </ul></font></h4>
              </Panel.Body>
  </Panel>
        </div>
      </div>
    );
  }
}