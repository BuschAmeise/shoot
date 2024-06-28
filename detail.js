document.addEventListener('DOMContentLoaded', () => {
    // ID des Elements aus der URL abrufen
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    // p5.js Sketch erstellen
    const sketch = (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.background(200);
            p.fill(0);
            p.textSize(32);
            p.text('Item ' + itemId, 10, 50);

            // Beispielhafte p5.js-Zeichnung
            p.fill(150, 0, 0);
            p.rect(100, 100, 200, 200);
        };
    };

    new p5(sketch, 'detail');
});
