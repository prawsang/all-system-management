import React from "react";
import { Route, Switch } from 'react-router-dom';
import AllPO from "./tables/AllPO";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";

class Report extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/report/all-po" component={AllPOWrapper} />
				</Switch>
			</div>
		);
	}
}

const AllPOWrapper = () => (
	<FetchDataFromServer
		url="/po/get-all"
		render={data => <AllPO data={data} />}
	/>
)

export default Report;
