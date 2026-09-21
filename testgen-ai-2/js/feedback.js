window._currentRating = 0;

window.setRating = function(val) {
    window._currentRating = val;
    const labels = ['', 'Лошо', 'Слабо', 'Добро', 'Многу добро', 'Одлично'];
    document.querySelectorAll('.star-icon').forEach(star => {
        const starVal = parseInt(star.dataset.val);
        star.className = starVal <= val ? 'bi bi-star-fill star-icon' : 'bi bi-star star-icon';
    });
    const label = document.getElementById('rating-label');
    if (label) label.textContent = val > 0 ? labels[val] : '';
};

window.submitFeedback = async function() {
    const rating = window._currentRating;
    if (!rating) {
        alert('Избери оценка (1-5 ѕвездички)!');
        return;
    }

    const comment = document.getElementById('feedback-comment')?.value || '';
    const meta = window._currentFeedbackMeta || {};
    const user = window.auth?.currentUser;

    try {
        await window.fbDb.addDoc(window.fbDb.collection(window.db, 'feedback'), {
            userId: user ? user.uid : 'anonymous',
            userEmail: user ? user.email : 'anonymous',
            prompt: meta.prompt || '',
            model: meta.model || '',
            framework: meta.framework || '',
            rating,
            comment,
            timestamp: new Date()
        });

        const successEl = document.getElementById('feedback-success');
        if (successEl) successEl.style.display = 'block';

        const section = document.getElementById('feedback-section');
        setTimeout(() => { if (section) section.style.display = 'none'; }, 3000);
    } catch (err) {
        console.error('Feedback грешка:', err);
        alert('Грешка при праќање на feedback. Обиди се повторно.');
    }
};
