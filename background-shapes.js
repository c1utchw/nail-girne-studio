// Background Shapes System

(function () {
    const shapes = [
        'bs-a1', 'bs-b1', 'bs-c1', 'bs-d1',
        'bs-a2', 'bs-b2', 'bs-c2',
        'bs-a3', 'bs-d2', 'bs-b3', 'bs-c3',
        'bs-a4', 'bs-d3', 'bs-b4',
        'bs-a5', 'bs-a6', 'bs-a7',
        'bs-b5', 'bs-b6', 'bs-b7',
        'bs-c4', 'bs-c5',
        'bs-d4', 'bs-d5'
    ];

    const container = document.querySelector('.background-shapes');
    if (!container) return;

    shapes.forEach(function (className) {
        const shape = document.createElement('span');
        shape.className = 'bs ' + className;
        container.appendChild(shape);
    });

    // Вертикальная золотая цепочка — идёт по всему сайту
    (function() {
        var chainSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chainSvg.setAttribute('viewBox', '0 0 40 2000');
        chainSvg.style.cssText =
            'position:fixed;pointer-events:none;right:18px;top:0;' +
            'width:40px;height:100vh;z-index:0;opacity:0.22;overflow:visible;';

        var chainDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var chainGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        chainGrad.setAttribute('id', 'chainGold');
        chainGrad.setAttribute('x1', '0%'); chainGrad.setAttribute('x2', '0%');
        chainGrad.setAttribute('y1', '0%'); chainGrad.setAttribute('y2', '100%');
        [
            { offset: '0%',   color: 'rgba(201,166,107,0)' },
            { offset: '8%',   color: '#C9A66B' },
            { offset: '50%',  color: '#D4AF37' },
            { offset: '92%',  color: '#C9A66B' },
            { offset: '100%', color: 'rgba(212,175,55,0)' },
        ].forEach(function(s) {
            var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop.setAttribute('offset', s.offset);
            stop.setAttribute('stop-color', s.color);
            chainGrad.appendChild(stop);
        });
        chainDefs.appendChild(chainGrad);
        chainSvg.appendChild(chainDefs);

        // Змейка — плавная синусоида вдоль правого края
        var chainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var cd = 'M 20 0';
        var step = 60; // длина одного витка
        for (var y = 0; y <= 2000; y += step) {
            var cx1 = (y / step % 2 === 0) ? 36 : 4;
            var cx2 = (y / step % 2 === 0) ? 36 : 4;
            cd += ' C ' + cx1 + ' ' + (y + step*0.25) + ',' +
                          cx2 + ' ' + (y + step*0.75) + ',' +
                          '20 '     + (y + step);
        }
        chainPath.setAttribute('d', cd);
        chainPath.setAttribute('fill', 'none');
        chainPath.setAttribute('stroke', 'url(#chainGold)');
        chainPath.setAttribute('stroke-width', '1.5');
        chainPath.setAttribute('stroke-linecap', 'round');
        chainSvg.appendChild(chainPath);

        document.querySelector('.page').appendChild(chainSvg);
    })();
    var waves = [
        { top: '7%',  left: '-5%',  rotate: '-3deg',  opacity: 0.20 },
        { top: '22%', left: '15%',  rotate: '4deg',   opacity: 0.16 },
        { top: '38%', left: '-8%',  rotate: '-5deg',  opacity: 0.18 },
        { top: '55%', left: '8%',   rotate: '3deg',   opacity: 0.15 },
        { top: '71%', left: '-3%',  rotate: '-4deg',  opacity: 0.17 },
        { top: '85%', left: '12%',  rotate: '5deg',   opacity: 0.14 },
    ];

    waves.forEach(function(w, i) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 700 50');
        svg.style.cssText =
            'position:absolute;pointer-events:none;' +
            'top:' + w.top + ';left:' + w.left + ';' +
            'opacity:' + w.opacity + ';' +
            'transform:rotate(' + w.rotate + ');' +
            'width:clamp(260px,55vw,680px);height:50px;overflow:visible;z-index:0;';

        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', 'gw' + i);
        grad.setAttribute('x1', '0%'); grad.setAttribute('x2', '100%');
        grad.setAttribute('y1', '0%'); grad.setAttribute('y2', '0%');
        [
            { offset: '0%',   color: 'rgba(201,166,107,0)' },
            { offset: '25%',  color: '#C9A66B' },
            { offset: '75%',  color: '#D4AF37' },
            { offset: '100%', color: 'rgba(212,175,55,0)' },
        ].forEach(function(s) {
            var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop.setAttribute('offset', s.offset);
            stop.setAttribute('stop-color', s.color);
            grad.appendChild(stop);
        });
        defs.appendChild(grad);

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var amp  = [12, 18, 10, 15, 20, 8][i];
        var freq = [120, 100, 140, 110, 130, 90][i];
        var d = 'M0 25';
        for (var x = 0; x <= 700; x += freq) {
            d += ' C' + (x + freq*0.35) + ' ' + (25 - amp) + ',' +
                        (x + freq*0.65) + ' ' + (25 + amp) + ',' +
                        (x + freq) + ' 25';
        }
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#gw' + i + ')');
        path.setAttribute('stroke-width', i % 2 === 0 ? '1.2' : '1.8');
        path.setAttribute('stroke-linecap', 'round');

        svg.appendChild(defs);
        svg.appendChild(path);
        container.appendChild(svg);
    });

    // Золотые извилистые линии по всему сайту
    var waves = [
        { top: '7%',  left: '-5%',  rotate: '-3deg',  opacity: 0.20 },
        { top: '22%', left: '15%',  rotate: '4deg',   opacity: 0.16 },
        { top: '38%', left: '-8%',  rotate: '-5deg',  opacity: 0.18 },
        { top: '55%', left: '8%',   rotate: '3deg',   opacity: 0.15 },
        { top: '71%', left: '-3%',  rotate: '-4deg',  opacity: 0.17 },
        { top: '85%', left: '12%',  rotate: '5deg',   opacity: 0.14 },
    ];

    waves.forEach(function(w, i) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 700 50');
        svg.style.cssText =
            'position:absolute;pointer-events:none;' +
            'top:' + w.top + ';left:' + w.left + ';' +
            'opacity:' + w.opacity + ';' +
            'transform:rotate(' + w.rotate + ');' +
            'width:clamp(260px,55vw,680px);height:50px;overflow:visible;z-index:0;';

        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', 'gw' + i);
        grad.setAttribute('x1', '0%'); grad.setAttribute('x2', '100%');
        grad.setAttribute('y1', '0%'); grad.setAttribute('y2', '0%');
        [
            { offset: '0%',   color: 'rgba(201,166,107,0)' },
            { offset: '25%',  color: '#C9A66B' },
            { offset: '75%',  color: '#D4AF37' },
            { offset: '100%', color: 'rgba(212,175,55,0)' },
        ].forEach(function(s) {
            var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop.setAttribute('offset', s.offset);
            stop.setAttribute('stop-color', s.color);
            grad.appendChild(stop);
        });
        defs.appendChild(grad);

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // Разные амплитуды и длины волн для каждой линии
        var amp  = [12, 18, 10, 15, 20, 8][i];
        var freq = [120, 100, 140, 110, 130, 90][i];
        var d = 'M0 25';
        for (var x = 0; x <= 700; x += freq) {
            d += ' C' + (x + freq*0.35) + ' ' + (25 - amp) + ',' +
                        (x + freq*0.65) + ' ' + (25 + amp) + ',' +
                        (x + freq) + ' 25';
        }
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#gw' + i + ')');
        path.setAttribute('stroke-width', i % 2 === 0 ? '1.2' : '1.8');
        path.setAttribute('stroke-linecap', 'round');

        svg.appendChild(defs);
        svg.appendChild(path);
        container.appendChild(svg);
    });

    // Золотые извилистые линии — SVG с плавными кривыми
    const waves = [
        // Линия 1 — верхняя треть
        { top: '8%',  left: '-5%',  rotate: '-4deg',  opacity: '0.22', path: 'M0 25 C60 5,120 45,180 25 C240 5,300 45,360 25 C420 5,480 45,540 25 C600 5,660 45,720 25' },
        // Линия 2 — середина
        { top: '42%', left: '10%',  rotate: '3deg',   opacity: '0.18', path: 'M0 20 C50 40,100 0,150 20 C200 40,250 0,300 20 C350 40,400 0,450 20 C500 40,550 0,600 20' },
        // Линия 3 — нижняя треть  
        { top: '68%', left: '-8%',  rotate: '-6deg',  opacity: '0.20', path: 'M0 30 C80 8,160 52,240 30 C320 8,400 52,480 30 C560 8,640 52,720 30' },
        // Линия 4 — тонкая диагональная
        { top: '25%', left: '30%',  rotate: '-12deg', opacity: '0.14', path: 'M0 20 C70 5,140 35,210 20 C280 5,350 35,420 20 C490 5,560 35,630 20' },
        // Линия 5 — правая часть
        { top: '55%', left: '20%',  rotate: '5deg',   opacity: '0.16', path: 'M0 25 C90 0,180 50,270 25 C360 0,450 50,540 25 C630 0,720 50,810 25' },
    ];

    waves.forEach(function(w, i) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'bs bs-wave bs-wave' + (i + 1));
        svg.setAttribute('viewBox', '0 0 720 50');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.style.cssText = 'position:absolute;pointer-events:none;top:' + w.top + ';left:' + w.left + ';opacity:' + w.opacity + ';transform:rotate(' + w.rotate + ');width:clamp(280px,55vw,680px);height:50px;overflow:visible;';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', w.path);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#goldGrad' + i + ')');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke-linecap', 'round');

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', 'goldGrad' + i);
        grad.setAttribute('x1', '0%'); grad.setAttribute('x2', '100%');
        grad.setAttribute('y1', '0%'); grad.setAttribute('y2', '0%');
        const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', 'rgba(201,166,107,0)');
        const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        s2.setAttribute('offset', '30%'); s2.setAttribute('stop-color', '#C9A66B');
        const s3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        s3.setAttribute('offset', '70%'); s3.setAttribute('stop-color', '#D4AF37');
        const s4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        s4.setAttribute('offset', '100%'); s4.setAttribute('stop-color', 'rgba(212,175,55,0)');
        grad.appendChild(s1); grad.appendChild(s2); grad.appendChild(s3); grad.appendChild(s4);
        defs.appendChild(grad);

        svg.appendChild(defs);
        svg.appendChild(path);
        container.appendChild(svg);
    });
}());
