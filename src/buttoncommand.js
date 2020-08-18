import Command from '@ckeditor/ckeditor5-core/src/command';

export default class ButtonCommand extends Command {
	execute( { label, url } ) {
		const editor = this.editor;

		editor.model.change( writer => {
			// Create a <button> elment with the "name" attribute...
			const button = writer.createElement( 'button', { label: label, url: url } );

			// ... and insert it into the document.
			editor.model.insertContent( button );

			// Put the selection on the inserted element.
			writer.setSelection( button, 'on' );
		} );
	}

	refresh() {













		const getSelectedButtonModelWidget = ( selection ) => {
			const selectedElement = selection.getSelectedElement();

			if ( selectedElement && selectedElement.is( 'button' ) ) {
				return selectedElement;
			}
			return null;
		}

		const model = this.editor.model;
		const selection = model.document.selection;
		const schema = model.schema;
		const isAllowed = schema.checkChild( selection.focus.parent, 'button' );


		const position = selection.getFirstPosition();
		const selectedButton = getSelectedButtonModelWidget( selection );



		this.label = selectedButton ? selectedButton.getAttribute( 'label' ) : null;
		this.url = selectedButton ? selectedButton.getAttribute( 'url' ) : null;

		this.isEnabled = isAllowed;

	}
}
