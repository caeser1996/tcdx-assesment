import React, {
  Component
} from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "tasksCompleted": undefined,
      "totalTasks": undefined,
      "latestTasks": [

      ]
    }
  }

  componentDidMount() {
    UserService.fetchDashboardData().then(
      response => {
        this.setState({
          tasksCompleted: response.data.tasksCompleted,
          totalTasks: response.data.tasksCompleted,
          latestTasks: response.data.tasksCompleted.latestTasks
        });
      },
      error => {
        AuthService.logout();
        
      }
    );
  }


  render() {
    return ( <div className="container">
      <div className="row text-dark">
          <div className="col-md-4">
            <div className="card bg-light" style={{"height": "250px"}}>
              <div className="card-body">
                <h5 className="card-title">Task Completed</h5>
                <p className="card-text">5/20</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light" style={{"height": "250px"}}>
              <div className="card-body">
                <h5 className="card-title">Latest Created Tasks</h5>
                <ol>
                  <li className="mt-4">x</li>
                  <li className="mt-4">x</li>
                  <li className="mt-4">x</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light" style={{"height": "250px"}}>
              <div className="card-body">
                <h5 className="card-title">Completed Tasks</h5>
                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
              </div>
            </div>
          </div>
      </div>
    </div>
    );
  }
}
