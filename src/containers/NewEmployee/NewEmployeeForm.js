import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import { reduxForm, Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton } from 'material-ui/RadioButton';
import ChipInput from 'material-ui-chip-input';
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui'


const renderChip = ({input, hintText, floatingLabelText}) => (
  <ChipInput
	openOnFocus={true}
	fullWidth={true}
	dataSource={['foo', 'bar']}
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
	  values = values.filter(v => v !== deletedChip);
	  input.onChange(values);
	}}
	onBlur={() => input.onBlur()}
	hintText={hintText}
	floatingLabelText={floatingLabelText}
  />
);

class MyForm extends Component {

	renderDropzoneInput(field){
		const files = field.input.value;
		let preview = "/static/img/avatar.png";
		try{
			preview = files[0].preview;
		}catch(e){}
		return (
		<div>
		  <Dropzone
			name={field.name}
			onDrop={( filesToUpload, e ) => {
				field.input.onChange(filesToUpload);
				console.log(filesToUpload);
			}}>
				<img style={{width: "100%", height: "100%"}} src={preview} className="uk-border-rounded" />

		  </Dropzone>
		</div>
	  );
	}
	constructor(props){
		super(props);
		this.state = {img:"/static/img/avatar.png"};
		this.onDrop = this.onDrop.bind(this);
		this.renderDropzoneInput = this.renderDropzoneInput.bind(this);
	}
	onDrop(files){
		console.log(files);
		this.setState({img: files[0].preview});
	}

  render() {
	return (
		<form onSubmit={this.props.handleSubmit}>
		<div className="uk-grid uk-margin-small-top">
			<div className="uk-width-2-5" />
			<div style={{textAlign: "center"}} className="uk-width-1-5">
				<Field name="img" component={this.renderDropzoneInput} />
				<button type="submit">send</button>
			</div>
		</div>
		</form>

	)
  }
}

// Decorate with redux-form
MyForm = reduxForm({
  form: 'myForm',
  enableReinitialize: true
})(MyForm)

export default MyForm