// button/button.js

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ButtonEditing from './buttonediting';
import ButtonUI from './buttonui';

export default class Button extends Plugin {
	static get requires() {
		return [ ButtonEditing, ButtonUI ];
	}
}
