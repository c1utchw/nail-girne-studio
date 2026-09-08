// Background Shapes System

(function () {

    var container = document.querySelector('.background-shapes');
    if (!container) return;

    // ── Розовые блобы ────────────────────────────────
    var blobClasses = [
        'bs-a1','bs-b1','bs-c1','bs-d1',
        'bs-a2','bs-b2','bs-c2',
        'bs-a3','bs-d2','bs-b3','bs-c3',
        'bs-a4','bs-d3','bs-b4',
        'bs-a5','bs-a6','bs-a7',
        'bs-b5','bs-b6','bs-b7',
        'bs-c4','bs-c5',
        'bs-d4','bs-d5'
    ];

    blobClasses.forEach(function(cls) {
        var el = document.createElement('span');
        el.className = 'bs ' + cls;
        container.appendChild(el);
    });

    // ── Золотая цепочка — две вертикальные змейки по бокам ──
    function makeChain(side) {
        var ns   = 'http://www.w3.org/2000/svg';
        var svg  = document.createElementNS(ns, 'svg');
        var id   = 'chainGrad_' + side;
        var W    = 28;   // ширина SVG
        var H    = 3000; // высота (длиннее любой страницы)
        var AMP  = 10;   // амплитуда волны
        var STEP = 40;   // шаг витка

        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.style.cssText =
            'position:fixed;pointer-events:none;top:0;' +
            side + ':12px;' +
            'width:' + W + 'px;height:100vh;' +
            'z-index:0;opacity:0.30;overflow:visible;';

        // Градиент — прозрачный сверху/снизу, золото в середине
        var defs = document.createElementNS(ns, 'defs');
        var grad = document.createElementNS(ns, 'linearGradient');
        grad.setAttribute('id', id);
        grad.setAttribute('x1','0%'); grad.setAttribute('x2','0%');
        grad.setAttribute('y1','0%'); grad.setAttribute('y2','100%');
        [
            {o:'0%',   c:'rgba(201,166,107,0)'},
            {o:'6%',   c:'#C9A66B'},
            {o:'50%',  c:'#D4AF37'},
            {o:'94%',  c:'#C9A66B'},
            {o:'100%', c:'rgba(212,175,55,0)'}
        ].forEach(function(s) {
            var stop = document.createElementNS(ns, 'stop');
            stop.setAttribute('offset', s.o);
            stop.setAttribute('stop-color', s.c);
            grad.appendChild(stop);
        });
        defs.appendChild(grad);
        svg.appendChild(defs);

        // Змейка-синусоида
        var cx = W / 2;
        var d  = 'M ' + cx + ' 0';
        for (var y = 0; y <= H; y += STEP) {
            var xL = cx - AMP;
            var xR = cx + AMP;
            var goRight = ((y / STEP) % 2 === 0);
            d += ' C ' +
                 (goRight ? xR : xL) + ' ' + (y + STEP * 0.25) + ',' +
                 (goRight ? xR : xL) + ' ' + (y + STEP * 0.75) + ',' +
                 cx + ' ' + (y + STEP);
        }

        var path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#' + id + ')');
        path.setAttribute('stroke-width', '1.6');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);

        // Маленькие кружочки-звенья каждые STEP*2 пикселей
        for (var yc = STEP; yc < H; yc += STEP * 2) {
            var circle = document.createElementNS(ns, 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', yc);
            circle.setAttribute('r',  '2.2');
            circle.setAttribute('fill', '#D4AF37');
            circle.setAttribute('opacity', '0.55');
            svg.appendChild(circle);
        }

        document.querySelector('.page').appendChild(svg);
    }

    makeChain('left');
    makeChain('right');

    // ── Горизонтальные золотые волны по всему сайту ──
    var waveList = [
        {top:'8%',  left:'-4%', rotate:'-3deg', op:0.18},
        {top:'23%', left:'12%', rotate:'4deg',  op:0.15},
        {top:'40%', left:'-6%', rotate:'-5deg', op:0.16},
        {top:'57%', left:'8%',  rotate:'3deg',  op:0.14},
        {top:'73%', left:'-4%', rotate:'-4deg', op:0.15},
        {top:'88%', left:'10%', rotate:'5deg',  op:0.13},
    ];

    waveList.forEach(function(w, i) {
        var ns  = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(ns, 'svg');
        var gid = 'wg' + i;
        svg.setAttribute('viewBox', '0 0 700 50');
        svg.style.cssText =
            'position:absolute;pointer-events:none;' +
            'top:' + w.top + ';left:' + w.left + ';' +
            'opacity:' + w.op + ';' +
            'transform:rotate(' + w.rotate + ');' +
            'width:clamp(240px,55vw,660px);height:50px;overflow:visible;z-index:0;';

        var defs = document.createElementNS(ns, 'defs');
        var grad = document.createElementNS(ns, 'linearGradient');
        grad.setAttribute('id', gid);
        grad.setAttribute('x1','0%'); grad.setAttribute('x2','100%');
        grad.setAttribute('y1','0%'); grad.setAttribute('y2','0%');
        [
            {o:'0%',  c:'rgba(201,166,107,0)'},
            {o:'25%', c:'#C9A66B'},
            {o:'75%', c:'#D4AF37'},
            {o:'100%',c:'rgba(212,175,55,0)'}
        ].forEach(function(s) {
            var stop = document.createElementNS(ns, 'stop');
            stop.setAttribute('offset', s.o);
            stop.setAttribute('stop-color', s.c);
            grad.appendChild(stop);
        });
        defs.appendChild(grad);

        var amp  = [10,16,8,14,18,7][i];
        var freq = [110,95,130,105,120,85][i];
        var d = 'M0 25';
        for (var x = 0; x <= 700; x += freq) {
            d += ' C' + (x+freq*0.35) + ' ' + (25-amp) + ',' +
                        (x+freq*0.65) + ' ' + (25+amp) + ',' +
                        (x+freq)      + ' 25';
        }

        var path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#' + gid + ')');
        path.setAttribute('stroke-width', i % 2 === 0 ? '1.2' : '1.7');
        path.setAttribute('stroke-linecap', 'round');

        svg.appendChild(defs);
        svg.appendChild(path);
        container.appendChild(svg);
    });

}());
