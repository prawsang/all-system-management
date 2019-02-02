import React from "react";
import { connect } from "react-redux";
import { setSelectedJobCode } from "@/actions/record";

const JobSelect = ({ disabled, selectedJobCode, setSelectedJobCode, jobs }) => (
	<div className={`field ${disabled && "is-disabled"}`}>
		<div className="select">
			<select
				value={selectedJobCode ? selectedJobCode.job_code : ""}
				onChange={e => setSelectedJobCode(e.target.value)}
				disabled={disabled}
			>
				<option value="">เลือก Job</option>
				{jobs.length > 0 ? (
					jobs.map((e, i) => (
						<option key={e.job_code + i} value={e.job_code}>
							{e.name} ({e.job_code})
						</option>
					))
				) : (
					<option value="" disabled>
						ลูกค้าท่านนี้ยังไม่มี Job
					</option>
				)}
			</select>
		</div>
	</div>
);

const mapStateToProps = state => ({
	selectedJobCode: state.record.selectedJobCode,
	jobs: state.record.jobs
});

const mapDispatchToProps = {
	setSelectedJobCode
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(JobSelect);
