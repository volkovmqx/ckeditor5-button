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
			inheritAllFrom: '$text',

			// Allow wherever text is allowed:
			allowWhere: '$block',

			// The button can have many types, like date, name, surname, etc:
			allowAttributes: [ 'label', 'url' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'button',
			view: createButtonViewWithLink
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'button',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const widgetElement = createButtonView( modelElement, viewWriter );


				return toWidget( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'a',
				classes: [ 'btn', 'btn-es' ],
				target: '_blank'
			},
			model: ( viewElement, modelWriter ) => {
				// Extract the "name" from "{name}".

				let label = viewElement.getChild( 0 ).data;
				let url = viewElement.getAttribute("href");

				return modelWriter.createElement( 'button', { label, url } );
			}
		});

		// // Helper methods
		function createButtonView( modelElement, viewWriter ) {
			const label = modelElement.getAttribute( 'label' );
			const buttonView = viewWriter.createContainerElement( 'a', {
				class: 'btn btn-es',
			});

			const innerText = viewWriter.createText(label);

			viewWriter.insert( viewWriter.createPositionAt( buttonView, 0 ), innerText );

			return buttonView;
		}
		function createButtonViewWithLink( modelElement, viewWriter ) {
			const label = modelElement.getAttribute( 'label' );
			let url = modelElement.getAttribute( 'url' );
			if(url === "") {
				url = "#affiliate-link";
			}
			const buttonView = viewWriter.createContainerElement( 'a', {
				class: 'btn btn-es',
				target: '_blank',
				href: url
			});

			// Insert the button name (as a text).

			const innerText = viewWriter.createText(label);

			viewWriter.insert( viewWriter.createPositionAt( buttonView, 0 ), innerText );

			return buttonView;
		}
	}


}
