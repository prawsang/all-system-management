import React from "react";
import { connect } from "react-redux";

const Items = ({ items }) => (
	<table className="is-fullwidth has-mb-10">
		<thead>
			<tr>
				<td>Type</td>
				<td>Serial No.</td>
				<td>Total</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td className="is-bold has-no-line-break">POS</td>
				<td className="is-fullwidth">
					{items.pos.map((e, i) => (
						<span key={i + e.serial_no} className="has-mr-10">
							{e.serial_no}
						</span>
					))}
				</td>
				<td>{items.pos.length}</td>
			</tr>
			<tr>
				<td className="is-bold has-no-line-break">Scanner</td>
				<td className="is-fullwidth">
					{items.scanners.map((e, i) => (
						<span key={i + e.serial_no} className="has-mr-10">
							{e.serial_no}
						</span>
					))}
				</td>
				<td>{items.scanners.length}</td>
			</tr>
			<tr>
				<td className="is-bold has-no-line-break">Monitor</td>
				<td className="is-fullwidth">
					{items.monitors.map((e, i) => (
						<span key={i + e.serial_no} className="has-mr-10">
							{e.serial_no}
						</span>
					))}
				</td>
				<td>{items.monitors.length}</td>
			</tr>
			<tr>
				<td className="is-bold has-no-line-break">Keyboard</td>
				<td className="is-fullwidth">
					{items.keyboards.map((e, i) => (
						<span key={i + e.serial_no} className="has-mr-10">
							{e.serial_no}
						</span>
					))}
				</td>
				<td>{items.keyboards.length}</td>
			</tr>
			<tr>
				<td className="is-bold has-no-line-break">Printer</td>
				<td className="is-fullwidth">
					{items.printers.map((e, i) => (
						<span key={i + e.serial_no} className="has-mr-10">
							{e.serial_no}
						</span>
					))}
				</td>
				<td>{items.printers.length}</td>
			</tr>
			<tr>
				<td className="is-bold has-no-line-break">Cash Drawer</td>
				<td className="is-fullwidth">
					{items.cashDrawers.map((e, i) => (
						<span key={i + e.serial_no} className="has-mr-10">
							{e.serial_no}
						</span>
					))}
				</td>
				<td>{items.cashDrawers.length}</td>
			</tr>
		</tbody>
	</table>
);

const mapStateToProps = state => ({
	items: state.withdrawal.items
});

export default connect(
	mapStateToProps,
	null
)(Items);
