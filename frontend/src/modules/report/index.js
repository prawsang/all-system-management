import React from "react";
import { Route, Switch } from 'react-router-dom';
import Table from "./components/Table";
import AllPO from "./tables/AllPO";
import InstallWoPO from './tables/InstallWoPO';
import BranchNoInstall from './tables/BranchNoInstall';
import FetchDataFromServer from "@/common/components/FetchDataFromServer";

class Report extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/report/all-po" component={AllPOWrapper} />
					<Route path="/report/install-wo-po" component={InstallWoPOWrapper} />
					<Route path="/report/branch-no-install" component={BranchNoInstallWrapper} />
				</Switch>
			</div>
		);
	}
}

const AllPOWrapper = () => (
	<FetchDataFromServer
		url="/po/get-all"
		render={data => 
			<Table 
				data={data} 
				table={
					data => <AllPO data={data}/>
				} 
				title="PO ทั้งหมด"/>
			}
	/>
)

const InstallWoPOWrapper = () => (
	<FetchDataFromServer
		url="/withdrawal/without-po"
		render={data => 
			<Table 
				data={data} 
				table={
					data => <InstallWoPO data={data}/>
				} 
				title="การติดตั้งที่ยังไม่ได้รับ PO"/>
			}
	/>
)

const BranchNoInstallWrapper = () => (
	<FetchDataFromServer
		url="/branch/no-install"
		render={data => 
			<Table 
				data={data} 
				table={
					data => <BranchNoInstall data={data}/>
				} 
				title="สาขาที่ยังไม่ได้ติดตั้ง"/>
			}
	/>
)

export default Report;
