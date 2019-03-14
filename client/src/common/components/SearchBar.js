import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { setSearchTerm } from "@/actions/report";
import { connect } from "react-redux";

class SearchBar extends React.Component {
	state = {
		term: ""
	};
	render() {
		const { placeholder, setSearchTerm } = this.props;
		const { term } = this.state;
		return (
			<div className="is-flex is-ai-center">
				<input
					className="input"
					placeholder={placeholder ? placeholder : "Search"}
					onChange={e => this.setState({ term: e.target.value })}
				/>
				<button className="button has-ml-05 no-mb" onClick={() => setSearchTerm(term)}>
					<FontAwesomeIcon icon={faSearch} />
				</button>
			</div>
		);
	}
}

const mapDispatchToProps = {
	setSearchTerm
};

export default connect(
	null,
	mapDispatchToProps
)(SearchBar);
