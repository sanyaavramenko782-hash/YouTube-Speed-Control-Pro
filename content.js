(function() {
    'use strict';

    function createControlPanel() {
        if (document.getElementById('yt-speed-panel')) return;

        // Создаем контейнер панели
        const panel = document.createElement('div');
        panel.id = 'yt-speed-panel';
        panel.style.cssText = `
            position: absolute;
            top: 15px;
            left: 15px;
            z-index: 99999;
            background: rgba(28, 28, 28, 0.85);
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-family: Roboto, Arial, sans-serif;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            user-select: none;
            transition: opacity 0.2s;
        `;

        panel.innerHTML = `
            <span style="font-weight: 500;">Скорость:</span>
            <input type="range" id="yt-speed-range" min="0.25" max="10" step="0.25" value="1" style="width: 100px; cursor: pointer;">
            <input type="number" id="yt-speed-input" min="0.1" max="10" step="0.1" value="1" style="width: 45px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; text-align: center; padding: 2px;">
            <span>x</span>
        `;

        // Функция вставки панели над видеоплеером
        function attachPanel() {
            const player = document.querySelector('.html5-video-player');
            if (player && !document.getElementById('yt-speed-panel')) {
                player.appendChild(panel);
                setupEvents();
            }
        }

        // Проверяем появление плеера (YouTube часто меняет страницы без полной перезагрузки)
        const observer = new MutationObserver(() => {
            attachPanel();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        attachPanel();
    }

    function setupEvents() {
        const range = document.getElementById('yt-speed-range');
        const input = document.getElementById('yt-speed-input');
        if (!range || !input) return;

        function updateSpeed(val) {
            let speed = parseFloat(val);
            if (isNaN(speed)) return;
            speed = Math.max(0.1, Math.min(10, speed)); // Ограничиваем от 0.1 до 10

            range.value = speed;
            input.value = speed;

            const video = document.querySelector('video');
            if (video) {
                video.playbackRate = speed;
            }
        }

        range.addEventListener('input', (e) => updateSpeed(e.target.value));
        input.addEventListener('change', (e) => updateSpeed(e.target.value));

        // Синхронизация, если скорость меняется другими средствами (например, клавишами)
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('ratechange', () => {
                if (document.activeElement !== input && document.activeElement !== range) {
                    range.value = video.playbackRate;
                    input.value = video.playbackRate;
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }
})();