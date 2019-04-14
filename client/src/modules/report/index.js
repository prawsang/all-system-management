import React from "react";
import { Route, Switch } from "react-router-dom";

import AllPOWrapper from "./wrappers/AllPOWrapper";
import InstallNoPOWrapper from "./wrappers/InstallNoPOWrapper";
import BranchNoInstallWrapper from "./wrappers/BranchNoInstallWrapper";
import BrokenWrapper from "./wrappers/BrokenWrapper";
import BorrowedWrapper from "./wrappers/BorrowedWrapper";
import InStockWrapper from "./wrappers/InStockWrapper";
import CustomersTableWrapper from "./wrappers/CustomersTableWrapper";
import StoreTypesWrapper from "./wrappers/StoreTypesWrapper";
import ModelsWrapper from "./wrappers/ModelsWrapper";
import AllWithdrawalsWrapper from "./wrappers/AllWithdrawalsWrapper";
import NoBillingWrapper from "./wrappers/NoBillingWrapper";

class Report extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/report/all-po" component={AllPOWrapper} />
					<Route path="/report/install-wo-po" component={InstallNoPOWrapper} />
					<Route path="/report/branch-no-install" component={BranchNoInstallWrapper} />
					<Route path="/report/broken" component={BrokenWrapper} />
					<Route path="/report/borrowed" component={BorrowedWrapper} />
					<Route path="/report/in-stock" component={InStockWrapper} />
					<Route path="/report/customers" component={CustomersTableWrapper} />
					<Route path="/report/store-types" component={StoreTypesWrapper} />
					<Route path="/report/models" component={ModelsWrapper} />
					<Route path="/report/all-withdrawals" component={AllWithdrawalsWrapper} />
					<Route path="/report/not-billed" component={NoBillingWrapper} />
				</Switch>
			</div>
		);
	}
}

export default Report;
