document.addEventListener('DOMContentLoaded', () => {
    // Get the image ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const imageId = urlParams.get('id');

    // Create a p5.js sketch
    const sketch = (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.background(200);
            p.fill(0);
            p.textSize(32);
            p.text('Bild ' + imageId, 10, 50);

            // Load and display the image
            const img = p.loadImage(`assets/bilder/bild${imageId}.jpg`, () => {
                p.image(img, 10, 70, 380, 320);
            });
        };
    };

    new p5(sketch, 'detail');
});
