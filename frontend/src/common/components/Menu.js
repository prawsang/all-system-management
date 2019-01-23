import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faReceipt, faListUl, faArrowAltCircleUp, faArrowAltCircleDown, faEdit, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

class Menu extends React.Component {
	state = {
		showReportMenu: false,
		showEditMenu: false
	};
	render() {
		const { showReportMenu, showEditMenu } = this.state;
		return (
			<div className="side-bar">
				<div className="side-bar-head is-ta-center">
					<small className="is-6 is-bold">All System Corporation</small>
				</div>
				<ul className="side-bar-menu">
					<li 
						className="side-bar-menu-item is-clickable is-active is-flex is-jc-space-between" 
						onClick={e => this.setState({ 
							showReportMenu: !showReportMenu,
							showEditMenu: false
						})}
					>
						<div>
							<FontAwesomeIcon className="icon has-mr-05" icon={faTable} />
							รายงาน
						</div>
						<FontAwesomeIcon className="icon has-mr-05" icon={showReportMenu ? faAngleLeft : faAngleRight} />
						<ul className={`panel menu dropright ${showReportMenu || "is-hidden"}`}>
							<li className="list-item is-clickable">PO ทั้งหมด</li>
							<li className="list-item is-clickable">การติดตั้งที่ยังไม่ได้รับ PO</li>
							<li className="list-item is-clickable">สาขาที่ยังไม่ได้ติดตั้ง</li>
							<li className="list-item is-clickable">ของเสีย</li>
							<li className="list-item is-clickable">ของยืม</li>
							<li className="list-item is-clickable">ยังไม่ได้วางบิล</li>
							<li className="list-item is-clickable">จำนวน stock คงเหลือ</li>
						</ul>
					</li>
					<li className="side-bar-menu-item is-clickable">
						<FontAwesomeIcon className="icon has-mr-05" icon={faListUl} />
						ปรับปรุงรายการ
					</li>
					<li className="side-bar-menu-item is-clickable">
						<FontAwesomeIcon className="icon has-mr-05" icon={faReceipt} />
						บันทึกใบสั่งซื้อ (PO)
					</li>
					<li className="side-bar-menu-item is-clickable">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleUp} />
						เบิกสินค้า
					</li>
					<li className="side-bar-menu-item is-clickable">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleDown} />
						รับของเข้า Stock
					</li>
					<li 
						className="side-bar-menu-item is-clickable is-flex is-jc-space-between" 
						onClick={e => this.setState({ 
							showReportMenu: false,
							showEditMenu: !showEditMenu
						})}
					>
						<div>
							<FontAwesomeIcon className="icon has-mr-05" icon={faEdit} />
							ดู/แก้ไขข้อมูล
						</div>
						<FontAwesomeIcon className="icon has-mr-05" icon={showEditMenu ? faAngleLeft : faAngleRight} />
						<ul className={`panel menu dropright ${showEditMenu || "is-hidden"}`}>
							<li className="list-item is-clickable">ข้อมูลลูกค้า</li>
							<li className="list-item is-clickable">Store Type</li>
							<li className="list-item is-clickable">รุ่นสินค้า</li>
						</ul>
					</li>
				</ul>
			</div>
		);
	}
}

export default Menu;
