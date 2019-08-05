class Folder {
  constructor(title) {
    this.title = title;
    this.children = [];
  }
}

class Bookmark {
  constructor(title, url, icon) {
    this.title = title;
    this.url = url;
    this.icon = icon;
  }
}

// Get current time and format
function getTime() {
  let date = new Date(),
    min = date.getMinutes(),
    sec = date.getSeconds(),
    hour = date.getHours();

  return (
    "" +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (min < 10 ? "0" + min : min) +
    ":" +
    (sec < 10 ? "0" + sec : sec)
  );
}

window.onload = () => {
  Clock();
  getBookmarks();
};

function setBookmarkManagerListener() {
  let el = document.getElementById("bookmarkManager");

  function openBookmarkManager() {
    chrome.runtime.sendMessage("openBookmarkManager", function(response) {});
  }

  el.onclick = openBookmarkManager;
}

function getBookmarks() {
  chrome.runtime.sendMessage("getBookmarks", function(response) {
    let bookmarkMainFolder = response[0];
    let bookmarkFolder = [];
    let defaultFolder = new Folder("Bookmarks");
    defaultFolder.children.push(new Bookmark("Bookmark Manager", "asd"));
    for (let i = 0; i < bookmarkMainFolder.children.length; i++) {
      let bookmarkObject = createBookmarkObject(bookmarkMainFolder.children[i]);

      if (bookmarkObject instanceof Folder) {
        // Ignore dead/archive folder
        if (bookmarkObject.title !== "💀") {
          bookmarkFolder.push(bookmarkObject);
        }
        // bookmarkFolder.push(bookmarkObject);
      } else {
        defaultFolder.children.push(bookmarkObject);
      }
    }
    bookmarkFolder.push(defaultFolder);
    let bookmarkContainer = document.getElementById("bookmarkContainer");

    let bookmarkContainerInnerHtml = "";
    for (let i = 0; i < bookmarkFolder.length; i++) {
      bookmarkContainerInnerHtml +=
        createFolderElement(bookmarkFolder[i]) + "\n";
    }

    bookmarkContainer.innerHTML = bookmarkContainerInnerHtml;

    setBookmarkManagerListener();

    //TODO FIXME
    function createBookmarkObject(bookmarkObject) {
      if (bookmarkObject.children) {
        return createFolderObject(bookmarkObject);
      } else {
        return new Bookmark(bookmarkObject.title, bookmarkObject.url);
      }
    }

    function createFolderObject(folderObject) {
      let folder = new Folder(folderObject.title);
      for (let i = 0; i < folderObject.children.length; i++) {
        if (folderObject.children[i].children) {
          let subFolder = createBookmarkObject(folderObject.children[i]);
          folder.children.push(subFolder);
        } else {
          let bookmark = new Bookmark(
            folderObject.children[i].title,
            folderObject.children[i].url,
            "chrome://favicon/" + folderObject.children[i].url
          );
          folder.children.push(bookmark);
        }
      }
      return folder;
    }

    function createFolderElement(folderObject) {
      let bookmarkHtml = "";
      for (let i = 0; i < folderObject.children.length; i++) {
        if (folderObject.children[i] instanceof Folder) {
          bookmarkHtml += createSubFolder(folderObject.children[i]);
        } else {
          bookmarkHtml +=
            createBookmarkElement(folderObject.children[i]) + "\n";
        }
      }
      return (
        '<div class="bookmark-set">\n' +
        '<div class="bookmark-title">' +
        folderObject.title +
        "</div>\n" +
        '<div class="bookmark-inner-container">\n' +
        bookmarkHtml +
        "</div>\n" +
        "</div>"
      );
    }

    function createBookmarkElement(bookmarkObject) {
      if (bookmarkObject.title == "Bookmark Manager") {
        return (
          '<div class=\'bookmarkWrapper\'><a id=\'bookmarkManager\' class="bookmark" href="javascript:void();" target="_blank">' +
          bookmarkObject.title +
          "</a></div>"
        );
      }
      /* Link element here */
      return (
        '<div class=\'bookmarkWrapper\'><a class="bookmark" href="' +
        bookmarkObject.url +
        '" target="_self">' +
        bookmarkObject.title +
        "</a></div>"
      );
    }

    function createSubFolder(bookmarkObject) {
      let begin =
        "<div class='subfolderWrapper'><div class='bookmarkWrapper'><p>" +
        bookmarkObject.title +
        "</p></div>";
      let end = "</div>";
      for (let i = 0; i < bookmarkObject.children.length; i++) {
        if (bookmarkObject.children[i] instanceof Folder) {
          begin += createSubFolder(bookmarkObject.children[i]);
        } else {
          begin += createBookmarkElement(bookmarkObject.children[i]);
        }
      }
      return begin + end;
    }
  });
}

function Clock() {
  // Set up the clock
  document.getElementById("clock").innerHTML = getTime();
  // Set clock interval to tick clock
  setInterval(() => {
    document.getElementById("clock").innerHTML = getTime();
  }, 100);
}

document.addEventListener("keydown", event => {
  if (event.keyCode == 32) {
    // Spacebar code to open search
    document.getElementById("search").style.display = "flex";
    document.getElementById("search-field").focus();
  } else if (event.keyCode == 27) {
    // Esc to close search
    document.getElementById("search-field").value = "";
    document.getElementById("search-field").blur();
    document.getElementById("search").style.display = "none";
  }
});
