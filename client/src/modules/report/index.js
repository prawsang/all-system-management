import React from "react";
import { Route, Switch } from "react-router-dom";

import Table from "./components/Table";
import TableWithNew from "./components/TableWithNew";

import AllPO from "./tables/AllPO";
import InstallWoPO from "./tables/InstallWoPO";
import BranchNoInstall from "./tables/BranchNoInstall";
import Broken from "./tables/Broken";
import Borrowed from "./tables/Borrowed";
import InStock from "./tables/InStock";
import CustomersTable from "./tables/Customers";
import ModelsTable from "./tables/Models";
import StoreTypesTable from "./tables/StoreTypes";
import WithdrawalsTable from "@/modules/single/tables/withdrawals";

import NewCustomer from "./modals/NewCustomer";
import StoreType from "./modals/StoreType";
import Model from "./modals/Model";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";

class Report extends React.Component {
	render() {
		return (
			<div className="content">
				<Switch>
					<Route path="/report/all-po" component={AllPOWrapper} />
					<Route path="/report/install-wo-po" component={InstallWoPOWrapper} />
					<Route path="/report/branch-no-install" component={BranchNoInstallWrapper} />
					<Route path="/report/broken" component={BrokenWrapper} />
					<Route path="/report/borrowed" component={BorrowedWrapper} />
					<Route path="/report/in-stock" component={InStockWrapper} />
					<Route path="/report/customers" component={CustomersTableWrapper} />
					<Route path="/report/store-types" component={StoreTypesWrapper} />
					<Route path="/report/models" component={ModelsWrapper} />
					<Route path="/report/all-withdrawals" component={AllWithdrawalsWrapper} />
				</Switch>
			</div>
		);
	}
}

const AllPOWrapper = () => (
	<FetchDataFromServer
		url="/po/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <AllPO data={data} />}
				title="PO ทั้งหมด"
				searchPlaceholder="Search PO Number"
			/>
		)}
	/>
);

const InstallWoPOWrapper = () => (
	<FetchDataFromServer
		url="/withdrawal/without-po"
		render={data => (
			<Table
				data={data}
				table={data => <InstallWoPO data={data} />}
				title="การติดตั้งที่ยังไม่ได้รับ PO"
				searchPlaceholder="Search ID"
			/>
		)}
	/>
);

const BranchNoInstallWrapper = () => (
	<FetchDataFromServer
		url="/branch/no-install"
		render={data => (
			<Table
				data={data}
				table={data => <BranchNoInstall data={data} />}
				title="สาขาที่ยังไม่ได้ติดตั้ง"
				searchPlaceholder="Search Branch Name"
			/>
		)}
	/>
);

const BrokenWrapper = () => (
	<FetchDataFromServer
		url="/stock/broken"
		render={data => (
			<Table
				data={data}
				table={data => <Broken data={data} />}
				title="ของเสีย"
				searchPlaceholder="Search Serial No."
			/>
		)}
	/>
);

const BorrowedWrapper = () => (
	<FetchDataFromServer
		url="/stock/status/borrowed"
		render={data => (
			<Table
				data={data}
				table={data => <Borrowed data={data} />}
				title="ของยืม"
				searchPlaceholder="Search Serial No."
			/>
		)}
	/>
);

const AllWithdrawalsWrapper = () => (
	<FetchDataFromServer
		url="/withdrawal/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <WithdrawalsTable data={data} />}
				title="ใบเบิกทั้งหมด"
				searchPlaceholder="Search ID"
			/>
		)}
	/>
);

const CustomersTableWrapper = () => (
	<FetchDataFromServer
		url="/customer/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <CustomersTable data={data} />}
				title="All Customers"
				newModalContent={data => <NewCustomer />}
			/>
		)}
	/>
);

const StoreTypesWrapper = () => (
	<FetchDataFromServer
		url="/store-type/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <StoreTypesTable data={data} />}
				title="All Store Types"
				newModalContent={data => <StoreType />}
			/>
		)}
	/>
);

const ModelsWrapper = () => (
	<FetchDataFromServer
		url="/model/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <ModelsTable data={data} />}
				title="All Models"
				newModalContent={data => <Model />}
			/>
		)}
	/>
);

class InStockWrapper extends React.Component {
	state = {
		type: "ALL"
	};
	render() {
		const { type } = this.state;
		return (
			<FetchDataFromServer
				url="/stock/status/in_stock"
				params={type === "ALL" ? "" : `type=${type}`}
				render={data => (
					<div>
						<div
							className="field no-mb is-flex is-ai-center"
							style={{ float: "right" }}
						>
							<label className="label">ประเภท: </label>
							<div className="select">
								<select
									value={type}
									onChange={e => this.setState({ type: e.target.value })}
								>
									<option value="ALL">ทั้งหมด</option>
									<option value="POS">POS</option>
									<option value="SCANNER">Scanner</option>
									<option value="KEYBOARD">Keyboard</option>
									<option value="MONITOR">Monitor</option>
									<option value="PRINTER">Printer</option>
									<option value="CASH_DRAWER">Cash Drawer</option>
								</select>
							</div>
						</div>
						<Table
							data={data}
							table={data => <InStock data={data} />}
							title="Stock คงเหลือ"
						/>
					</div>
				)}
			/>
		);
	}
}

export default Report;
