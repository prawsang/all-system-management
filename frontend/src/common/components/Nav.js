import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faUser } from "@fortawesome/free-solid-svg-icons";

class Nav extends React.Component {
	state = {
		showUserMenu: false
	};
	render() {
		const { showUserMenu } = this.state;
		return (
			<nav>
				<div className="container is-flex is-jc-flex-end">
					<div className="nav-item is-clickable">
						<p onClick={() => this.setState({ showUserMenu: !showUserMenu })}>
							<FontAwesomeIcon className="icon has-mr-05" icon={faUser} />
							Prawsang
							<FontAwesomeIcon className="icon has-ml-05" icon={showUserMenu ? faAngleUp : faAngleDown} />
						</p>
						<div className={`nav-menu panel ${showUserMenu || "is-hidden"}`}>
							<span className="list-item is-clickable">ข้อมูลผู้ใช้</span>
							<span className="list-item is-clickable">Log out</span>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

export default Nav;
