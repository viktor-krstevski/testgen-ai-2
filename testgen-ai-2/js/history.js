window.saveTestToHistory = async function(prompt, generatedCode, model, framework) {
    const user = window.auth?.currentUser;
    if (!user) return;

    try {
        await window.fbDb.addDoc(window.fbDb.collection(window.db, "test_history"), {
            userId: user.uid,
            userEmail: user.email,
            prompt: prompt,
            code: generatedCode,
            model: model || 'gpt4',
            framework: framework || 'selenium',
            timestamp: new Date()
        });
        console.log("Тестот е успешно зачуван во Firestore!");
    } catch (error) {
        console.error("Грешка при зачувување во историја:", error);
    }
};

window.loadUserHistory = async function() {
    const user = window.auth?.currentUser;
    const container = document.getElementById('history-container');

    if (!container) return;

    if (!user) {
        container.innerHTML = '<p class="text-secondary text-center py-5"><i class="bi bi-lock" style="font-size: 2rem;"></i><br>Најави се за да ја видиш историјата.</p>';
        return;
    }

    container.innerHTML = '<p class="text-center text-secondary py-4"><span class="loading-dots"><span>.</span><span>.</span><span>.</span></span> Вчитувам историја...</p>';

    try {
        const q = window.fbDb.query(
            window.fbDb.collection(window.db, "test_history"),
            window.fbDb.where("userId", "==", user.uid),
            window.fbDb.orderBy("timestamp", "desc")
        );

        const snapshot = await window.fbDb.getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = '<p class="text-secondary text-center py-5"><i class="bi bi-inbox" style="font-size: 2rem;"></i><br>Нема зачувани тестови. Генерирај го твојот прв тест!</p>';
            return;
        }

        const modelNames = { gpt4: 'GPT-4', claude: 'Claude', gemini: 'Gemini' };
        const modelClasses = { gpt4: 'gpt', claude: 'claude', gemini: 'gemini' };

        let html = '';
        window._historyItems = [];

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const docId = docSnap.id;
            window._historyItems.push({ id: docId, ...data });

            const date = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
            const dateStr = date.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric' })
                + ' ' + date.toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' });

            const promptPreview = (data.prompt || '').length > 80
                ? data.prompt.substring(0, 80) + '...'
                : (data.prompt || 'Без опис');

            const modelClass = modelClasses[data.model] || 'gpt';
            const modelName = modelNames[data.model] || data.model || 'GPT-4';
            const frameworkName = data.framework === 'playwright' ? 'Playwright' : 'Selenium';

            html += `
            <div class="history-item" data-model="${data.model || ''}" data-prompt="${(data.prompt || '').toLowerCase()}">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="mb-1">${escapeHtml(promptPreview)}</h5>
                        <span class="model-badge ${modelClass}">${modelName}</span>
                        <span class="badge badge-custom">${frameworkName}</span>
                    </div>
                    <div class="text-end">
                        <small class="text-secondary">${dateStr}</small>
                        <div class="mt-2 d-flex gap-1">
                            <button class="btn btn-sm copy-btn" onclick="viewHistoryItem('${docId}')">
                                <i class="bi bi-eye"></i> Прегледај
                            </button>
                            <button class="btn btn-sm copy-btn" onclick="deleteHistoryItem('${docId}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error("Грешка при вчитување историја:", error);
        container.innerHTML = '<p class="text-danger text-center py-4"><i class="bi bi-exclamation-triangle"></i> Грешка при вчитување. Обиди се повторно.</p>';
    }
};

window.viewHistoryItem = function(docId) {
    const item = (window._historyItems || []).find(i => i.id === docId);
    if (!item) return;

    window.lastGeneratedCode = item.code;
    window.showPage('generator');

    const codeOutput = document.getElementById('code-output');
    const instructions = document.getElementById('test-instructions');
    if (codeOutput) codeOutput.textContent = item.code;
    if (instructions) instructions.value = item.prompt || '';
};

window.deleteHistoryItem = async function(docId) {
    if (!confirm('Дали си сигурен дека сакаш да го избришеш овој тест?')) return;

    try {
        await window.fbDb.deleteDoc(window.fbDb.doc(window.db, "test_history", docId));
        await window.loadUserHistory();
    } catch (error) {
        console.error("Грешка при бришење:", error);
        alert("Грешка при бришење.");
    }
};

window.filterHistory = function() {
    const search = (document.getElementById('history-search')?.value || '').toLowerCase();
    const model = document.getElementById('history-filter')?.value || 'all';

    document.querySelectorAll('.history-item').forEach(item => {
        const matchModel = model === 'all' || item.dataset.model === model;
        const matchSearch = !search || (item.dataset.prompt || '').includes(search);
        item.style.display = (matchModel && matchSearch) ? 'block' : 'none';
    });
};

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
