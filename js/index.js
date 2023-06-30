
  document.addEventListener("DOMContentLoaded", function() {
    const listElement = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    let books = [];
  
    fetch("http://localhost:3000/books")
      .then(response => response.json())
      .then(data => {
        books = data;
        displayBooks();
      })
      .catch(error => {
        console.error("Error fetching books:", error);
      });
  
    function displayBooks() {
      listElement.innerHTML = "";
      books.forEach(book => {
        const listItem = document.createElement("li");
        listItem.textContent = book.title;
        listElement.appendChild(listItem);
      });
    }
  
    listElement.addEventListener("click", function(event) {
      if (event.target.tagName === "LI") {
        const bookTitle = event.target.textContent;
        const book = books.find(book => book.title === bookTitle);
  
        showPanel.innerHTML = `
          <img src="${book.thumbnail}">
          <p>${book.description}</p>
          <ul>
            ${book.users.map(user => `<li>${user.username}</li>`).join("")}
          </ul>
          <button id="like-btn">LIKE</button>
        `;
      }
    });
  
    showPanel.addEventListener("click", function(event) {
      if (event.target.id === "like-btn") {
        const bookTitle = event.target.parentNode.firstChild.textContent;
        const book = books.find(book => book.title === bookTitle);
        const userId = 1; // Replace with your own user ID
        const username = "pouros"; // Replace with your own username
  
        const hasLiked = book.users.some(user => user.id === userId);
  
        if (!hasLiked) {
          const updatedUsers = [...book.users, { id: userId, username: username }];
          const patchData = { users: updatedUsers };
  
          fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(patchData)
          })
          .then(response => response.json())
          .then(updatedBook => {
            const updatedIndex = books.findIndex(book => book.id === updatedBook.id);
            books[updatedIndex] = updatedBook;
            displayBooks();
            displayBookDetails(updatedBook);
          })
          .catch(error => {
            console.error("Error liking the book:", error);
          });
        }
      }
    });
  
    function displayBookDetails(book) {
      showPanel.innerHTML = `
        <img src="${book.thumbnail}">
        <p>${book.description}</p>
        <ul>
          ${book.users.map(user => `<li>${user.username}</li>`).join("")}
        </ul>
        <button id="like-btn">LIKE</button>
      `;
    }
  });
  