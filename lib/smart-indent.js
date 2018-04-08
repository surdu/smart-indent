var defaultFunction;

/**
 * It extracts the alignment spaces and calculates how many tabs they represent
 * in addition to the leading tabs from a line of text
 * @param  {String}  text      the line containing the indentation string
 * @param  {Integer} tabLength the size of a tab is spaces
 * @return {Float}
 */
function getIntentLevel(text, tabLength) {
	const intentMatch = text.match(/^\t*( +)/);
	const spaces = intentMatch[1];
	const spacesLevel = spaces.length / tabLength;

	return (intentMatch[0].length - spaces.length) + spacesLevel;
}

function getAlignedIndent(string) {
	  return string.match(/^\t*( +)/);
}

module.exports = {
	activate: function() {
		atom.workspace.observeTextEditors(function(editor) {
			if (!defaultFunction) {
				defaultFunction = editor.setIndentationForBufferRow;
			}

			editor.setIndentationForBufferRow = function(bufferRow, newLevel, {preserveLeadingWhitespace} = {}) {
				var newIndentString = this.buildIndentString(newLevel);
				var endColumn;

				if (preserveLeadingWhitespace) {
					endColumn = 0;
				}
				else {
				 endColumn = this.lineTextForBufferRow(bufferRow).match(/^\s*/)[0].length;
				}

				if (!this.getSoftTabs()) {
					const prevLine = this.lineTextForBufferRow(bufferRow - 1);
					const prevLineIndentMatch = getAlignedIndent(prevLine);

					if (prevLineIndentMatch !== null) {
						const prevLineLevel = getIntentLevel(prevLine, this.getTabLength());
						const prevLineIndent = prevLineIndentMatch[0];

						if (newLevel > prevLineLevel) {
							const indentDelta = newLevel - prevLineLevel;
							const prevLineIndentTabsOnly = prevLineIndent.replace(/ /g, "");
							newIndentString = this.buildIndentString(prevLineIndentTabsOnly.length + indentDelta);
						}
						else {
							newIndentString = prevLineIndent;
						}
					}
				}

				return this.buffer.setTextInRange([[bufferRow, 0], [bufferRow, endColumn]], newIndentString);
			};
		});
	},

	deactivate: function () {
		atom.workspace.observeTextEditors(function(editor) {
			if (defaultFunction) {
				editor.setIndentationForBufferRow = defaultFunction;
			}
		});
	}

};
