import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

class SearchField extends React.Component {
	state = {
		data: null,
		focusButton: false
	};
	handleSearch() {
		const { searchUrl, searchTerm, searchName } = this.props;
		if (searchTerm.length < 3) {
			this.setState({ data: { customers: null } });
		} else {
			Axios.get(`${searchUrl}?search=${searchName}&search_term=${searchTerm}`)
				.then(res => {
					this.setState({ data: res.data });
					console.log(res);
				})
				.catch(err => console.log(err));
		}
	}
	handleKeyPress(e) {
		if (e.key === "Enter") {
			this.handleSearch();
		}
	}
	// componentDidUpdate(prevProps, prevState) {
	// 	if (prevProps !== this.props) {
	// 		if (prevProps.searchUrl !== this.props.searchUrl) {
	// 			this.handleSearch();
	// 		}
	// 	}
	// }
	render() {
		const { value, onChange, placeholder, list, showResults, hideResults } = this.props;
		const { data, focusButton } = this.state;
		return (
			<div className="field" onFocus={showResults}>
				<div className="is-flex">
					<input
						className="input is-flex-fullwidth"
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						onKeyPress={e => this.handleKeyPress(e)}
					/>
					<button
						className="button has-ml-05"
						type="button"
						onClick={() => this.handleSearch()}
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
					{list(data)}
				</div>
			</div>
		);
	}
}

export default SearchField;
