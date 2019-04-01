import React from "react";
import { Switch, Route } from "react-router-dom";
import ServiceReportPage from "./ServiceReport";
import DOPage from "./DO";
import GeneralPage from "./General";
import Axios from "axios";
import Pages from "./Pages";

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

const ServiceReport = ({ match }) => (
	<Pages
		id={match.params.id}
		render={data => (
			<ServiceReportPage
				currentWithdrawal={data.currentWithdrawal}
				start={data.start}
				end={data.end}
				items={data.items}
				key={data.key}
				pageNumber={data.pageNumber}
				type="SR"
			/>
		)}
	/>
);

const DO = ({ match }) => (
	<Pages
		id={match.params.id}
		render={data => (
			<DOPage
				currentWithdrawal={data.currentWithdrawal}
				start={data.start}
				end={data.end}
				items={data.items}
				key={data.key}
				pageNumber={data.pageNumber}
				type="DO"
			/>
		)}
	/>
);

const General = ({ match }) => (
	<Pages
		id={match.params.id}
		render={data => (
			<GeneralPage
				currentWithdrawal={data.currentWithdrawal}
				start={data.start}
				end={data.end}
				items={data.items}
				key={data.key}
				pageNumber={data.pageNumber}
			/>
		)}
	/>
);

export default Print;
