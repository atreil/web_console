/**
 * This class provides a terminal-like interface for programs to read from and
 * write to.
 */
export class Terminal {
    // The div element for the console.
    private consoleArea: HTMLDivElement;

    // Index of the cursor.
    private cursorIndex: number;

    // The current line that the user is editing.
    private activeLine: string;

    public constructor() {
        this.activeLine = "";
        this.cursorIndex = 0;
        this.consoleArea = document.createElement("div");
        this.consoleArea.setAttribute("id", "console-area");
        document.body.appendChild(this.consoleArea);

        var activeLineElt = document.createElement("div");
        activeLineElt.setAttribute("id", "active-line");
        this.consoleArea.appendChild(activeLineElt);
    }

    /**
     * Writes a line to the buffer and displays it.
     * @param line The line to write to the buffer.
     */
    public writeLine(line: string) {
        this.newLine(line);
    }

    public setActiveLine(line: string) {
        this.updateActiveLine(this.activeLineString(line));
    }

    public activeLineString(line: string): string {
        return `> ${line}`;
    }

    private newLine(line: string) {
        // create a new line element with the text
        var newArchivedLine = document.createElement("div");
        newArchivedLine.setAttribute("class", "archived-line");
        newArchivedLine.setAttribute("class", "line");
        newArchivedLine.appendChild(document.createTextNode(line));

        // insert before the active line
        // we could probably be more effecient by separating the areas
        // for the active line and archived lines.
        var activeLine = this.consoleArea.querySelector("#active-line");
        this.consoleArea.insertBefore(newArchivedLine, activeLine);
    }

    private updateActiveLine(line: string) {
        // We use text nodes as children instead of innerHTML. Because of this
        // we need to remove all the children of the active line, and then
        // create a new one.
        //
        // This could get inefficient if there are too many children, but we
        // don't expect any more than three children.

        // split the text based on the cursor position
        var leftText = line.slice(0, this.cursorIndex);
        var rightText = line.slice(this.cursorIndex);
        var cursorElt = document.createElement("div");
        cursorElt.setAttribute("id", "cursor");

        // create the new element and remove the existing one
        var activeLineElt = <HTMLDivElement>this.consoleArea.
            querySelector("#active-line");
        while (activeLineElt.firstChild) {
            activeLineElt.removeChild(activeLineElt.firstChild);
        }

        // add the new line
        activeLineElt.appendChild(document.createTextNode(leftText));
        activeLineElt.appendChild(document.createTextNode(leftText));
        activeLineElt.appendChild(document.createTextNode(leftText));
    }
}