chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request == "openBookmarkManager") {
        sendResponse("OK");
        chrome.tabs.create({url: "chrome://bookmarks"});

    } else if (request == "getCatFact") {
        let xhr = new XMLHttpRequest();
        // Request to get cat fact
        xhr.open('GET', 'https://catfact.ninja/fact?max_length=140');
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let json = JSON.parse(xhr.responseText);
                    sendResponse(json.fact);
                } else {
                    console.log('error msg: ' + xhr.status);
                }
            }
        };
        xhr.send();
    } else {
        let promise = new Promise(function (resolve) {
            chrome.bookmarks.getSubTree("1", function (bookmarkTree) {
                resolve(bookmarkTree);
            });
        });

        promise.then(function (bookmarks) {
            sendResponse(bookmarks);
        });
    }
    return true;
});
