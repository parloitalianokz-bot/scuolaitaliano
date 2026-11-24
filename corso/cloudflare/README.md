# Revisione IA di es_a con Worker e Gemini

Questa prima integrazione protegge la chiave Gemini lato server. Il Worker accetta richieste dal solo dominio configurato, verifica la firma e le claim del token Firebase Authentication e autorizza esclusivamente l'account docente indicato. La pagina invia solo i dati didattici della scheda e la domanda (non il nome dello studente); il prompt di sistema viene costruito nel Worker.

## Configurazione gratuita

1. Crea una chiave Gemini in Google AI Studio e controlla nel tuo account le quote, la disponibilità del modello e le condizioni aggiornate del piano gratuito. Non inserirla nei file del sito.
2. Crea un Worker Cloudflare usando `worker.js` come entry point. Il piano Workers Free può bastare per un uso contenuto, ma non garantisce quote Gemini illimitate né assenza assoluta di costi: verifica i limiti e le condizioni attuali di entrambi i servizi.
3. Nelle variabili del Worker imposta `FIREBASE_PROJECT_ID` a `esercizi-parlo-italiano`, `AUTHORIZED_TEACHER_EMAIL` all'account docente autorizzato e `ALLOWED_ORIGIN` all'origine esatta del sito (solo protocollo e dominio, senza percorso o slash finale; per esempio `https://esempio.it`). Aggiungi `GEMINI_MODEL` con un modello disponibile nel piano gratuito del tuo account, per esempio `gemini-2.5-flash` se è disponibile.
4. Aggiungi `GEMINI_API_KEY` come **Secret** del Worker, non come variabile in chiaro. Pubblica il Worker e annota il suo URL `workers.dev`.
5. In `u_001/001_es_a.html`, sostituisci il valore vuoto di `window.PARLO_AI_REVIEW_URL` con l'URL completo del Worker seguito da `/review`, ad esempio `https://nome-worker.account.workers.dev/review`. Pubblica poi il sito.
6. L'accesso Google del docente deve continuare a usare Firebase Authentication nel dominio del sito. Il Worker verifica direttamente il token Firebase: non considera sufficiente la sessione salvata nel browser.

Prima di inviare il feedback allo studente, l'insegnante deve leggerlo e premere **Salva feedback per lo studente**. Evita di inserire nomi o altri dati personali nella risposta dello studente. Le risposte generate dall'IA possono contenere errori e vanno sempre controllate.
