import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

class Pagination extends React.Component {
	renderPageNumbers = (totalPages) =>
		new Array(totalPages).fill().map((e, i) => (
			<button className="button is-light" key={i}>
				{i + 1}
			</button>
		));

	render() {
		const { totalPages } = this.props;
		return (
			<div className="buttons no-mb">
				<button className="button is-light" disabled>
					<FontAwesomeIcon icon={faAngleLeft} />
				</button>
				{this.renderPageNumbers(totalPages)}
				<button className="button is-light">
					<FontAwesomeIcon icon={faAngleRight} />
				</button>
			</div>
		);
	}
}

export default Pagination;
