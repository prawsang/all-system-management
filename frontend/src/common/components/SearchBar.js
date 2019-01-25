import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => (
	<div className="is-flex is-ai-center">
		<input className="input" placeholder="Search" />
		<button className="button has-ml-05 no-mb">
			<FontAwesomeIcon icon={faSearch} />
		</button>
	</div>
);

export default SearchBar;
