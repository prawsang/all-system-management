import React from "react";
import { Route, Switch } from "react-router-dom";

import AllPO from "./pages/AllPO";
import InstallNoPO from "./pages/InstallNoPO";
import BranchNoInstall from "./pages/BranchNoInstall";
import Broken from "./pages/Broken";
import Borrowed from "./pages/Borrowed";
import InStock from "./pages/InStock";
import CustomersTable from "./pages/CustomersTable";
import StoreTypes from "./pages/StoreTypes";
import Models from "./pages/Models";
import AllWithdrawals from "./pages/AllWithdrawals";
import NoBilling from "./pages/NoBilling";

class Report extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/report/all-po" component={AllPO} />
					<Route path="/report/install-wo-po" component={InstallNoPO} />
					<Route path="/report/branch-no-install" component={BranchNoInstall} />
					<Route path="/report/broken" component={Broken} />
					<Route path="/report/borrowed" component={Borrowed} />
					<Route path="/report/in-stock" component={InStock} />
					<Route path="/report/customers" component={CustomersTable} />
					<Route path="/report/store-types" component={StoreTypes} />
					<Route path="/report/models" component={Models} />
					<Route path="/report/all-withdrawals" component={AllWithdrawals} />
					<Route path="/report/not-billed" component={NoBilling} />
				</Switch>
			</div>
		);
	}
}

export default Report;
