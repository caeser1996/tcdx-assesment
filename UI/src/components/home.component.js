import React, {Component} from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import TodoList from "./todo.component";
import pie from "../pie-chart.svg"

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: undefined,
            "tasksCompleted": undefined,
            "totalTasks": undefined,
            "latestTasks": []
        }
        this.handler = this.handler.bind(this)
    }

    componentDidMount() {
        UserService.fetchDashboardData().then(
            response => {
                this.setState({

                    tasksCompleted: response.data.tasksCompleted,


                });
                this.setState({

                    totalTasks: response.data.totalTasks,


                });
                this.setState({

                    latestTasks: response.data.latestTasks,


                });


            },
            error => {
                AuthService.logout();

            }
        );
    }

    handler() {
        UserService.fetchDashboardData().then(
            response => {
                this.setState({

                    tasksCompleted: response.data.tasksCompleted,


                });
                this.setState({

                    totalTasks: response.data.totalTasks,


                });
                this.setState({

                    latestTasks: response.data.latestTasks,


                });


            },
            error => {
                AuthService.logout();

            }
        );
    }


    render() {
        const user = AuthService.getCurrentUser();
        let {latestTasks, tasksCompleted, totalTasks} = this.state
        return (<div className="container">
                {user ? (
                    <div className="row text-dark">
                        <div className="col-md-4">
                            <div className="card bg-light" style={{"height": "250px"}}>
                                <div className="card-body">
                                    <h5 className="card-title">Task Completed {this.state.currentUser}</h5>
                                    <p className="card-text">{tasksCompleted}/{totalTasks}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light" style={{"height": "250px"}}>
                                <div className="card-body">
                                    <h5 className="card-title">Latest Created Tasks</h5>
                                    <ol>
                                        {latestTasks.length > 0 ? (
                                            // <p>Task are present {JSON.stringify(latestTasks)}</p>
                                            latestTasks.map(function (v, k) {
                                                return <p key={k}>{v.name}</p>;
                                            })
                                        ) : (<p>No Recent Tasks</p>)}
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light" style={{"height": "250px"}}>
                                <div className="card-body">
                                    <h5 className="card-title">Completed Tasks</h5>
                                    <img src={pie} alt="" height="150" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <TodoList handler={this.handler}></TodoList>
                        </div>
                    </div>

                ) : (
                    <div>Please <a href="/login">Login</a></div>
                )}

            </div>
        );
    }
}
