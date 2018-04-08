describe("smart-indent", function () {

	var editor;
	var editorView;

	beforeEach(function () {
		waitsForPromise(function () {
			return atom.workspace.open('test');
		});

		waitsForPromise(function () {
			return atom.packages.activatePackage("smart-indent");
		});

		runs(function () {
			editor = atom.workspace.getActiveTextEditor();
			editor.setText("");
			editorView = atom.views.getView(editor);

			editor.update({
				autoIndent: true,
				softTabs: false,
				tabLength: 2
			});
		});
	});

	it("smart indents if new prev line's identation level is the same", function () {
		editor.setText("\t\t    test");
		editor.moveToEndOfLine();
		atom.commands.dispatch(editorView, 'editor:newline');

		expect(editor.getText()).toBe("\t\t    test\n\t\t    ");
	});


	it("smart idents if previous line align spaces count don't divide by tabLength", function () {
		editor.setText("\t\t   test");
		editor.moveToEndOfLine();
		atom.commands.dispatch(editorView, 'editor:newline');

		expect(editor.getText()).toBe("\t\t   test\n\t\t   ");
	});

	it("ignores alignment when indent level will be increased", function () {
		waitsForPromise(function () {
			return atom.packages.activatePackage('language-javascript')
			.then(function() {
				atom.grammars.assignLanguageMode(editor, 'source.js');

				editor.update({
					autoIndent: true,
					softTabs: false,
					tabLength: 2
				});

				editor.setText("if (ceva &&\n\t\t    altceva) {");
				editor.moveToEndOfLine();
				atom.commands.dispatch(editorView, 'editor:newline');

				expect(editor.getText()).toBe("if (ceva &&\n\t\t    altceva) {\n\t\t\t");
			});
		});
	});

});
