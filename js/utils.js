/* ─── Utilities: Cursor & Input Helpers ─── */

const password = "helloworld";
let cursor;

/**
 * Initialize cursor position on page load.
 */
window.addEventListener("DOMContentLoaded", function () {
    cursor = document.getElementById("cursor");
    if (cursor) {
        cursor.style.left = "0px";
    }
});

/**
 * Strip newlines from text.
 */
function nl2br(txt) {
    return txt.replace(/\n/g, "");
}

/**
 * Mirror textarea value to visible typer element.
 * Called by inline onkeyup/onkeydown/onkeypress on the textarea.
 */
function typeIt(from, e) {
    e = e || window.event;
    const w = document.getElementById("typer");
    const tw = from.value;
    if (!pw) {
        w.innerHTML = nl2br(tw);
    }
}

/**
 * Move cursor left/right based on arrow key input.
 */
function moveIt(count, e) {
    e = e || window.event;
    const keycode = e.keyCode || e.which;
    if (!cursor) return;

    const charWidth = 9.6;
    if (keycode === 37 && parseInt(cursor.style.left) >= 0 - (count - 1) * charWidth) {
        cursor.style.left = parseInt(cursor.style.left) - charWidth + "px";
    } else if (keycode === 39 && parseInt(cursor.style.left) + charWidth <= 0) {
        cursor.style.left = parseInt(cursor.style.left) + charWidth + "px";
    }
}
