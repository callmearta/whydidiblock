document.addEventListener("DOMNodeInserted", domChangeHandler, false);

const lsHandler = {
    set: function(userId, content) {
        if (!this.initialized) this.init();
        const data = window.localStorage.getItem("arta-stickynotes");
        const parsed = JSON.parse(data);
        const targetUserId = parsed.find(item => item.userId == userId);
        if (targetUserId) {
            targetUserId.content = content;
        } else {
            const newContent = {
                userId: userId,
                content: content
            };
            parsed.push(newContent);
        }
        window.localStorage.setItem("arta-stickynotes", JSON.stringify(parsed));
    },
    get: function(userId) {
        const data = window.localStorage.getItem("arta-stickynotes");
        const parsed = JSON.parse(data);
        const entry = parsed.find(i => i.userId == userId);
        return entry;
    },
    initialized: function() {
        if (window.localStorage.getItem('arta-stickynotes')) return true;
        return false;
    },
    init: function() {
        if (window.localStorage.getItem("arta-stickynotes")) return;
        window.localStorage.setItem('arta-stickynotes', JSON.stringify([]));
    }
};

function domChangeHandler() {
    const followBtn = document.querySelector('div[data-testid="placementTracking"] div[data-testid]');
    const hasAlreadyAdded = document.querySelector('.arta-stickynote');
    if (!followBtn || hasAlreadyAdded) return;
    const userId = followBtn.dataset.testid.split('-')[0];
    const userNameDiv = document.querySelector('div[data-testid="UserName"]');
    insertNotes(userId, userNameDiv);
}

function insertNotes(userId, userNameDiv) {
    lsHandler.init();
    const stickyNoteWrapper = document.createElement("div");
    stickyNoteWrapper.classList.add("arta-stickynote");
    const stickyNoteInner = document.createElement("p");
    stickyNoteInner.contentEditable = true;
    const existingContent = lsHandler.get(userId);
    if (existingContent && existingContent.content.length) {
        stickyNoteInner.innerHTML = existingContent.content;
    } else {
        stickyNoteInner.innerHTML = "Leave a note for your future self!";
    }
    stickyNoteInner.onkeyup = function(e) {
        handleNoteChange(userId, userNameDiv, e);
    };
    stickyNoteWrapper.appendChild(stickyNoteInner);
    userNameDiv.appendChild(stickyNoteWrapper);
}

function handleNoteChange(userId, userNameDiv, event) {

    lsHandler.set(userId, event.target.innerHTML);
}