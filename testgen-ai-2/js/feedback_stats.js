window.loadFeedbackStats = async function() {
    const container = document.getElementById('feedback-stats-container');
    if (!container) return;

    container.innerHTML = '<p class="text-secondary" style="font-size:0.85rem"><i class="bi bi-hourglass-split"></i> Вчитувам оценки...</p>';

    try {
        const q = window.fbDb.query(
            window.fbDb.collection(window.db, 'feedback')
        );
        const snapshot = await window.fbDb.getDocs(q);

        const stats = { gpt4: { sum: 0, count: 0 }, claude: { sum: 0, count: 0 }, gemini: { sum: 0, count: 0 } };

        snapshot.forEach(doc => {
            const d = doc.data();
            const model = d.model;
            if (stats[model] !== undefined && d.rating) {
                stats[model].sum += d.rating;
                stats[model].count++;
            }
        });

        const total = Object.values(stats).reduce((a, b) => a + b.count, 0);

        if (total === 0) {
            container.innerHTML = '<p class="text-secondary" style="font-size:0.85rem"><i class="bi bi-info-circle"></i> Сè уште нема корисничи оценки. Генерирај тест и остави feedback!</p>';
            return;
        }

        const modelInfo = {
            gpt4:  { name: 'GPT-4 Turbo',  cls: 'gpt' },
            claude: { name: 'Claude 3.5',   cls: 'claude' },
            gemini: { name: 'Gemini Pro',   cls: 'gemini' }
        };

        let best = null;
        let bestAvg = 0;

        let html = '<div class="row g-3">';
        for (const [key, s] of Object.entries(stats)) {
            const avg = s.count > 0 ? (s.sum / s.count).toFixed(1) : null;
            if (avg && parseFloat(avg) > bestAvg) { bestAvg = parseFloat(avg); best = key; }
            const stars = avg ? renderStars(parseFloat(avg)) : '';
            const { name, cls } = modelInfo[key];
            html += `
            <div class="col-md-4">
              <div class="feedback-stat-card">
                <span class="model-badge ${cls}" style="margin-bottom:8px;display:inline-block">${name}</span>
                <div class="fs-stars">${stars}</div>
                <div class="fs-avg">${avg ? avg + ' / 5' : 'Нема оценки'}</div>
                <div class="fs-count">${s.count} оценк${s.count === 1 ? 'а' : 'и'}</div>
              </div>
            </div>`;
        }
        html += '</div>';

        if (best) {
            html += `<div class="mt-3 p-3 rounded" style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3)">
                <i class="bi bi-trophy-fill" style="color:#f59e0b"></i>
                <strong>Најдобро оценет модел од корисниците:</strong>
                <span class="model-badge ${modelInfo[best].cls}" style="margin:0 6px">${modelInfo[best].name}</span>
                со просечна оценка <strong>${bestAvg} ⭐</strong>
            </div>`;
        }

        container.innerHTML = html;
    } catch (err) {
        console.error('Feedback stats грешка:', err);
        container.innerHTML = '<p class="text-secondary" style="font-size:0.85rem">Неможе да се вчитаат оценките.</p>';
    }
};

function renderStars(avg) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (avg >= i) html += '<i class="bi bi-star-fill" style="color:#f59e0b"></i>';
        else if (avg >= i - 0.5) html += '<i class="bi bi-star-half" style="color:#f59e0b"></i>';
        else html += '<i class="bi bi-star" style="color:#f59e0b"></i>';
    }
    return html;
}
