import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// MODIFIED
import {
	toWidget,
	viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import ButtonCommand from './buttoncommand';

import '../theme/button.css';

export default class ButtonEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'button', new ButtonCommand( this.editor ) );

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'button' ) )
		);
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'button', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// The button will act as an inline node:
			isInline: true,

			// The inline widget is self-contained so it cannot be split by the caret and it can be selected:
			isObject: true,

			// The button can have many types, like date, name, surname, etc:
			allowAttributes: [ 'label', 'url' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: [ 'button' ]
			},
			model: ( viewElement, modelWriter ) => {
				// Extract the "name" from "{name}".
				const data = viewElement.getChild( 0 ).data;
				let label = "";
				let url = "";
				if(data.indexOf(' [') !== -1) {
					label = data.slice( 3 );
				}
				else {
					label = data.slice( 3, data.indexOf(' [') );
					url = data.slice(data.indexOf(' ['), data.indexOf(']')  )
				}
				return modelWriter.createElement( 'button', { label, url } );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'button',
			view: ( modelItem, viewWriter ) => {
				const widgetElement = createButtonView( modelItem, viewWriter );

				// Enable widget handling on a button element inside the editing view.
				return toWidget( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'button',
			view: createButtonView
		} );

		// Helper method for both downcast converters.
		function createButtonView( modelItem, viewWriter ) {
			const label = modelItem.getAttribute( 'label' );
			const url = modelItem.getAttribute( 'url' );

			const buttonView = viewWriter.createContainerElement( 'span', {
				class: 'button',
				'data-label': label,
				'data-url': url
			});

			// Insert the button name (as a text).
			let innerText = ''
			if(url === '') {
				innerText = viewWriter.createText( '🔳 ' + label);
			}
			else {
				innerText = viewWriter.createText( '🔳 ' + label + ' [' + url +']' );
			}
			viewWriter.insert( viewWriter.createPositionAt( buttonView, 0 ), innerText );

			return buttonView;
		}
	}
}
