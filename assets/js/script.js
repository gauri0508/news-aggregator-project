// Replace with your valid CurrentsAPI key
const apiKey = '90oIjStaww1jy0d1Mu0V2fALW8CO_uvXtPFgyjACODYtpuJT'; // Use your API key here
const apiBaseUrl = 'https://api.currentsapi.services/v1/';
const categorySelector = document.getElementById('category-selector');
const newsContainer = document.getElementById('news-container');
const bookmarksContainer = document.getElementById('bookmarks-container');
const popupNotification = document.getElementById('popup-notification');

// Fetch and display news articles
document.getElementById('fetch-news').addEventListener('click', async () => {
    const category = categorySelector.value;
    const url = `${apiBaseUrl}latest-news?category=${category}&apiKey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch news articles.');
        const data = await response.json();
        displayNews(data.news);
    } catch (error) {
        newsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error('Error fetching news:', error);
    }
});

// Display news articles
function displayNews(articles) {
    newsContainer.innerHTML = '';
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p>No articles found.</p>';
        return;
    }
    articles.forEach(article => {
        const articleDiv = document.createElement('article');
        articleDiv.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
            <button onclick="saveBookmark('${encodeURIComponent(article.title)}', '${encodeURIComponent(article.url)}')">Bookmark</button>
        `;
        newsContainer.appendChild(articleDiv);
    });
}

// Save bookmarks
function saveBookmark(title, url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push({ title: decodeURIComponent(title), url: decodeURIComponent(url) });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks();
    showPopupNotification('Bookmark added!');
}

// Remove bookmarks
function removeBookmark(index) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.splice(index, 1); // Remove the bookmark at the specified index
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks();
}

// Display bookmarks with remove functionality
function displayBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarksContainer.innerHTML = '';
    if (bookmarks.length === 0) {
        bookmarksContainer.innerHTML = '<p>No bookmarks saved.</p>';
        return;
    }
    bookmarks.forEach((bookmark, index) => {
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.innerHTML = `
            <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
            <button onclick="removeBookmark(${index})">Remove</button>
        `;
        bookmarksContainer.appendChild(bookmarkDiv);
    });
}

// Show pop-up notification
function showPopupNotification(message) {
    popupNotification.textContent = message;
    popupNotification.classList.remove('hidden');
    popupNotification.classList.add('visible');

    setTimeout(() => {
        popupNotification.classList.remove('visible');
        popupNotification.classList.add('hidden');
    }, 2000); // Hide after 2 seconds
}

// Scroll to bookmarks section
function goToBookmarks() {
    document.getElementById('bookmarks-section').scrollIntoView({ behavior: 'smooth' });
}

// Initialize bookmarks display
displayBookmarks();
