import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentWillMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar- text-dark bg-light">
        {currentUser ? ( <Link to={"/"} className="navbar-brand">
           
            <img src= {currentUser.image} className="rounded" alt="..."></img>
          </Link>):( <Link to={"/"} className="navbar-brand">
            Task Management
          </Link>)}
          
          <div className="navbar-nav mr-auto">
                       {currentUser && (
              <li className="nav-item">
               {currentUser.token.name}
              </li>
            )}
          </div>

          {currentUser && (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) }
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/dashboard"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
