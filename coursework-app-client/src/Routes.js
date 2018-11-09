import React from "react";
import { Route, Switch } from "react-router-dom";
import ProjectsList from "./containers/ProjectsList";
import UsersList from "./containers/UsersList";
import UsersSearch from "./containers/UsersSearch";
import MyProfile from "./containers/MyProfile";
import AboutUs from "./containers/AboutUs";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import NewProject from "./containers/NewProject";
import Projects from "./containers/Projects";
import ProjectSearch from "./containers/ProjectSearch";
import Users from "./containers/Users";
import ProjectView from "./containers/ProjectView";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={AboutUs} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/userslist" exact component={UsersList} props={childProps} />
    <AuthenticatedRoute path="/myprofile" exact component={MyProfile} props={childProps} />
    <AuthenticatedRoute path="/userssearch" exact component={UsersSearch} props={childProps} />
    <AuthenticatedRoute path="/projectssearch" exact component={ProjectSearch} props={childProps} />
    <AuthenticatedRoute path="/projectslist" exact component={ProjectsList} props={childProps} />
    <AuthenticatedRoute path="/Project/new" exact component={NewProject} props={childProps} />
    <AuthenticatedRoute path="/User/:id" exact component={Users} props={childProps} />
    <AuthenticatedRoute path="/Project/:id" exact component={ProjectView} props={childProps} />
    <AuthenticatedRoute path="/Project/:id" exact component={Projects} props={childProps} />
    
    { /* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>;