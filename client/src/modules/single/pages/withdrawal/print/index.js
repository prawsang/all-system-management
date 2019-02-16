import React from "react";
import { Switch, Route } from "react-router-dom";
import ServiceReport from "./ServiceReport";

class Print extends React.Component {
	render() {
		return (
			<div className="content">
				<div className="buttons">
					<button className="button" onClick={() => window.print()}>
						Print
					</button>
					<p>เมื่อคลิก Print แล้วจะไม่สามารถแก้ไขข้อมูลในใบเบิกได้อีก</p>
				</div>
				<Switch>
					<Route
						path="/single/withdrawal/:id/print/service-report"
						component={ServiceReport}
					/>
				</Switch>
			</div>
		);
	}
}

export default Print;
