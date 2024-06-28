document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('feed');

    // Beispiel-Feed-Elemente
    const items = Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`);

    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'feed-item';
        itemDiv.textContent = item;
        itemDiv.addEventListener('click', () => {
            window.location.href = `detail.html?id=${index}`;
        });
        feed.appendChild(itemDiv);
    });
});
