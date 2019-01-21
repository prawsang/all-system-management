import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faListUl } from "@fortawesome/free-solid-svg-icons";

class Menu extends React.Component {
	render() {
		return (
			<div className="side-bar">
				<div className="side-bar-head is-ta-center">
                    <small className="is-6 is-bold">All System Corporation</small>
                </div>
				<ul className="side-bar-menu">
					<li className="side-bar-menu-item is-active">
						<FontAwesomeIcon className="icon is-before" icon={faTable} />
						รายงาน
					</li>
                    <li className="side-bar-menu-item is-clickable">
						<FontAwesomeIcon className="icon is-before" icon={faListUl} />
						แก้ไขรายการ
					</li>
				</ul>
			</div>
		);
	}
}

export default Menu;
