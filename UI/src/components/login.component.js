import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeuser_name = this.onChangeuser_name.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            user_name: "",
            api_key: "",
            loading: false,
            message: ""
        };
    }

    onChangeuser_name(e) {
        this.setState({
            user_name: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            api_key: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.user_name, this.state.api_key).then(
                () => {
                    this.props.history.push("/dashboard");
                    window.location.reload();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container bg-light">

                    <Form
                        onSubmit={this.handleLogin}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="user_name">User Name</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="user_name"
                                value={this.state.user_name}
                                onChange={this.onChangeuser_name}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="api_key">API Key</label>
                            <Input
                                type="api_key"
                                className="form-control"
                                name="api_key"
                                value={this.state.api_key}
                                onChange={this.onChangePassword}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <button
                                className="btn btn-primary btn-block"
                                disabled={this.state.loading}
                            >
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Login</span>
                            </button>
                        </div>

                        {this.state.message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{display: "none"}}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}
