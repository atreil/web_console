import {Terminal} from "./terminal"

export class Shell {
    // Terminal to read/write to.
    private term: Terminal;

    // The current line that the user is editing.
    private register: Array<string>;

    // The index into register to insert new characters
    private cursorIndex: number;

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
        this.consumerBuffer = new Array<string>();
    }

    public onKeyDownCallback(ev: KeyboardEvent) {
        console.debug(`received '${ev}'`);
        var key = ev.key;

        if (this.editFns.hasOwnProperty(key)) {
            this.editFns[key](ev);
        } else if (key.length == 1) {
            this.register.splice(this.cursorIndex, 0, key);
            this.cursorIndex++;
            this.term.setActiveLine(this.buildRegister());
        }
    }

    private buildRegister(): string {
        return this.register.join("");
    }

    private backspaceEditFn(ev: KeyboardEvent) {
        if (this.cursorIndex == 0) {
            return;
        }
        this.cursorIndex--;
        this.register.splice(this.cursorIndex, 1);
    }

    private enterEditFn(ev: KeyboardEvent) {
        var currRegister = this.buildRegister();
        this.consumerBuffer.push(currRegister);
        this.term.writeLine(currRegister);
        this.term.setActiveLine("");
        this.register = new Array<string>();
    }
}