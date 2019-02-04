import React from "react";
import Axios from "axios";
import Modal from "@/common/components/Modal";
import BranchSearch from "@/modules/record/components/search/BranchSearch";
import { setSelectedBranches } from "@/actions/record";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class AddBranchModal extends React.Component {
	async handleAddBranches() {
		const { selectedBranches } = this.props;
		let branchIds = [];
		if (selectedBranches.length > 0) {
			selectedBranches.map(e => branchIds.push(e.id));
			await Axios.request({
				method: "POST",
				url: `/po/${this.props.poNumber}/add-branches`,
				data: {
					branch_id: branchIds
				}
			})
				.then(r => console.log(r))
				.catch(err => console.log(err, "branches"));
		}
		window.location.reload();
	}

	render() {
		const { active, close, selectedBranches, setSelectedBranches } = this.props;
		return (
			<Modal active={active} close={close} title="เพิ่มสาขา">
				<div>
					<BranchSearch />
					<h6>สาขาที่เลือกไว้</h6>
					<div>
						{selectedBranches.length > 0 ? (
							<ul className="no-mt">
								{selectedBranches.map((e, i) => (
									<li key={i + e.name}>
										{e.name}
										<span
											className="danger has-ml-05 is-clickable"
											onClick={() =>
												setSelectedBranches(
													selectedBranches
														.slice(0, i)
														.concat(
															selectedBranches.slice(
																i + 1,
																selectedBranches.length
															)
														)
												)
											}
										>
											<FontAwesomeIcon icon={faTrash} />
										</span>
									</li>
								))}
							</ul>
						) : (
							<p className="is-gray-3 has-mb-10">ยังไม่ได้เลือกสาขา</p>
						)}
					</div>
					<div className="buttons">
						<button
							className="button"
							type="submit"
							onClick={() => this.handleAddBranches()}
						>
							Confirm
						</button>
						<button className="button is-light" type="button" onClick={close}>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => ({
	selectedBranches: state.record.selectedBranches
});

const mapDispatchToProps = {
	setSelectedBranches
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddBranchModal);
