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

    // ── Реалистичная золотая цепочка ────────────────────────────
    // Змейка через весь сайт: выходит слева → уходит вправо → выходит слева
    (function() {
        var ns   = 'http://www.w3.org/2000/svg';
        var page = document.querySelector('.page');
        if (!page) return;

        // Ждём загрузки чтобы знать реальную высоту страницы
        function buildChain() {
            var W    = page.offsetWidth  || 390;
            var H    = page.offsetHeight || 3000;
            var PAD  = 60; // выход за края
            var LINK = 14; // длина одного звена
            var LOOP_H = 200; // вертикальный шаг одного прохода слева→право

            var svg = document.createElementNS(ns, 'svg');
            svg.setAttribute('viewBox', '0 0 ' + (W + PAD*2) + ' ' + H);
            svg.style.cssText =
                'position:absolute;pointer-events:none;' +
                'top:0;left:-' + PAD + 'px;' +
                'width:' + (W + PAD*2) + 'px;height:' + H + 'px;' +
                'z-index:0;overflow:visible;';

            var defs = document.createElementNS(ns, 'defs');

            // Градиент золота на звене
            function makeGrad(id, angle) {
                var g = document.createElementNS(ns, 'linearGradient');
                g.setAttribute('id', id);
                g.setAttribute('x1', angle === 'h' ? '0%' : '50%');
                g.setAttribute('x2', angle === 'h' ? '100%' : '50%');
                g.setAttribute('y1', angle === 'h' ? '50%' : '0%');
                g.setAttribute('y2', angle === 'h' ? '50%' : '100%');
                [
                    {o:'0%',  c:'#8B6914'},
                    {o:'25%', c:'#D4AF37'},
                    {o:'50%', c:'#F5D76E'},
                    {o:'75%', c:'#C9A66B'},
                    {o:'100%',c:'#7A5C10'}
                ].forEach(function(s) {
                    var stop = document.createElementNS(ns, 'stop');
                    stop.setAttribute('offset', s.o);
                    stop.setAttribute('stop-color', s.c);
                    g.appendChild(stop);
                });
                return g;
            }
            defs.appendChild(makeGrad('lgH', 'h')); // горизонтальное звено
            defs.appendChild(makeGrad('lgV', 'v')); // вертикальное звено

            // Фильтр тени
            var filter = document.createElementNS(ns, 'filter');
            filter.setAttribute('id', 'linkShadow');
            filter.setAttribute('x', '-20%'); filter.setAttribute('y', '-20%');
            filter.setAttribute('width', '140%'); filter.setAttribute('height', '140%');
            var fe = document.createElementNS(ns, 'feDropShadow');
            fe.setAttribute('dx', '0.5'); fe.setAttribute('dy', '1');
            fe.setAttribute('stdDeviation', '1');
            fe.setAttribute('flood-color', 'rgba(0,0,0,0.35)');
            filter.appendChild(fe);
            defs.appendChild(filter);

            svg.appendChild(defs);

            // Вычисляем путь змейки
            var LOOPS = Math.ceil(H / LOOP_H) + 1;
            var LEFT  = 0 + PAD;
            var RIGHT = W + PAD;

            // Для каждого витка строим точки пути и рисуем звенья
            for (var loop = 0; loop < LOOPS; loop++) {
                var y0   = loop * LOOP_H;
                var fromX = (loop % 2 === 0) ? LEFT  : RIGHT;
                var toX   = (loop % 2 === 0) ? RIGHT : LEFT;

                // Количество звеньев в этом проходе
                var dist  = W + PAD * 2;
                var steps = Math.ceil(dist / (LINK * 2));

                for (var s = 0; s <= steps; s++) {
                    var t   = s / steps;
                    var mt  = 1 - t;

                    // Кубическая Безье: от fromX до toX с изгибом
                    var p0x = fromX, p0y = y0;
                    var p1x = fromX, p1y = y0 + LOOP_H * 0.35;
                    var p2x = toX,   p2y = y0 + LOOP_H * 0.65;
                    var p3x = toX,   p3y = y0 + LOOP_H;

                    var cx = mt*mt*mt*p0x + 3*mt*mt*t*p1x + 3*mt*t*t*p2x + t*t*t*p3x;
                    var cy = mt*mt*mt*p0y + 3*mt*mt*t*p1y + 3*mt*t*t*p2y + t*t*t*p3y;

                    // Касательная для угла звена
                    var dcx = 3*mt*mt*(p1x-p0x) + 6*mt*t*(p2x-p1x) + 3*t*t*(p3x-p2x);
                    var dcy = 3*mt*mt*(p1y-p0y) + 6*mt*t*(p2y-p1y) + 3*t*t*(p3y-p2y);
                    var ang = Math.atan2(dcy, dcx) * 180 / Math.PI;

                    // Чередуем горизонтальные и вертикальные звенья
                    var isHoriz = (s % 2 === 0);
                    var rx = isHoriz ? LINK*0.9 : LINK*0.4;
                    var ry = isHoriz ? LINK*0.4 : LINK*0.9;

                    var el = document.createElementNS(ns, 'ellipse');
                    el.setAttribute('cx', cx);
                    el.setAttribute('cy', cy);
                    el.setAttribute('rx', rx);
                    el.setAttribute('ry', ry);
                    el.setAttribute('fill', 'none');
                    el.setAttribute('stroke', isHoriz ? 'url(#lgH)' : 'url(#lgV)');
                    el.setAttribute('stroke-width', '2.2');
                    el.setAttribute('filter', 'url(#linkShadow)');
                    el.setAttribute('transform', 'rotate(' + ang + ' ' + cx + ' ' + cy + ')');
                    el.setAttribute('opacity', '0.75');
                    svg.appendChild(el);
                }
            }

            container.appendChild(svg);
        }

        // Запускаем после загрузки контента
        if (document.readyState === 'complete') {
            setTimeout(buildChain, 100);
        } else {
            window.addEventListener('load', function() {
                setTimeout(buildChain, 100);
            });
        }
    })();

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
