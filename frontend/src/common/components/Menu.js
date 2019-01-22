import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faReceipt, faListUl, faArrowAltCircleUp, faArrowAltCircleDown, faEdit } from "@fortawesome/free-solid-svg-icons";

class Menu extends React.Component {
	render() {
		return (
			<div className="side-bar">
				<div className="side-bar-head is-ta-center">
					<small className="is-6 is-bold">All System Corporation</small>
				</div>
				<ul className="side-bar-menu">
					<li className="side-bar-menu-item is-clickable is-active">
						<FontAwesomeIcon className="icon has-mr-05" icon={faTable} />
						รายงาน
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
					<li className="side-bar-menu-item is-clickable">
						<FontAwesomeIcon className="icon has-mr-05" icon={faEdit} />
						ดู/แก้ไขข้อมูล
					</li>
				</ul>
			</div>
		);
	}
}

export default Menu;
