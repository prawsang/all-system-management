checkBranchInPo = async (branch_id, po_number) => {
	let branchInPO = false;
	let errors = [];
	await PurchaseOrder.count({
		where: {
			po_number: {
				[Op.eq]: po_number
			}
		},
		include: {
			model: Branch,
			where: {
				id: {
					[Op.eq]: branch_id
				}
			}
		}
	})
		.then(count => (count == 0 ? (branchInPO = false) : (branchInPO = true)))
		.catch(err => errors.push(err));
	return {
		branchInPO,
		errors
	};
};
checkBranchInJob = async (branch_id, job_code) => {
	let branchInJob = false;
	let errors = [];
	await Job.count({
		where: {
			job_code: {
				[Op.eq]: job_code
			}
		},
		include: {
			model: Branch,
			where: {
				id: {
					[Op.eq]: branch_id
				}
			}
		}
	})
		.then(count => (count == 0 ? (branchInJob = false) : (branchInJob = true)))
		.catch(err => errors.push(err));
	return {
		branchInJob,
		errors
	};
};

checkWithdrawalFields = async values => {
	const {
		job_code,
		branch_id,
		po_number,
		staff_code,
		type,
		return_by,
		install_date,
		date,
		has_po
	} = values;
	let errors = [];

	if (!job_code && !po_number) errors.push({ message: "Job code or PO number is required." });
	if (branch_id == null) errors.push({ message: "Branch is required." });
	if (!type) errors.push({ message: "Withdrawal type is required." });
	if (!staff_code) errors.push({ message: "Staff code is required." });
	if (!date) errors.push({ message: "Date is required." });
	if (type == "INSTALLATION" && !install_date)
		errors.push({ message: "Installation date is required." });
	if (type == "BORROW" && !return_by) errors.push({ message: "Please specify return date." });
	if (!has_po && po_number)
		errors.push({ message: "Cannot specify PO Number to withdrawals without a PO." });

	// check if branch is in the specified PO (if any)
	if (po_number) {
		const branchInPO = await validation.checkBranchInPo(branch_id, po_number);
		if (!branchInPO) {
			errors.push({ message: "This branch is not associated with this PO" });
			return;
		}
	}
	// check if branch is in the specified job (if any)
	if (job_code) {
		const branchInJob = await validation.checkBranchInJob(branch_id, job_code);
		if (!branchInJob) {
			errors.push({ message: "This branch is not associated with this job code" });
			return;
		}
	}

	if (errors.length > 0) return errors;
	else return null;
};

checkStatus = async (id, status) => {
	// Check if the withdrawal is pending
	let isEqual = true;
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			if (withdrawal.status != status) {
				isEqual = false;
			}
		})
		.catch(err => (isEqual = false));
	return isEqual;
};

module.exports = {
	checkBranchInJob,
	checkStatus,
	checkBranchInPo,
	checkWithdrawalFields
};
