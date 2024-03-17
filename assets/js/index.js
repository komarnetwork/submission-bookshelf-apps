document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // addBook();
    Toastify({
      text: "Buku telah ditambahkan",
      duration: 2000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "var(--secondaryBlue)",
        color: "var(--blue)",
      },
      onClick: addBook(),
    }).showToast();
    clearForm();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = "render-books";

function addBook() {
  const inputTitle = document.getElementById("title").value;
  const inputAuthor = document.getElementById("author").value;
  const inputYear = document.getElementById("year").value;

  const generatedID = generateId();
  const yearNumber = parseInt(inputYear);
  const bookObject = generateBookObject(
    generatedID,
    inputTitle,
    inputAuthor,
    yearNumber,
    false
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveToStorage();
}

function generateId() {
  return +new Date();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
}

// membuat object baru
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
  const listUncompleted = document.getElementById("uncompleted");
  listUncompleted.innerHTML = "";

  let listCompleted = document.getElementById("completed");
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (!bookItem.isComplete) {
      listUncompleted.append(bookElement);
    } else {
      listCompleted.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const coverImg = document.createElement("img");
  coverImg.setAttribute("src", "assets/img/coverbook.jpg");
  coverImg.setAttribute("alt", "coverbook");

  const bookImg = document.createElement("div");
  bookImg.classList.add("book-image");
  bookImg.append(coverImg);

  const title = document.createElement("h3");
  title.innerText = `Judul: ${bookObject.title}`;
  const author = document.createElement("p");
  author.innerHTML = `Penulis: <span>${bookObject.author}</span>`;
  const year = document.createElement("p");
  year.innerHTML = `Tahun: <span>${bookObject.year}</span>`;

  const bookDesc = document.createElement("div");
  bookDesc.classList.add("book-desc");
  bookDesc.append(title, author, year);

  // container book
  const container = document.createElement("div");
  container.classList.add("book");

  // div button
  const buttons = document.createElement("div");
  buttons.classList.add("button");

  container.setAttribute("id", `book-${bookObject.id}`);
  container.append(bookImg, bookDesc, buttons);

  if (bookObject.isComplete) {
    buttons.classList.add("completed");
    // jika nilai false maka buat el button class uncompleted
    const undoButton = document.createElement("button");
    undoButton.classList.add("uncompleted-button");
    undoButton.setAttribute("title", "Selesai Dibaca");

    const iconUnCompleted = document.createElement("i");
    iconUnCompleted.classList.add("fas");
    iconUnCompleted.classList.add("fa-book-reader");

    undoButton.appendChild(iconUnCompleted);

    undoButton.addEventListener("click", function () {
      Toastify({
        text: "Buku telah dipindahkan",
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#07235b",
        },
        onClick: undoTaskFromCompleted(bookObject.id),
      }).showToast();
    });

    // Trash button
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.setAttribute("title", "Hapus Buku");

    const iconHapus = document.createElement("i");
    iconHapus.classList.add("fas");
    iconHapus.classList.add("fa-trash");

    trashButton.appendChild(iconHapus);

    trashButton.addEventListener("click", function () {
      Swal.fire({
        title: "Apakah anda ingin menghapus buku?",
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Iya",
        denyButtonText: "Tidak",
        showCancelButton: false,
      }).then((result) => {
        if (result.value) {
          removeTaskFromCompleted(bookObject.id);
          Swal.fire("Deleted!", "Buku Berhasil di Hapus", "success");
        }
      });
    });

    buttons.append(undoButton, trashButton);

    container.append(buttons);
  } else {
    buttons.classList.add("uncompleted");
    const completedBtn = document.createElement("button");
    completedBtn.classList.add("completed-button");
    completedBtn.setAttribute("title", "Belum Selesai Dibaca");

    const iconCompleted = document.createElement("i");
    iconCompleted.classList.add("fas");
    iconCompleted.classList.add("fa-check");

    completedBtn.appendChild(iconCompleted);

    completedBtn.addEventListener("click", function () {
      Toastify({
        text: "Buku telah dibaca",
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#07235b",
        },
        onClick: addBookToCompleted(bookObject.id),
      }).showToast();
    });

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-button");
    editBtn.setAttribute("title", "Edit");

    const iconEdit = document.createElement("i");
    iconEdit.classList.add("fas");
    iconEdit.classList.add("fa-edit");

    editBtn.appendChild(iconEdit);

    editBtn.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    // Trash button
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.setAttribute("title", "Hapus Buku");

    const iconHapus = document.createElement("i");
    iconHapus.classList.add("fas");
    iconHapus.classList.add("fa-trash");

    trashButton.appendChild(iconHapus);

    trashButton.addEventListener("click", function () {
      Swal.fire({
        title: "Apakah anda ingin menghapus buku?",
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Iya",
        denyButtonText: "Tidak",
        showCancelButton: false,
      }).then((result) => {
        if (result.value) {
          removeTaskFromCompleted(bookObject.id);
          Swal.fire("Deleted!", "Buku Berhasil di Hapus", "success");
        }
      });
    });

    buttons.append(completedBtn, editBtn, trashButton);

    container.append(buttons);
  }

  return container;
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  document.getElementById("title").value = bookTarget.title;
  document.getElementById("author").value = bookTarget.author;
  document.getElementById("year").value = bookTarget.year;

  const bookCard = document.getElementById(`book-${bookId}`);
  bookCard.remove();

  const submitEditBook = document.getElementById("bookSubmit");
  submitEditBook.setAttribute("value", "Edit Buku");
  Toastify({
    text: `Buku ${bookTarget.title} sedang di edit`,
    style: {
      background: "var(--secondaryBlue)",
      color: "var(--blue)",
    },
    duration: 2000,
  }).showToast();

  editButton = document.getElementsByClassName("edit-button");
  for (editButton of editButton) {
    editButton.setAttribute("disabled", true);
  }

  submitEditBook.addEventListener("click", function (event) {
    event.preventDefault();

    bookTarget.title = document.getElementById("title").value;
    bookTarget.author = document.getElementById("author").value;
    bookTarget.year = document.getElementById("year").value;

    // saveToStorage();
    Toastify({
      text: `Buku ${bookTarget.title} telah di edit`,
      style: {
        background: "var(--secondaryBlue)",
        color: "var(--blue)",
      },
      duration: 2000,
      onClick: saveToStorage(),
    }).showToast();
    document.dispatchEvent(new Event(RENDER_EVENT));
    clearForm();
  });
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveToStorage();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// function delete
function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveToStorage();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveToStorage();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// LOCAL STORAGE
const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "BOOKSHELF-APP";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveToStorage() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOK));
  }
}

// listener SAVED_BOOK
document.addEventListener(SAVED_BOOK, function () {
  // console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY); // ambil key dari storage dengan getItem
  let data = JSON.parse(serializedData); //  parse data JSON tadi menjadi sebuah object

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT)); //menampilkannya dengan render
}

// SEARCH BOOK
const searchBook = document.getElementById("searchbook");

searchBook.addEventListener("keyup", function (e) {
  const searchBook = e.target.value.toLowerCase();
  const books = document.querySelectorAll(".book");

  books.forEach((data) => {
    const bookDesc = data.childNodes[1];
    const bookTitle = bookDesc.firstChild.textContent.toLowerCase();

    if (bookTitle.indexOf(searchBook) != -1) {
      data.setAttribute("style", "display: flex");
    } else {
      data.setAttribute("style", "display: none !important");
    }
  });
});
