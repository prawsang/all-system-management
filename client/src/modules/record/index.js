import React from "react";
import { Switch, Route } from "react-router-dom";
import AddPO from "./pages/AddPO";

class Record extends React.Component {
	render() {
		return (
			<Switch>
				<Route path="/record/po" component={AddPO} />
			</Switch>
		);
	}
}

export default Record;
