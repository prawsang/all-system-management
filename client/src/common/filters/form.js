import React from "react";

export const Checkbox = ({ label, checked, onChange, disabled }) => (
	<div className="field is-flex is-ai-center no-mb">
		<label className="label">{label}</label>
		<input
			className="checkbox"
			type="checkbox"
			checked={checked}
			onChange={onChange}
			disabled={disabled}
		/>
	</div>
);

export const Date = ({ fromValue, fromOnChange, toValue, toOnChange, label, disabled }) => (
	<div className="field no-mb">
		<div className="is-flex">
			<label className="label">{label}</label>
			<div className="col-6">
				<label className="label">From:</label>
				<input
					className="is-fullwidth"
					type="date"
					value={fromValue}
					onChange={fromOnChange}
					disabled={disabled}
				/>
			</div>
			<div className="col-6">
				<label className="label">From:</label>
				<input
					className="is-fullwidth"
					type="date"
					value={toValue}
					onChange={toOnChange}
					disabled={disabled}
				/>
			</div>
		</div>
	</div>
);

export const Select = ({ options, label, value, onChange, disabled }) => (
	<div className="field no-mb">
		<label className="label">{label}</label>
		<div className="select">
			<select value={value} onChange={onChange} disabled={disabled}>
				<option value={null}>-- Select --</option>
				{options.map((e, i) => (
					<option value={e.value}>{e.name}</option>
				))}
			</select>
		</div>
	</div>
);
