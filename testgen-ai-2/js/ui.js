// Global state
window.selectedModel = 'gpt4';
window.lastGeneratedCode = '';

window.showPage = function(pageName) {
    const pages = ['landing-page', 'login-page', 'generator-page', 'comparison-page', 'history-page'];
    pages.forEach(page => {
        const el = document.getElementById(page);
        if (el) el.style.display = 'none';
    });

    const pageMap = {
        'home': 'landing-page',
        'login': 'login-page',
        'generator': 'generator-page',
        'comparison': 'comparison-page',
        'history': 'history-page'
    };

    const pageToShow = pageMap[pageName];
    if (pageToShow) {
        const el = document.getElementById(pageToShow);
        if (el) el.style.display = 'block';
    }

    // Update active nav link
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => link.classList.remove('active'));
    const pageLabels = {
        'home': 'Почетна',
        'generator': 'Генератор',
        'comparison': 'Споредба',
        'history': 'Историја'
    };
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        if (link.textContent.trim() === pageLabels[pageName]) {
            link.classList.add('active');
        }
    });

    if (pageName === 'history' && typeof window.loadUserHistory === 'function') {
        window.loadUserHistory();
    }

    // Collapse mobile nav
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && navCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navCollapse).hide();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.selectModel = function(card, model) {
    window.selectedModel = model;
    document.querySelectorAll('.model-card').forEach(c => {
        c.classList.remove('active');
        const icon = c.querySelector('.model-check');
        if (icon) {
            icon.className = 'bi bi-circle model-check';
            icon.style.color = 'var(--border-color)';
        }
    });
    card.classList.add('active');
    const icon = card.querySelector('.model-check');
    if (icon) {
        icon.className = 'bi bi-check-circle-fill text-success model-check';
        icon.style.color = '';
    }
};

window.getSelectedFramework = function() {
    const checked = document.querySelector('input[name="framework"]:checked');
    return checked ? checked.value : 'selenium';
};

window.copyCode = function() {
    if (!window.lastGeneratedCode) return;
    navigator.clipboard.writeText(window.lastGeneratedCode).then(() => {
        const btn = document.querySelector('#generate-btn')?.closest('.row')?.parentElement?.querySelector('.copy-btn');
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check2"></i> Копирано!';
            setTimeout(() => btn.innerHTML = orig, 2000);
        }
    });
};

window.copyComparisonCode = function(model) {
    const el = document.getElementById(model + '-output');
    if (!el || !el.textContent.trim()) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
        // brief feedback could go here
    });
};

window.downloadCode = function() {
    if (!window.lastGeneratedCode) {
        alert('Нема генериран код за преземање.');
        return;
    }
    const framework = window.getSelectedFramework();
    const ext = framework === 'selenium' ? 'py' : 'js';
    const filename = 'test_generated.' + ext;
    const blob = new Blob([window.lastGeneratedCode], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
};

window.saveToHistory = async function() {
    if (!window.lastGeneratedCode) {
        alert('Нема генериран код за зачувување.');
        return;
    }
    const prompt = document.getElementById('test-instructions')?.value || '';
    const framework = window.getSelectedFramework();
    if (typeof window.saveTestToHistory === 'function') {
        await window.saveTestToHistory(prompt, window.lastGeneratedCode, window.selectedModel, framework);
        alert('Тестот е зачуван во историја!');
    } else {
        alert('Најави се за да зачуваш во историја.');
    }
};
