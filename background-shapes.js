// Background Shapes System

(function () {
    const shapes = [
        'bs-a1',
        'bs-b1',
        'bs-c1',
        'bs-d1',
        'bs-a2',
        'bs-b2',
        'bs-c2',
        'bs-a3',
        'bs-d2',
        'bs-b3',
        'bs-c3',
        'bs-a4',
        'bs-d3',
        'bs-b4',
        'bs-a5',
        'bs-a6',
        'bs-a7',
        'bs-b5',
        'bs-b6',
        'bs-b7',
        'bs-c4',
        'bs-c5',
        'bs-d4',
        'bs-d5'
    ];

    const container = document.querySelector('.background-shapes');
    if (!container) return;

    shapes.forEach(function (className) {
        const shape = document.createElement('span');
        shape.className = 'bs ' + className;
        container.appendChild(shape);
    });
}());
