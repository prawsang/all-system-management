import React from "react";
import { connect } from "react-redux";

const Items = ({ items, start, end }) => (
	<table className="is-fullwidth has-mb-10">
		<thead>
			<tr>
				<td colSpan="15" className="is-ta-center">
					รายละเอียดสินค้า/Description
				</td>
			</tr>
			<tr>
				<td>No.</td>
				<td>POS</td>
				<td />
				<td>Thermal Printer</td>
				<td />
				<td>Cash Drawer</td>
				<td />
				<td>Monitor</td>
				<td />
				<td>Keyboard</td>
				<td />
				<td>Pole</td>
				<td />
				<td>Scanner</td>
				<td />
			</tr>
			<tr>
				<td colSpan="15" className="is-ta-center">
					Serial No.
				</td>
			</tr>
		</thead>
		<tbody>
			{renderRows(items, start, end)}
			<tr className="small">
				<td>Total</td>
				<td>{items.pos.length}</td>
				<td />
				<td>{items.printers.length}</td>
				<td />
				<td>{items.cashDrawers.length}</td>
				<td />
				<td>{items.monitors.length}</td>
				<td />
				<td>{items.keyboards.length}</td>
				<td />
				<td />
				<td />
				<td>{items.scanners.length}</td>
				<td />
			</tr>
		</tbody>
	</table>
);

const renderRows = (items, start, end) => {
	let rows = [];
	for (let i = start; i < end; i++) {
		rows.push(
			<tr key={i + "serial"} className="serial">
				<td>{i + 1}</td>
				<td>{items.pos[i]}</td>
				<td />
				<td>{items.printers[i]}</td>
				<td />
				<td>{items.cashDrawers[i]}</td>
				<td />
				<td>{items.monitors[i]}</td>
				<td />
				<td>{items.keyboards[i]}</td>
				<td />
				<td />
				<td />
				<td>{items.scanners[i]}</td>
				<td />
			</tr>
		);
	}
	return rows;
};

export default Items;
