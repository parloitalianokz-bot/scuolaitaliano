// ============================================
// DATI RECENSIONI PER IL CAROSELLO
// ============================================
const reviewsData = [
    {
        name: "Аза Тилинчинова",
        image: "images/aza.avif",
        text: "Антонио - замечательный преподаватель. Очень терпеливо и качественно объясняет изучаемые темы. Мой выбор обучения - онлайн, так как он выигрышный! Преподаватель с тобой - в режиме реального времени. Пройденные уроки - сохраняются в записи, а материалы - бесплатны!"
    },
    {
        name: "Алина Кулбаева",
        image: "images/alina.avif",
        text: "Та методика, которую использует Антонио, я считаю эффективной. Каждый урок мы повторяем правила, и практикуемся на заданиях. Задания становятся все сложнее, что мне очень нравится. Тексты очень интересные и забавные. За год обучения я уже хорошо изучила грамматику, приобрела весомый запас слов и научилась рассказывать о себе. Рекомендую всем школу Антонио, вы точно не пожалеете!"
    },
    {
        name: "Сауле Имангазиева",
        image: "images/saule.avif",
        text: "О школе Антонио Марини я узнала в интернете. Занимаюсь второй год. С нетерпением жду каждого занятия. Уроки пролетают незаметно! Поражает лёгкость подачи материала, кругозор и эрудиция преподавателя. Свободно говорит по русски, приводит в пример аналогии с русским, английским и даже казахским языками. Может свободно порассуждать о русской литературе. Уроки проходят в онлайн режиме в группе по два- три человека. читаем и переводим текст, затем работаем с текстом, делаем упражнения, ведём диалоги. Ведётся видео запись урока. Все материалы урока доступны онлайн. Всегда интересны рассказы об Италии, ее истории, культуре, традициях. Скоро заканчиваются уроки в учебнике, но я не хочу прекращать занятия!"
    },
    {
        name: "Марина Богомолова",
        image: "images/marina.avif",
        text: "Сложно назвать школу Antonio Marini «языковыми курсами или школой», этот удивительный стиль преподавания, такой легкий, интересный и жизненный. Для меня это скорее кусочек Италии. Это тот редкий случай, когда академические знания остаются в тебе без осознанности."
    },
    {
        name: "Оксана Данильченко",
        image: "images/oxana.avif",
        text: "Ничего в этой жизни не бывает случайно. Все почему-то и зачем-то. Почему-то вдруг расхотелось учить такой нужный и полезный, бесконечно изучаемый на стадии продолжающий и немогущий закончить английский язык, и поделать что-то совершенно ненужное, но приятное. Уроки Антонио проходят в непринужденной обстановке и раскрывают тему культуры, искусства и обычаев жителей Италии в разных регионах. Благодаря разностороннему подходу мне удалось сдать очень сложные тесты по туристическому направлению Италия, и о чудо, выиграть поездку на Сардинию! Вот такая неслучайность! Уверена, что без труда смогу общаться с итальянцами. Даже если не хватит слов, ведь язык итальянских жестов мы тоже изучили ). Grazie mille signor Antonio!"
    }
];

// ============================================
// CAROSELLO RECENSIONI
// ============================================
let currentSlide = 0;
let slideInterval;
const slidesContainer = document.getElementById('testimonialSlides');
const dotsContainer = document.getElementById('carouselDots');

function buildCarousel() {
    // Crea le slide
    reviewsData.forEach((review, index) => {
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `
            <div class="testimonial-slide-content">
                <div class="testimonial-slide-image">
                    <img src="${review.image}" alt="${review.name}" loading="lazy" />
                </div>
                <div class="testimonial-slide-text">
                    <blockquote>${review.text}</blockquote>
                    <cite>— ${review.name}</cite>
                </div>
            </div>
        `;
        slidesContainer.appendChild(slide);

        // Crea i pallini
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Vai alla recensione ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    const slides = slidesContainer.querySelectorAll('.testimonial-slide');
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentSlide = index;
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function startCarousel() {
    if (slidesContainer && slidesContainer.children.length > 0) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

function stopCarousel() {
    clearInterval(slideInterval);
}

// ============================================
// MENU HAMBURGER (toggle)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        // Apri/chiudi al click sull'hamburger
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Chiudi il menu quando un link viene cliccato
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });

        // Chiudi il menu quando si clicca fuori (opzionale)
        document.addEventListener('click', function(event) {
            const isClickInside = navToggle.contains(event.target) || navMenu.contains(event.target);
            if (!isClickInside) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    }
});

// ============================================
// GESTIONE INVIO MODULO CONTATTI
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // ===== CAROSELLO =====
    if (slidesContainer) {
        buildCarousel();
        startCarousel();

        // Pausa al passaggio del mouse
        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopCarousel);
            carousel.addEventListener('mouseleave', startCarousel);
        }
    }

    // ===== MODULO CONTATTI =====
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email) {
                status.textContent = '❌ Пожалуйста, заполните имя и email.';
                status.style.color = '#cc3333';
                return;
            }

            const subjectInput = form.querySelector('input[name="_subject"]');
            if (subjectInput) {
                subjectInput.value = `Nuovo messaggio da ${name} - Parlo Italiano!`;
            }

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
    }
});