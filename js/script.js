// ============================================
// Validazione campi form (bianco → azzurro)
// ============================================

function validateField(input) {
    // Se il campo è vuoto, rimuovi la classe 'valid'
    if (input.value.trim() === '') {
        input.classList.remove('valid');
        return;
    }
    
    // Per il campo email: verifica che sia un'email valida
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(input.value.trim())) {
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
        }
        return;
    }
    
    // Per il campo telefono: verifica che abbia almeno 5 caratteri
    if (input.type === 'tel') {
        if (input.value.trim().length >= 5) {
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
        }
        return;
    }
    
    // Per tutti gli altri campi (text, textarea): se non è vuoto, è valido
    if (input.value.trim() !== '') {
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
    }
}

// Inizializza i campi al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    inputs.forEach(function(input) {
        // Se il campo è già compilato (es. autofill), valida subito
        if (input.value.trim() !== '') {
            validateField(input);
        }
    });
});


// ============================================
// Gestione invio del modulo di contatto
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Raccogli i dati
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validazione base
        if (!name || !email) {
            status.textContent = '❌ Пожалуйста, заполните имя и email.';
            status.style.color = '#cc3333';
            return;
        }

        // 🔥 AGGIORNA L'OGGETTO CON IL NOME DELL'UTENTE (PRIMA DELL'INVIO)
        const subjectInput = form.querySelector('input[name="_subject"]');
        if (subjectInput) {
            subjectInput.value = `Nuovo messaggio da ${name} - Parlo Italiano!`;
        }

        // Disabilita il pulsante durante l'invio
        const btn = form.querySelector('.btn-primary');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = '⏳ Отправка...';
        status.textContent = '';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.textContent = '✅ Спасибо! Мы свяжемся с вами в ближайшее время.';
                status.style.color = '#2a7a2a';
                form.reset();
                
                // Reset dell'oggetto al valore predefinito dopo l'invio
                if (subjectInput) {
                    subjectInput.value = 'Nuovo messaggio dal sito Parlo Italiano!';
                }
            } else {
                throw new Error('Errore di invio');
            }
        } catch (error) {
            status.textContent = '❌ Ошибка отправки. Попробуйте еще раз.';
            status.style.color = '#cc3333';
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
});