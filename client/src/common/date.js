import moment from "moment";

export const formatDate = date => {
	if (!date || date === "") return "-";
	return moment(date).format("D/M/YYYY");
};
