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
		if (selectedBranches.length > 0) {
			await Axios.request({
				method: "POST",
				url: `/po/${this.props.poNumber}/add-branches`,
				data: {
					branches: selectedBranches
				}
			});
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
							selectedBranches.map((e, i) => (
								<div
									key={i + e.name}
									className="is-flex is-jc-space-between is-ai-center snippet"
								>
									<span>{e.name}</span>
									<div className="is-flex is-ai-center">
										<div className="field is-flex has-mr-10 no-mb">
											<div className="is-flex is-ai-center">
												<label className="label">ติดตั้งแล้ว:</label>
												<input
													className="checkbox"
													onChange={() =>
														setSelectedBranches([
															...selectedBranches.slice(0, i),
															{
																...e,
																installed: !e.installed
															},
															...selectedBranches.slice(
																i + 1,
																selectedBranches.length
															)
														])
													}
													type="checkbox"
													checked={e.installed}
													name="installed"
												/>
											</div>
										</div>
										<span
											className="danger is-clickable"
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
									</div>
								</div>
							))
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
