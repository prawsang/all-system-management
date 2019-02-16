import { combineReducers } from "redux";
import report from "./report";
import record from "./record";
import withdrawal from "./withdrawal";

export default combineReducers({
	report,
	record,
	withdrawal
});
