import React from "react";
import { Route, Switch } from 'react-router-dom';
import AllPO from "./tables/AllPO";

class Report extends React.Component {
    state = {
        entriesPerPage: 1
    }
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/report/all-po" component={AllPO} />
				</Switch>
			</div>
		);
	}
}

export default Report;
