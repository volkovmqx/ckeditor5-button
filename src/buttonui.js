import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import buttonIcon from '../theme/icons/plus-circle-solid.svg';

import ButtonpickerView from './ui/buttonpicker';

import {
	createDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

export default class ButtonUI extends Plugin {
	init() {
		const editor = this.editor;
		const command = editor.commands.get( 'button' );

		editor.ui.componentFactory.add( 'button', locale => {
			const dropdown = createDropdown( locale );
			const datepickerForm = new ButtonpickerView( getFormValidators(), editor.locale );

			this._setUpDropdown( dropdown, command, datepickerForm, editor );
			this._setUpForm( dropdown, datepickerForm, command );

			return dropdown;
		} );
	}

	_setUpDropdown( dropdown, command, buttonpicker ) {
		const editor = this.editor;
		const button = dropdown.buttonView;
		dropdown.panelView.children.add( buttonpicker );

		button.set( {
			label: 'Insert Button',
			icon: buttonIcon,
			tooltip: true
		} );

		// Note: Use the low priority to make sure the following listener starts working after the
		// default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
		// invisible form/input cannot be focused/selected.
		button.on( 'open', () => {
			// Make sure that each time the panel shows up, the URL field remains in sync with the value of
			// the command. If the user typed in the input, then canceled (`InputView#inputView#value` stays
			// unaltered) and re-opened it without changing the value of the media command (e.g. because they
			// didn't change the selection), they would see the old value instead of the actual value of the
			// command.
			buttonpicker.label = command.label || '';
			buttonpicker.url = command.url || '';
			buttonpicker.InputView.inputView.select();
			buttonpicker.focus();
		}, {
			priority: 'low'
		} );

		dropdown.on( 'submit', () => {
			if ( buttonpicker.isValid() ) {
				editor.execute( 'button', {
					label: buttonpicker.label,
					url: buttonpicker.url
				} );
				editor.editing.view.focus();
				closeUI();
			}
		} );

		dropdown.on( 'change:isOpen', () => buttonpicker.resetFormStatus() );
		dropdown.on( 'cancel', () => closeUI() );

		function closeUI() {
			editor.editing.view.focus();
			dropdown.isOpen = false;
		}
	}
	_setUpForm( dropdown, buttonpicker, command ) {
		buttonpicker.delegate( 'submit', 'cancel' ).to( dropdown );
		buttonpicker.InputView.bind( 'label' ).to( command, 'label' );
		buttonpicker.InputView.bind( 'url' ).to( command, 'url' );
	}
}

function getFormValidators() {
	return [
		buttonpicker => {
			if ( !buttonpicker.label.length ) {
				return 'Button must not be empty';
			}
		}
	];
}
