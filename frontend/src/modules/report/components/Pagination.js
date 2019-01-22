import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

class Pagination extends React.Component {
	render() {
		return (
			<div className="buttons no-mb">
				<button className="button is-light" disabled>
					<FontAwesomeIcon icon={faAngleLeft} />
				</button>
				<button className="button">1</button>
				<button className="button is-light">2</button>
				<button className="button is-light">3</button>
				<button className="button is-light">
					<FontAwesomeIcon icon={faAngleRight} />
				</button>
			</div>
		);
	}
}

export default Pagination;
