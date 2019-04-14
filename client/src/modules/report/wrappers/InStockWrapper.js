import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../components/Table";
import InStock from "../tables/InStock";

class InStockWrapper extends React.Component {
	state = {
		type: "ALL"
	};
	render() {
		const { type } = this.state;
		return (
			<FetchDataFromServer
				url="/stock/get-all"
				params={`${type === "ALL" ? "" : `type=${type}`}&status=in_stock`}
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
							columns={[
								{
									col: "serial_no",
									name: "Serial No."
								},
								{
									col: "model_name",
									name: "Model Name"
								}
							]}
						/>
					</div>
				)}
			/>
		);
	}
}

export default InStockWrapper;
