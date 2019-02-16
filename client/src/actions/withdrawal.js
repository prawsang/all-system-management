import { SET_CURRENT_WITHDRAWAL, SET_ITEMS } from "@/common/action-types";

export const setCurrentWithdrawal = data => ({
	type: SET_CURRENT_WITHDRAWAL,
	payload: {
		data
	}
});

export const setItems = data => {
	const items = {
		pos: [],
		scanners: [],
		monitors: [],
		keyboards: [],
		cashDrawers: [],
		printers: []
	};
	data.forEach(e => {
		switch (e.model.type) {
			case "POS":
				items.pos.push(e);
				break;
			case "SCANNER":
				items.scanners.push(e);
				break;
			case "MONITOR":
				items.monitors.push(e);
				break;
			case "KEYBOARD":
				items.keyboards.push(e);
				break;
			case "CASH_DRAWER":
				items.cashDrawers.push(e);
				break;
			case "PRINTER":
				items.pritners.push(e);
				break;
			default:
				break;
		}
	});
	return {
		type: SET_ITEMS,
		payload: {
			items
		}
	};
};
