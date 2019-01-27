import React from "react";
import { Route, Switch } from 'react-router-dom';
import Table from "./components/Table";
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
		render={data => 
			<Table 
				data={data} 
				table={
					data => <AllPO data={data}/>
				} 
				title="PO ทั้งหมด"/>
			}
		disabled={false}
	/>
)

export default Report;
