import {Shell} from "./shell"
import {Terminal} from "./terminal"

var term = new Terminal();
var sh = new Shell(term);
document.onkeydown = (ev) => sh.onKeyDownCallback(ev);