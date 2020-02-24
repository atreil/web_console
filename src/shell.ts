import {Terminal} from "./terminal"

export class Shell {
    // Terminal to read/write to.
    private term: Terminal;

    // The current line that the user is editing.
    private register: Array<string>;

    // The index into register to insert new characters
    private cursorIndex: number;

    // If the cursor should be visible.
    private cursorVisible: boolean;

    // A string to prefix to the active line.
    private activeLinePrefix: string;

    // A map of key names to keyboard event handlers.
    private editFns: {[key: string]: (ev: KeyboardEvent) => void};

    // A queue of lines to be read by programs.
    private consumerBuffer: Array<string>;


    public constructor(term: Terminal) {
        this.term = term;
        this.editFns = {
            "Backspace": (ev) => this.backspaceEditFn(ev),
            "Enter": (ev) => this.enterEditFn(ev),
        }
        this.register = new Array<string>();
        this.cursorIndex = 0;
        this.cursorVisible = true;
        this.activeLinePrefix = "> ";
        this.consumerBuffer = new Array<string>();
        setInterval(() => {
            this.term.setCursorVisiblity(this.cursorVisible);
            this.cursorVisible = !this.cursorVisible;
        }, 750);
        this.updateActiveLine();
    }

    public onKeyDownCallback(ev: KeyboardEvent) {
        console.debug(`received '${ev}'`);
        var key = ev.key;

        if (this.editFns.hasOwnProperty(key)) {
            this.editFns[key](ev);
        } else if (key.length == 1) {
            this.register.splice(this.cursorIndex, 0, key);
            this.cursorIndex++;
            this.updateActiveLine();
        }
    }

    private buildRegister(withoutPrefix = false): string {
        var built = this.register.join("");
        if (withoutPrefix) {
            return built;
        }
        return this.activeLinePrefix + built;
    }

    private backspaceEditFn(ev: KeyboardEvent) {
        if (this.cursorIndex == 0) {
            return;
        }
        this.cursorIndex--;
        this.register.splice(this.cursorIndex, 1);
        this.updateActiveLine();
    }

    private updateActiveLine() {
        this.term.setCursorIndex(this.cursorIndex + this.activeLinePrefix.length);
        this.term.setActiveLine(this.buildRegister());
        this.term.setCursorVisiblity(this.cursorVisible);
    }

    private enterEditFn(ev: KeyboardEvent) {
        var currRegister = this.buildRegister(true);
        this.consumerBuffer.push(currRegister);
        this.term.writeLine(currRegister);

        this.cursorIndex = 0;
        this.register = new Array<string>();
        this.updateActiveLine();
    }
}