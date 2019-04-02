import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import Menu from "./Menu";

class Nav extends React.Component {
	state = {
		showUserMenu: false,
		showSidebar: false
	};
	render() {
		const { showUserMenu, showSidebar } = this.state;
		return (
			<React.Fragment>
				<nav>
					<div className="container is-flex is-jc-space-between">
						<div
							className="nav-item is-clickable"
							onClick={() => this.setState({ showSidebar: true })}
						>
							<p>
								<FontAwesomeIcon className="icon" icon={faBars} />
							</p>
						</div>
						<div className="nav-item is-clickable">
							<p onClick={() => this.setState({ showUserMenu: !showUserMenu })}>
								<FontAwesomeIcon className="icon has-mr-05" icon={faUser} />
								Prawsang
								<FontAwesomeIcon
									className="icon has-ml-05"
									icon={showUserMenu ? faAngleUp : faAngleDown}
								/>
							</p>
							<div
								className={`menu dropdown is-right panel ${showUserMenu ||
									"is-hidden"}`}
							>
								{/* <span className="list-item is-clickable">ข้อมูลผู้ใช้</span> */}
								<span className="list-item is-clickable">Log out</span>
							</div>
						</div>
					</div>
				</nav>
				<Menu active={showSidebar} close={() => this.setState({ showSidebar: false })} />
			</React.Fragment>
		);
	}
}

export default Nav;
