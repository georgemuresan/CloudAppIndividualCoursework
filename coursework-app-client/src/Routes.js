import React from "react";
import { Route, Switch } from "react-router-dom";
import ProjectsList from "./containers/ProjectsList";
import AboutUs from "./containers/AboutUs";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import NewProject from "./containers/NewProject";
import Projects from "./containers/Projects";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={AboutUs} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/projectslist" exact component={ProjectsList} props={childProps} />
    <AuthenticatedRoute path="/Project/new" exact component={NewProject} props={childProps} />
    <AuthenticatedRoute path="/Project/:id" exact component={Projects} props={childProps} />
    { /* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>;