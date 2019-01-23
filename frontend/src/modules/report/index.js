import React from "react";
import Table from './components/Table';

class Report extends React.Component {
    state = {
        entriesPerPage: 1
    }
	render() {
		return (
			<div className="content">
				<h3>สาขาที่ยังไม่ได้ติดตั้ง</h3>
				<div className="panel">
                    <Table/>
				</div>
			</div>
		);
	}
}

export default Report;
