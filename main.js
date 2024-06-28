document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('feed');
    
    // Beispielbilder für den Feed
    const images = ['bild1.jpg', 'bild2.jpg', 'bild3.jpg']; // Add more as needed

    images.forEach((image, index) => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'feed-item';
        imgDiv.style.backgroundImage = `url('assets/bilder/${image}')`;
        imgDiv.addEventListener('click', () => {
            window.location.href = `detail.html?id=${index}`;
        });
        feed.appendChild(imgDiv);
    });
});
