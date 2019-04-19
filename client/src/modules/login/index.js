import React from "react";
import { logIn } from "@/actions/auth";
import { connect } from "react-redux";
import history from "@/common/history";

class Login extends React.Component {
	state = {
		username: "",
		password: ""
	};

	handleSubmit(e) {
		e.preventDefault();
		const { username, password } = this.state;
		this.props.logIn({ username, password }, history);
	}

	render() {
		const { username, password } = this.state;
		return (
			<div
				className="is-flex is-ai-center is-jc-center"
				style={{ height: "100vh", margin: "auto" }}
			>
				<div className="panel" style={{ width: "100%", maxWidth: 400, margin: 15 }}>
					<div className="panel-content content">
						<h4 className="has-mb-10">Login</h4>
						<form onSubmit={e => this.handleSubmit(e)}>
							<div className="field">
								<label className="label">Username</label>
								<input
									className="input is-fullwidth"
									value={username}
									onChange={e => this.setState({ username: e.target.value })}
									placeholder="Username"
									type="text"
								/>
							</div>
							<div className="field">
								<label className="label">Password</label>
								<input
									className="input is-fullwidth"
									value={password}
									onChange={e => this.setState({ password: e.target.value })}
									placeholder="Password"
									type="password"
								/>
							</div>
							<button className="button is-fullwidth">Login</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	null,
	{ logIn }
)(Login);
