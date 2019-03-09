import React from "react";
import { Switch, Route } from "react-router-dom";
import ServiceReport from "./ServiceReport";
import DO from "./DO";
import General from "./General";
import Axios from "axios";

class Print extends React.Component {
	setPrinted() {
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${this.props.match.params.id}/change-status`,
			data: {
				status: "PRINTED"
			}
		});
	}
	render() {
		return (
			<div className="content">
				<div className="buttons">
					<button
						className="button"
						onClick={() => {
							this.setPrinted();
							window.print();
						}}
					>
						Print
					</button>
					<p>เมื่อคลิก Print แล้วจะไม่สามารถแก้ไขข้อมูลในใบเบิกได้อีก</p>
				</div>
				<Switch>
					<Route
						path="/single/withdrawal/:id/print/service-report"
						component={ServiceReport}
					/>
					<Route path="/single/withdrawal/:id/print/do" component={DO} />
					<Route path="/single/withdrawal/:id/print/general" component={General} />
				</Switch>
			</div>
		);
	}
}

export default Print;
