// Initialize book data and reading goal
let books = JSON.parse(localStorage.getItem('books')) || [];
let readingGoal = localStorage.getItem('readingGoal') || 20;

// DOM Elements
const addBookForm = document.getElementById('add-book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const totalPagesInput = document.getElementById('total-pages');
const notesInput = document.getElementById('notes');
const quotesInput = document.getElementById('quotes');
const goalInput = document.getElementById('goal');
const communityReviews = document.getElementById('community-reviews');

// Event Listeners
addBookForm.addEventListener('submit', addBook);
goalInput.addEventListener('change', updateReadingGoal);

// Functions
function addBook(e) {
  e.preventDefault();

  const book = {
    title: titleInput.value,
    author: authorInput.value,
    totalPages: parseInt(totalPagesInput.value),
    currentPage: 0,
    notes: notesInput.value,
    quotes: quotesInput.value,
    status: 'want-to-read'
  };

  books.push(book);
  saveBooks();
  renderBooks();
  addBookForm.reset();
}

function updateReadingGoal() {
  readingGoal = goalInput.value;
  localStorage.setItem('readingGoal', readingGoal);
  renderBooks();
}

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function renderBooks() {
  // Clear previous lists
  document.getElementById('want-to-read-list').innerHTML = '';
  document.getElementById('currently-reading-list').innerHTML = '';
  document.getElementById('read-list').innerHTML = '';

  books.forEach((book, index) => {
    const li = document.createElement('li');
    const percentRead = Math.round((book.currentPage / book.totalPages) * 100);
    const pagesLeft = book.totalPages - book.currentPage;

    li.innerHTML = `
      <strong>${book.title}</strong> by ${book.author}<br>
      Pages: ${book.currentPage}/${book.totalPages} (${percentRead}% read, ${pagesLeft} pages left)<br>
      <em>Status:</em> ${book.status}<br>
      <em>Notes:</em> ${book.notes}<br>
      <em>Quotes:</em> ${book.quotes}<br>
      <button onclick="updateProgress(${index})">Update Progress</button>
      <button onclick="changeStatus(${index})">Change Status</button>
      <button onclick="deleteBook(${index})">Delete</button>
    `;

    if (book.status === 'want-to-read') {
      document.getElementById('want-to-read-list').appendChild(li);
    } else if (book.status === 'currently-reading') {
      document.getElementById('currently-reading-list').appendChild(li);
    } else {
      document.getElementById('read-list').appendChild(li);
    }
  });
}

function updateProgress(index) {
  const current = prompt("Enter current page:");
  const page = parseInt(current);
  if (!isNaN(page) && page <= books[index].totalPages) {
    books[index].currentPage = page;
    if (page === books[index].totalPages) {
      books[index].status = 'read';
    } else if (page > 0) {
      books[index].status = 'currently-reading';
    }
    saveBooks();
    renderBooks();
  }
}

function changeStatus(index) {
  const newStatus = prompt("Enter status: want-to-read, currently-reading, or read");
  if (['want-to-read', 'currently-reading', 'read'].includes(newStatus)) {
    books[index].status = newStatus;
    saveBooks();
    renderBooks();
  }
}

function deleteBook(index) {
  if (confirm("Are you sure you want to delete this book?")) {
    books.splice(index, 1);
    saveBooks();
    renderBooks();
  }
}

// Initial render
renderBooks();
