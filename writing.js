// writing.js

const referenceLetters = {
    'А': {
        points: [
            {x: 135, y: 130}, {x: 140, y: 100}, {x: 145, y: 70}, {x: 148, y: 40}, {x: 150, y: 20},
            {x: 150, y: 20}, {x: 152, y: 40}, {x: 155, y: 70}, {x: 160, y: 100}, {x: 165, y: 130},
            {x: 142, y: 85}, {x: 150, y: 85}, {x: 158, y: 85}
        ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(135, 130);
            ctx.lineTo(150, 20);
            ctx.lineTo(165, 130);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(142, 85);
            ctx.lineTo(158, 85);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 3;
        }
    },
    'Б': {
        points: [
            {x: 170, y: 30}, {x: 130, y: 30}, {x: 120, y: 60}, {x: 120, y: 120},
            {x: 130, y: 130}, {x: 170, y: 130}, {x: 180, y: 120}, {x: 180, y: 90},
            {x: 170, y: 80}, {x: 130, y: 80}
        ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            // Вертикальна лінія
            ctx.beginPath();
            ctx.moveTo(130, 30);
            ctx.lineTo(130, 130);
            ctx.stroke();
            // Верхня дуга
            ctx.beginPath();
            ctx.arc(150, 55, 20, Math.PI, 0, false);
            ctx.stroke();
            // Нижня дуга
            ctx.beginPath();
            ctx.arc(150, 105, 20, Math.PI, 0, true);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 3;
        }
    },
    'В': {
        points: [
            {x: 135, y: 30}, {x: 135, y: 130},
            {x: 135, y: 30}, {x: 170, y: 45}, {x: 135, y: 80},
            {x: 135, y: 80}, {x: 170, y: 95}, {x: 135, y: 130}
        ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            // Вертикальна лінія
            ctx.beginPath();
            ctx.moveTo(135, 30);
            ctx.lineTo(135, 130);
            ctx.stroke();
            // Верхня дуга
            ctx.beginPath();
            ctx.moveTo(135, 30);
            ctx.bezierCurveTo(175, 30, 175, 80, 135, 80);
            ctx.stroke();
            // Нижня дуга
            ctx.beginPath();
            ctx.moveTo(135, 80);
            ctx.bezierCurveTo(175, 80, 175, 130, 135, 130);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 3;
        }
    },
    'Г': {
        points: [ {x: 130, y: 30}, {x: 170, y: 30}, {x: 130, y: 30}, {x: 130, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(170, 30); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ґ': {
        points: [ {x: 130, y: 30}, {x: 170, y: 30}, {x: 130, y: 30}, {x: 130, y: 130}, {x: 150, y: 50}, {x: 170, y: 50} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(170, 30); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.moveTo(150, 50); ctx.lineTo(170, 50); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Д': {
        points: [ {x: 130, y: 130}, {x: 170, y: 130}, {x: 150, y: 30}, {x: 130, y: 130}, {x: 170, y: 130}, {x: 130, y: 150}, {x: 170, y: 150} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 130); ctx.lineTo(170, 130); ctx.lineTo(150, 30); ctx.lineTo(130, 130); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(130, 150); ctx.lineTo(170, 150); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Е': {
        points: [ {x: 170, y: 30}, {x: 130, y: 30}, {x: 130, y: 130}, {x: 170, y: 130}, {x: 130, y: 80}, {x: 160, y: 80} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(170, 30); ctx.lineTo(130, 30); ctx.lineTo(130, 130); ctx.lineTo(170, 130); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(130, 80); ctx.lineTo(160, 80); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Є': {
        points: [ {x: 170, y: 50}, {x: 150, y: 30}, {x: 130, y: 50}, {x: 150, y: 80}, {x: 170, y: 110}, {x: 150, y: 130}, {x: 130, y: 110}, {x: 150, y: 80}, {x: 170, y: 80} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.arc(150, 80, 50, Math.PI * 1.2, Math.PI * 1.8, false); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(130, 80); ctx.lineTo(170, 80); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ж': {
        points: [ {x: 130, y: 30}, {x: 170, y: 130}, {x: 170, y: 30}, {x: 130, y: 130}, {x: 150, y: 80}, {x: 130, y: 80}, {x: 170, y: 80} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(170, 130); ctx.moveTo(170, 30); ctx.lineTo(130, 130); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'З': {
        points: [ {x: 130, y: 50}, {x: 170, y: 50}, {x: 150, y: 80}, {x: 170, y: 110}, {x: 130, y: 110} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.arc(150, 65, 20, Math.PI, 0, false); ctx.stroke();
            ctx.beginPath(); ctx.arc(150, 95, 20, Math.PI, 0, false); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'И': {
        points: [ {x: 130, y: 130}, {x: 130, y: 30}, {x: 170, y: 130}, {x: 170, y: 30} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 130); ctx.lineTo(130, 30); ctx.lineTo(170, 130); ctx.lineTo(170, 30); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'І': {
        points: [ {x: 150, y: 30}, {x: 150, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ї': {
        points: [ {x: 150, y: 30}, {x: 150, y: 130}, {x: 145, y: 20}, {x: 155, y: 20} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.stroke();
            ctx.beginPath(); ctx.arc(145, 20, 2, 0, 2 * Math.PI); ctx.arc(155, 20, 2, 0, 2 * Math.PI); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Й': {
        points: [ {x: 150, y: 30}, {x: 150, y: 130}, {x: 140, y: 20}, {x: 160, y: 20} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.stroke();
            ctx.beginPath(); ctx.arc(150, 20, 10, Math.PI, 0, false); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'К': {
        points: [ {x: 130, y: 30}, {x: 130, y: 130}, {x: 130, y: 80}, {x: 170, y: 30}, {x: 130, y: 80}, {x: 170, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(130, 80); ctx.lineTo(170, 30); ctx.moveTo(130, 80); ctx.lineTo(170, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Л': {
        points: [ {x: 130, y: 130}, {x: 150, y: 30}, {x: 170, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 130); ctx.lineTo(150, 30); ctx.lineTo(170, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'М': {
        points: [ {x: 130, y: 130}, {x: 130, y: 30}, {x: 150, y: 80}, {x: 170, y: 30}, {x: 170, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 130); ctx.lineTo(130, 30); ctx.lineTo(150, 80); ctx.lineTo(170, 30); ctx.lineTo(170, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Н': {
        points: [ {x: 130, y: 30}, {x: 130, y: 130}, {x: 170, y: 30}, {x: 170, y: 130}, {x: 130, y: 80}, {x: 170, y: 80} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.moveTo(170, 30); ctx.lineTo(170, 130); ctx.moveTo(130, 80); ctx.lineTo(170, 80); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'О': {
        points: [ {x: 150, y: 80}, {x: 170, y: 80}, {x: 150, y: 100}, {x: 130, y: 80}, {x: 150, y: 60} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.arc(150, 80, 50, 0, 2 * Math.PI); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'П': {
        points: [ {x: 130, y: 130}, {x: 130, y: 30}, {x: 170, y: 30}, {x: 170, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 130); ctx.lineTo(130, 30); ctx.lineTo(170, 30); ctx.lineTo(170, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Р': {
        points: [ {x: 130, y: 130}, {x: 130, y: 30}, {x: 170, y: 30}, {x: 170, y: 80}, {x: 130, y: 80} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 130); ctx.lineTo(130, 30); ctx.lineTo(170, 30); ctx.lineTo(170, 80); ctx.lineTo(130, 80); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'С': {
        points: [ {x: 170, y: 50}, {x: 150, y: 30}, {x: 130, y: 50}, {x: 130, y: 110}, {x: 150, y: 130}, {x: 170, y: 110} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.arc(150, 80, 50, Math.PI * 1.2, Math.PI * 1.8, false); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Т': {
        points: [ {x: 130, y: 30}, {x: 170, y: 30}, {x: 150, y: 30}, {x: 150, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(170, 30); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'У': {
        points: [ {x: 150, y: 30}, {x: 150, y: 80}, {x: 130, y: 130}, {x: 170, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(150, 30); ctx.lineTo(150, 80); ctx.lineTo(130, 130); ctx.moveTo(150, 80); ctx.lineTo(170, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ф': {
        points: [ {x: 150, y: 30}, {x: 150, y: 130}, {x: 130, y: 80}, {x: 170, y: 80} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.stroke();
            ctx.beginPath(); ctx.arc(150, 80, 20, 0, 2 * Math.PI); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Х': {
        points: [ {x: 130, y: 30}, {x: 170, y: 130}, {x: 170, y: 30}, {x: 130, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(170, 130); ctx.moveTo(170, 30); ctx.lineTo(130, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ц': {
        points: [ {x: 130, y: 30}, {x: 130, y: 130}, {x: 170, y: 30}, {x: 170, y: 130}, {x: 170, y: 150} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.moveTo(170, 30); ctx.lineTo(170, 150); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ч': {
        points: [ {x: 170, y: 30}, {x: 170, y: 80}, {x: 130, y: 80}, {x: 130, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(170, 30); ctx.lineTo(170, 80); ctx.lineTo(130, 80); ctx.lineTo(130, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ш': {
        points: [ {x: 130, y: 30}, {x: 130, y: 130}, {x: 150, y: 30}, {x: 150, y: 130}, {x: 170, y: 30}, {x: 170, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.moveTo(170, 30); ctx.lineTo(170, 130); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Щ': {
        points: [ {x: 130, y: 30}, {x: 130, y: 130}, {x: 150, y: 30}, {x: 150, y: 130}, {x: 170, y: 30}, {x: 170, y: 150} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.moveTo(150, 30); ctx.lineTo(150, 130); ctx.moveTo(170, 30); ctx.lineTo(170, 150); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ь': {
        points: [ {x: 130, y: 30}, {x: 130, y: 130}, {x: 150, y: 80}, {x: 170, y: 130} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.stroke();
            ctx.beginPath(); ctx.arc(150, 105, 20, Math.PI, 0, false); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Ю': {
        points: [ {x: 130, y: 30}, {x: 130, y: 130}, {x: 170, y: 80}, {x: 150, y: 80} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(130, 30); ctx.lineTo(130, 130); ctx.stroke();
            ctx.beginPath(); ctx.arc(160, 80, 20, 0, 2 * Math.PI); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    },
    'Я': {
        points: [ {x: 170, y: 130}, {x: 130, y: 130}, {x: 150, y: 80}, {x: 130, y: 30}, {x: 170, y: 30} ],
        draw: function(ctx) {
            ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(170, 130); ctx.lineTo(130, 130); ctx.lineTo(150, 80); ctx.lineTo(130, 30); ctx.lineTo(170, 30); ctx.stroke();
            ctx.setLineDash([]); ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 3;
        }
    }
};

function practiceWriting(letter = 'А') {
    const writingArea = document.getElementById("writingArea");
    writingArea.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 150;
    canvas.style.border = '2px solid #ddd';
    canvas.style.borderRadius = '10px';
    canvas.style.backgroundColor = 'white';
    canvas.style.cursor = 'crosshair';
    canvas.style.marginBottom = '10px';
    const ctx = canvas.getContext('2d');
    const ref = referenceLetters[letter] || referenceLetters['А'];
    const referencePoints = ref.points;
    let userPoints = [];
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    function drawLetter() {
        ref.draw(ctx);
    }
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if (e.touches && e.touches[0]) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        } else {
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
    }
    function startDrawing(e) {
        isDrawing = true;
        const pos = getMousePos(e);
        lastX = pos.x;
        lastY = pos.y;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        userPoints.push({x: lastX, y: lastY});
    }
    function draw(e) {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        const currentX = pos.x;
        const currentY = pos.y;
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        lastX = currentX;
        lastY = currentY;
        userPoints.push({x: currentX, y: currentY});
    }
    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLetter();
        userPoints = [];
    }
    function finishDrawing() {
        const DIST_THRESHOLD = 15;
        const MIN_PERCENT = 0.7;
        let closePoints = 0;
        for (let i = 0; i < userPoints.length; i++) {
            const up = userPoints[i];
            let minDist = Infinity;
            for (let j = 0; j < referencePoints.length; j++) {
                const rp = referencePoints[j];
                const dist = Math.sqrt((up.x - rp.x) ** 2 + (up.y - rp.y) ** 2);
                if (dist < minDist) minDist = dist;
            }
            if (minDist < DIST_THRESHOLD) closePoints++;
        }
        const percent = userPoints.length > 0 ? closePoints / userPoints.length : 0;
        if (percent >= MIN_PERCENT) {
            showCelebration(`✅ Молодець! Ти обвів букву ${letter}!`, "correct");
        } else {
            showCelebration(`🔄 Спробуй ще раз, малюй ближче до контуру!`, "incorrect");
        }
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLetter();
            userPoints = [];
        }, 200);
    }
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    });
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('touchend', stopDrawing);
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '🧹 Очистити';
    clearBtn.className = 'btn btn-secondary';
    clearBtn.onclick = clearCanvas;
    const finishBtn = document.createElement('button');
    finishBtn.textContent = '✅ Готово';
    finishBtn.className = 'btn btn-primary';
    finishBtn.onclick = finishDrawing;
    writingArea.appendChild(canvas);
    writingArea.appendChild(clearBtn);
    writingArea.appendChild(finishBtn);
    drawLetter();
} 