import React from "react";
import { Switch, Route } from "react-router-dom";
import AddPO from "./pages/AddPO";
import AddItems from "./pages/AddItems";
import EditItems from "./pages/EditItems";

class Record extends React.Component {
	render() {
		return (
			<Switch>
				<Route path="/record/po" component={AddPO} />
				<Route path="/record/add-items" component={AddItems} />
				<Route path="/record/edit-items" component={EditItems} />
			</Switch>
		);
	}
}

export default Record;
