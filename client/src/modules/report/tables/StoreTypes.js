import React from "react";
import StoreType from "../modals/StoreType";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class StoreTypesTable extends React.Component {
	state = {
		showEdit: false,
		showDeleteConfirm: false,
		selected: { id: "", name: "" }
	};
	handleDelete() {
		const { selected } = this.state;
		Axios.request({
			method: "DELETE",
			url: `/store-type/${selected.id}`
		}).then(res => window.location.reload());
	}
	render() {
		const { data } = this.props;
		const { showEdit, showDeleteConfirm, selected } = this.state;

		return (
			<React.Fragment>
				<table className="is-fullwidth is-rounded">
					<thead>
						<tr>
							<td>Store Type Name</td>
							<td />
							<td />
						</tr>
					</thead>
					<tbody>
						{data &&
							(data.rows.length > 0 &&
								data.rows.map((e, i) => (
									<tr key={i + e.store_type_name} className="is-short">
										<td className="is-fullwidth has-no-line-break">
											{e.store_type_name}
										</td>
										<td className="no-pr">
											<button
												className="button"
												onClick={() =>
													this.setState({
														showEdit: true,
														selected: {
															id: e.store_type_id,
															name: e.store_type_name
														}
													})
												}
											>
												Edit
											</button>
										</td>
										<td>
											<button
												className="button is-danger"
												onClick={() =>
													this.setState({
														showDeleteConfirm: true,
														selected: {
															id: e.store_type_id,
															name: e.store_type_name
														}
													})
												}
											>
												Delete
											</button>
										</td>
									</tr>
								)))}
					</tbody>
				</table>
				<Modal
					active={showEdit}
					close={() => this.setState({ showEdit: false })}
					title="Edit"
				>
					<StoreType data={selected} modalType="EDIT" />
				</Modal>
				<Modal
					active={showDeleteConfirm}
					close={() => this.setState({ showDeleteConfirm: false })}
					title="Confirm Deletion"
				>
					<p>Are you sure you want to delete?</p>
					<div className="buttons">
						<button className="button is-danger" onClick={() => this.handleDelete()}>
							Delete
						</button>
						<button
							className="button is-light"
							onClick={() => this.setState({ showDeleteConfirm: false })}
						>
							Cancel
						</button>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default StoreTypesTable;
