import React from 'react';
import ChipInput from 'material-ui-chip-input';

const renderChip = ({input, hintText, floatingLabelText, data}) => (
  <ChipInput
	openOnFocus={true}
	fullWidth={true}
	dataSource={data}
	dataSourceConfig={{text: "text", value: "value"}}
	{...input}
	value = { input.value || []}
	onRequestAdd={(addedChip) => {
	  let values = input.value || [];
	  values = values.slice();
	  values.push(addedChip);
	  input.onChange(values);
	}}
	onRequestDelete={(deletedChip) => {
		let values = input.value || [];

		values = values.filter(v => v.value !== deletedChip);
		input.onChange(values);
	}}
	onBlur={() => input.onBlur()}
	hintText={hintText}
	floatingLabelText={floatingLabelText}
  />
);

export default renderChip;