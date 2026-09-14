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

    // ── Золотая цепь из простых колец ───────────────────────────
    (function() {
        var ns   = 'http://www.w3.org/2000/svg';
        var page = document.querySelector('.page');
        if (!page) return;

        function buildChain() {
            var W      = page.offsetWidth  || 390;
            var H      = page.offsetHeight || 3000;
            var INSIDE = 40;
            var R      = 5;
            var GAP    = R * 2.2;  // реже кольца = меньше элементов
            var LOOP_H = 220;

            // Ограничиваем высоту на мобильных для производительности
            var isMobile = W <= 768;
            var drawH = isMobile ? Math.min(H, 5000) : H;

            var svg = document.createElementNS(ns, 'svg');
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            svg.style.cssText =
                'position:absolute;pointer-events:none;' +
                'top:0;left:0;' +
                'width:' + W + 'px;height:' + H + 'px;' +
                'z-index:0;overflow:visible;opacity:0.55;';

            var defs = document.createElementNS(ns, 'defs');
            var lg = document.createElementNS(ns, 'linearGradient');
            lg.setAttribute('id', 'ringGold');
            lg.setAttribute('x1','0%'); lg.setAttribute('x2','100%');
            lg.setAttribute('y1','0%'); lg.setAttribute('y2','100%');
            [
                {o:'0%',  c:'#8B6914'},
                {o:'30%', c:'#F0C040'},
                {o:'60%', c:'#D4AF37'},
                {o:'100%',c:'#7A5C10'}
            ].forEach(function(s) {
                var stop = document.createElementNS(ns, 'stop');
                stop.setAttribute('offset', s.o);
                stop.setAttribute('stop-color', s.c);
                lg.appendChild(stop);
            });
            defs.appendChild(lg);
            svg.appendChild(defs);

            var LOOPS = Math.ceil(drawH / LOOP_H) + 1;

            // Форма одного витка:
            // Левый край: x = -INSIDE (уходит в стену)
            // Правый край: x = W + INSIDE (уходит в стену)
            // Цепь идёт: стена слева → через экран → стена справа → вниз → обратно

            for (var loop = 0; loop < LOOPS; loop++) {
                var y0    = loop * LOOP_H;
                var fromX = (loop % 2 === 0) ? -INSIDE : W + INSIDE;
                var toX   = (loop % 2 === 0) ? W + INSIDE : -INSIDE;

                // Контрольные точки: входит горизонтально из стены
                // p0 → p1: выходим из стены горизонтально
                // p2 → p3: заходим в стену горизонтально
                var p0x = fromX,      p0y = y0;
                var p1x = W * 0.35,   p1y = y0;
                var p2x = W * 0.65,   p2y = y0 + LOOP_H;
                var p3x = toX,        p3y = y0 + LOOP_H;

                // Апроксимируем длину кривой
                var dist  = Math.sqrt(Math.pow(p3x-p0x,2) + Math.pow(p3y-p0y,2)) * 1.4;
                var steps = Math.ceil(dist / GAP);

                for (var s = 0; s <= steps; s++) {
                    var t  = s / steps;
                    var mt = 1 - t;

                    var cx = mt*mt*mt*p0x + 3*mt*mt*t*p1x + 3*mt*t*t*p2x + t*t*t*p3x;
                    var cy = mt*mt*mt*p0y + 3*mt*mt*t*p1y + 3*mt*t*t*p2y + t*t*t*p3y;

                    // Касательная
                    var tx = 3*mt*mt*(p1x-p0x) + 6*mt*t*(p2x-p1x) + 3*t*t*(p3x-p2x);
                    var ty = 3*mt*mt*(p1y-p0y) + 6*mt*t*(p2y-p1y) + 3*t*t*(p3y-p2y);
                    var angle = Math.atan2(ty, tx) * 180 / Math.PI;

                    var ring = document.createElementNS(ns, 'ellipse');
                    ring.setAttribute('cx', cx);
                    ring.setAttribute('cy', cy);
                    ring.setAttribute('rx', R);
                    ring.setAttribute('ry', R * 0.55);
                    ring.setAttribute('fill', 'none');
                    ring.setAttribute('stroke', 'url(#ringGold)');
                    ring.setAttribute('stroke-width', '2');
                    ring.setAttribute('transform',
                        'rotate(' + angle + ' ' + cx + ' ' + cy + ')');
                    svg.appendChild(ring);
                }
            }

            container.appendChild(svg);
        }

        if (document.readyState === 'complete') {
            setTimeout(buildChain, 150);
        } else {
            window.addEventListener('load', function() { setTimeout(buildChain, 150); });
        }
    })();

    // ── Горизонтальные золотые волны — только на десктопе ──
    if (window.innerWidth > 768) {
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
    } // end desktop-only waves

}());
