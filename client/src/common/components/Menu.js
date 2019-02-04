import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTable,
	faReceipt,
	faListUl,
	faArrowAltCircleUp,
	faArrowAltCircleDown,
	faEdit,
	faAngleLeft,
	faAngleRight,
	faTimes
} from "@fortawesome/free-solid-svg-icons";
import history from "@/common/history";
import logo from "@/assets/logo.png";

class Menu extends React.Component {
	state = {
		showReportMenu: false,
		showEditMenu: false
	};
	render() {
		const { showReportMenu, showEditMenu } = this.state;
		const { active, close } = this.props;
		return (
			<div className={`side-bar ${active && "is-active"}`}>
				<button
					className="button is-light has-mt-10 has-ml-10 is-hidden-desktop"
					onClick={close}
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
				<div className="side-bar-head is-ta-center">
					<img
						src={logo}
						alt="logo"
						// className="is-hidden-mobile"
						style={{
							width: 70,
							height: "auto",
							display: "block",
							margin: "auto",
							marginBottom: 10
						}}
					/>
					<small className="is-6 is-bold">All System Corporation</small>
				</div>
				<ul className="side-bar-menu">
					<li
						className="side-bar-menu-item is-clickable"
						onClick={e =>
							this.setState({
								showReportMenu: !showReportMenu,
								showEditMenu: false
							})
						}
					>
						<div className="is-active is-flex is-jc-space-between">
							<div>
								<FontAwesomeIcon className="icon has-mr-05" icon={faTable} />
								รายงาน
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showReportMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
						<ul className={`panel menu dropright ${showReportMenu || "is-hidden"}`}>
							<Link link="/report/all-po">PO ทั้งหมด</Link>
							<Link link="/report/install-wo-po">การติดตั้งที่ยังไม่ได้รับ PO</Link>
							<Link link="/report/branch-no-install">สาขาที่ยังไม่ได้ติดตั้ง</Link>
							<Link link="/report/broken">ของเสีย</Link>
							<Link link="/report/borrowed">ของยืม</Link>
							<Link link="/report/all-po">ยังไม่ได้วางบิล</Link>
							<Link link="/report/in-stock">Stock คงเหลือ</Link>
						</ul>
					</li>
					<SideBarLink link="/record/edit-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faListUl} />
						ปรับปรุงรายการ
					</SideBarLink>
					<SideBarLink link="/record/po">
						<FontAwesomeIcon className="icon has-mr-05" icon={faReceipt} />
						บันทึกใบสั่งซื้อ (PO)
					</SideBarLink>
					<SideBarLink link="/record/withdraw-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleUp} />
						เบิกสินค้า
					</SideBarLink>
					<SideBarLink link="/record/add-items">
						<FontAwesomeIcon className="icon has-mr-05" icon={faArrowAltCircleDown} />
						รับของเข้า Stock
					</SideBarLink>
					<li
						className="side-bar-menu-item is-clickable"
						onClick={e =>
							this.setState({
								showReportMenu: false,
								showEditMenu: !showEditMenu
							})
						}
					>
						<div className=" is-flex is-jc-space-between">
							<div>
								<FontAwesomeIcon className="icon has-mr-05" icon={faEdit} />
								ดู/แก้ไขข้อมูล
							</div>
							<FontAwesomeIcon
								className="icon has-mr-05"
								icon={showEditMenu ? faAngleLeft : faAngleRight}
							/>
						</div>
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

const Link = props => {
	return (
		<li className="list-item is-clickable" onClick={() => history.push(props.link)}>
			{props.children}
		</li>
	);
};
const SideBarLink = props => {
	return (
		<li className="side-bar-menu-item is-clickable" onClick={() => history.push(props.link)}>
			{props.children}
		</li>
	);
};

export default Menu;
