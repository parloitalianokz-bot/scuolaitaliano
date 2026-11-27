// Catalogo esercizi — Unità 2: Un bravo ragazzo (A0/A1 · IT / RU)
window.HOMEWORK_EXERCISES_CATALOG = window.HOMEWORK_EXERCISES_CATALOG || {};
window.HOMEWORK_EXERCISES_CATALOG["2"] = {
  unitNumber: 2,
  unitSlug: "u_002",
  unitTitle: "Unità 2 · Un bravo ragazzo / Хороший мальчик",
  level: "A0/A1",
  description: "Quaranta attività in cinque sessioni progressive: il racconto di Marco, numeri ed età, plurali, essere e avere, presente e verbi fare, dire e bere. Ogni sessione comprende due esercizi per ciascuna macro-categoria; le risposte aperte richiedono la revisione dell’insegnante. / Сорок заданий в пяти занятиях: рассказ о Марко, числа и возраст, множественное число, essere и avere, настоящее время и глаголы fare, dire, bere. В каждом занятии по два задания каждого типа; открытые ответы проверяет преподаватель.",
  sessions: [
    { number: 1, title: "Sessione 1 · Il racconto e le espressioni con avere / Рассказ и выражения с avere" },
    { number: 2, title: "Sessione 2 · Numeri, età e mini-dialoghi / Числа, возраст и мини-диалоги" },
    { number: 3, title: "Sessione 3 · Singolare, plurale e descrizioni / Единственное и множественное число, описания" },
    { number: 4, title: "Sessione 4 · Essere, avere e presente / Essere, avere и настоящее время" },
    { number: 5, title: "Sessione 5 · Fare, dire, bere e il racconto di Marco / Fare, dire, bere и рассказ о Марко" }
  ],
  defaultExerciseIds: [
    "u002_s1_matching", "u002_s1_comprensione", "u002_s1_ordine", "u002_s1_ricostruzione",
    "u002_s1_cloze", "u002_s1_tabella", "u002_s1_risposte", "u002_s1_produzione"
  ],
  exercises: [
    // Sessione 1 — il racconto e le espressioni con avere
    {
      id: "u002_s1_matching", unitNumber: 2, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "1.1 Abbina le situazioni alle espressioni con avere / Соедини ситуации с выражениями с avere",
      instructions: "Le immagini restano fisse a sinistra. Scegli nel menu a destra l’espressione corretta con avere. / Картинки остаются слева. Выбери справа в меню подходящее выражение с avere.",
      options: [
        { value: "A", label: "avere paura" },
        { value: "B", label: "avere sonno" },
        { value: "C", label: "avere freddo" },
        { value: "D", label: "avere fame" },
        { value: "E", label: "avere sete" }
      ],
      items: [
        { id: "m1", visual: "🥤", visualAlt: "un bicchiere d’acqua", prompt: "Immagine: un bicchiere d’acqua", answers: ["E"] },
        { id: "m2", visual: "🍝", visualAlt: "un piatto di pasta", prompt: "Immagine: un piatto di pasta", answers: ["D"] },
        { id: "m3", visual: "🧣", visualAlt: "una sciarpa per il freddo", prompt: "Immagine: una sciarpa per il freddo", answers: ["C"] },
        { id: "m4", visual: "🛏️", visualAlt: "un letto e la luna", prompt: "Immagine: un letto e la luna", answers: ["B"] },
        { id: "m5", visual: "😨", visualAlt: "una persona spaventata", prompt: "Immagine: una persona spaventata", answers: ["A"] }
      ]
    },
    {
      id: "u002_s1_comprensione", unitNumber: 2, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "1.2 Comprendi il racconto / Пойми рассказ",
      instructions: "Scegli la risposta corretta secondo il racconto. / Выбери правильный ответ по рассказу.",
      items: [
        { id: "q1", prompt: "Dove sono Marco e sua madre all’inizio?", options: [{ value: "a", label: "a · Sono in casa." }, { value: "b", label: "b · Sono al ristorante." }, { value: "c", label: "c · Sono a scuola." }], answers: ["a"] },
        { id: "q2", prompt: "Dove si trova Marco?", options: [{ value: "a", label: "a · In cucina" }, { value: "b", label: "b · In camera, a letto" }, { value: "c", label: "c · In giardino" }], answers: ["b"] },
        { id: "q3", prompt: "Che cosa porta la madre quando Marco ha sete?", options: [{ value: "a", label: "a · Una coperta" }, { value: "b", label: "b · Un piatto di pasta" }, { value: "c", label: "c · Un bicchiere d’acqua" }], answers: ["c"] },
        { id: "q4", prompt: "Che cosa porta la madre quando Marco ha fame?", options: [{ value: "a", label: "a · Un piatto di pasta" }, { value: "b", label: "b · Un bicchiere d’acqua" }, { value: "c", label: "c · Una finestra" }], answers: ["a"] },
        { id: "q5", prompt: "Che cosa fa la madre quando Marco ha freddo?", options: [{ value: "a", label: "a · Apre la porta" }, { value: "b", label: "b · Porta una coperta" }, { value: "c", label: "c · Prepara un caffè" }], answers: ["b"] },
        { id: "q6", prompt: "Quanti anni ha Marco?", options: [{ value: "a", label: "a · Trentacinque" }, { value: "b", label: "b · Quindici" }, { value: "c", label: "c · Cinquanta" }], answers: ["a"] }
      ]
    },
    {
      id: "u002_s1_ordine", unitNumber: 2, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      requireItemSubmission: true,
      title: "1.3 Riordina le frasi del racconto / Составь предложения из рассказа",
      instructions: "Riordina le parole per ricostruire le frasi. / Расставь слова по порядку, чтобы составить предложения.",
      items: [
        { id: "o1", prompt: "La mamma e Marco", words: ["casa.", "in", "sono", "La", "mamma", "e", "Marco"], answers: [3, 4, 5, 6, 2, 1, 0] },
        { id: "o2", prompt: "Marco", words: ["letto.", "a", "è", "Marco"], answers: [3, 2, 1, 0] },
        { id: "o3", prompt: "La madre", words: ["cucina.", "in", "è", "madre", "La"], answers: [4, 3, 2, 1, 0] },
        { id: "o4", prompt: "Marco ha sete", words: ["acqua.", "d’", "bicchiere", "un", "porta", "madre", "La"], answers: [6, 5, 4, 3, 2, 1, 0] },
        { id: "o5", prompt: "Dopo", words: ["la", "Marco", "pasta.", "mangia"], answers: [1, 0, 2, 3] }
      ]
    },
    {
      id: "u002_s1_ricostruzione", unitNumber: 2, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "1.4 Ricostruisci le risposte di Marco / Восстанови ответы Марко",
      instructions: "Metti le parole nell’ordine corretto. / Поставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Quando ha sete", words: ["ho", "sete.", "Mamma,"], answers: [2, 0, 1] },
        { id: "o2", prompt: "Quando ha fame", words: ["fame.", "Mamma,", "ho"], answers: [1, 2, 0] },
        { id: "o3", prompt: "Quando ha freddo", words: ["Mamma,", "freddo.", "ho"], answers: [0, 2, 1] },
        { id: "o4", prompt: "Quando ha paura", words: ["ho", "Mamma,", "paura."], answers: [1, 0, 2] },
        { id: "o5", prompt: "La risposta della madre", words: ["trentacinque", "anni.", "Hai", "già"], answers: [2, 3, 0, 1] }
      ]
    },
    {
      id: "u002_s1_cloze", unitNumber: 2, sessionNumber: 1, tier: "Intermedio",
      tierLabel: "Sessione 1 · 3 Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "1.5 Completa le frasi con essere o avere / Заполни предложения формами essere или avere",
      instructions: "Scrivi la forma corretta di essere o avere. / Напиши правильную форму essere или avere.",
      items: [
        { id: "g1", before: "La mamma e Marco ", after: " in casa.", cue: "essere", answers: ["sono"] },
        { id: "g2", before: "Marco ", after: " a letto.", cue: "essere", answers: ["è"] },
        { id: "g3", before: "La madre ", after: " in cucina.", cue: "essere", answers: ["è"] },
        { id: "g4", before: "Io ", after: " sete.", cue: "avere", answers: ["ho"] },
        { id: "g5", before: "Tu ", after: " trentacinque anni.", cue: "avere", answers: ["hai"] },
        { id: "g6", before: "I bambini ", after: " paura del buio.", cue: "avere", answers: ["hanno"] }
      ]
    },
    {
      id: "u002_s1_tabella", unitNumber: 2, sessionNumber: 1, tier: "Intermedio",
      tierLabel: "Sessione 1 · 3 Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "1.6 Completa la tabella del racconto / Заполни таблицу по рассказу",
      instructions: "Completa la tabella con l’informazione mancante. / Заполни таблицу недостающей информацией.",
      columns: ["Personaggio", "Situazione", "Azione della madre"],
      items: [
        { id: "t1", prompt: "Marco ha sete", cells: ["Marco", "Ha sete", { input: true }], answers: ["porta un bicchiere d’acqua", "porta un bicchiere di acqua"] },
        { id: "t2", prompt: "Marco ha fame", cells: ["Marco", "Ha fame", { input: true }], answers: ["porta un piatto di pasta"] },
        { id: "t3", prompt: "Marco ha freddo", cells: ["Marco", "Ha freddo", { input: true }], answers: ["porta una coperta"] },
        { id: "t4", prompt: "Marco ha sonno", cells: ["Marco", "Ha sonno", { input: true }], answers: ["spegne la luce e chiude la finestra", "spegne la luce e chiude la finestra"] },
        { id: "t5", prompt: "Marco ha paura", cells: ["Marco", "Ha paura", { input: true }], answers: ["gli dice che ha trentacinque anni", "dice che ha trentacinque anni"] }
      ]
    },
    {
      id: "u002_s1_risposte", unitNumber: 2, sessionNumber: 1, tier: "Produzione guidata",
      tierLabel: "Sessione 1 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "1.7 Rispondi sul racconto / Ответь по рассказу",
      instructions: "Rispondi con frasi complete. Risposta aperta: revisione dell’insegnante. / Ответь полными предложениями. Открытый ответ проверяет преподаватель.",
      items: [
        { id: "r1", title: "La mamma e Marco", prompt: "Dove sono la mamma e Marco?" },
        { id: "r2", title: "Le richieste di Marco", prompt: "Che cosa chiede Marco quando ha sete, fame e freddo?" },
        { id: "r3", title: "La paura", prompt: "Che cosa dice la madre quando Marco ha paura?" }
      ]
    },
    {
      id: "u002_s1_produzione", unitNumber: 2, sessionNumber: 1, tier: "Produzione guidata",
      tierLabel: "Sessione 1 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "1.8 Scrivi un breve dialogo / Напиши короткий диалог",
      instructions: "Scrivi 4–6 battute tra Marco e sua madre. Usa almeno tre espressioni con avere. Risposta aperta: revisione dell’insegnante. / Напиши диалог из 4–6 реплик между Марко и его мамой. Используй не менее трёх выражений с avere.",
      items: [{ id: "p1", title: "A casa", prompt: "Puoi usare: avere sete, avere fame, avere freddo, avere sonno, avere paura." }]
    },

    // Sessione 2 — numeri, età e mini-dialoghi
    {
      id: "u002_s2_numeri_abbinamento", unitNumber: 2, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "2.1 Abbina i numeri alle parole / Соедини цифры и слова",
      instructions: "Abbina ogni numero alla forma scritta corretta. / Соедини каждое число с правильным написанием.",
      options: [
        { value: "A", label: "A · ventotto" }, { value: "B", label: "B · tredici" },
        { value: "C", label: "C · quaranta" }, { value: "D", label: "D · ventuno" },
        { value: "E", label: "E · cento" }, { value: "F", label: "F · mille" }
      ],
      items: [
        { id: "m1", prompt: "13", answers: ["B"] }, { id: "m2", prompt: "21", answers: ["D"] },
        { id: "m3", prompt: "28", answers: ["A"] }, { id: "m4", prompt: "40", answers: ["C"] },
        { id: "m5", prompt: "100", answers: ["E"] }, { id: "m6", prompt: "1.000", answers: ["F"] }
      ]
    },
    {
      id: "u002_s2_dialoghi_mc", unitNumber: 2, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "2.2 Scegli la risposta adatta / Выбери подходящий ответ",
      instructions: "Completa ogni mini-dialogo scegliendo la risposta corretta. / Выбери правильный ответ в каждом мини-диалоге.",
      items: [
        { id: "q1", prompt: "— Chi è Gianni? — Gianni...", options: [{ value: "a", label: "a · È italiano." }, { value: "b", label: "b · Ha vent’anni." }, { value: "c", label: "c · È venti anni." }], answers: ["a"] },
        { id: "q2", prompt: "— Quanti anni ha Anna? — Anna...", options: [{ value: "a", label: "a · è diciotto anni" }, { value: "b", label: "b · ha diciotto anni" }, { value: "c", label: "c · ha diciotto anno" }], answers: ["b"] },
        { id: "q3", prompt: "— Di dove sei? — ...", options: [{ value: "a", label: "a · Sono di Roma." }, { value: "b", label: "b · Ho di Roma." }, { value: "c", label: "c · Sono venti anni." }], answers: ["a"] },
        { id: "q4", prompt: "— Quanti anni hai? — ...", options: [{ value: "a", label: "a · Sono vent’anni." }, { value: "b", label: "b · Ho venti anno." }, { value: "c", label: "c · Ho vent’anni." }], answers: ["c"] },
        { id: "q5", prompt: "— Che nazionalità è Maria? — ...", options: [{ value: "a", label: "a · È italiana." }, { value: "b", label: "b · Ha italiana." }, { value: "c", label: "c · È ventidue." }], answers: ["a"] }
      ]
    },
    {
      id: "u002_s2_ordine_dialogo", unitNumber: 2, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "2.3 Riordina il mini-dialogo / Составь мини-диалог",
      instructions: "Riordina le parole per formare domande e risposte. / Расставь слова, чтобы составить вопросы и ответы.",
      items: [
        { id: "o1", prompt: "Chiedere il nome", words: ["ti", "chiami?", "Come", ""].filter(Boolean), answers: [2, 0, 1] },
        { id: "o2", prompt: "Dire il nome", words: ["Marco.", "chiamo", "Mi"], answers: [2, 1, 0] },
        { id: "o3", prompt: "Chiedere l’età", words: ["anni?", "Quanti", "hai"], answers: [1, 2, 0] },
        { id: "o4", prompt: "Dire l’età", words: ["anni.", "Ho", "vent’"], answers: [1, 2, 0] },
        { id: "o5", prompt: "Chiedere la provenienza", words: ["dove", "Di", "sei?"], answers: [1, 0, 2] }
      ]
    },
    {
      id: "u002_s2_ordine_frasi", unitNumber: 2, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "2.4 Costruisci frasi con età e numeri / Составь предложения о возрасте и числах",
      instructions: "Metti le parole nell’ordine corretto. / Поставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Giulia", words: ["anni.", "diciotto", "ha", "Giulia"], answers: [3, 2, 1, 0] },
        { id: "o2", prompt: "Paolo", words: ["italiano.", "è", "Paolo"], answers: [2, 1, 0] },
        { id: "o3", prompt: "Marta", words: ["anni?", "Quanti", "ha", "Marta"], answers: [3, 1, 2, 0] },
        { id: "o4", prompt: "Io", words: ["anni.", "ventidue", "Ho", "Io"], answers: [3, 2, 1, 0] },
        { id: "o5", prompt: "Loro", words: ["di", "sono", "Milano.", "Loro"], answers: [3, 1, 0, 2] }
      ]
    },
    {
      id: "u002_s2_numeri_cloze", unitNumber: 2, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · 3 Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "2.5 Completa numeri e frasi sull’età / Заполни числительные и фразы о возрасте",
      instructions: "Scrivi in lettere il numero indicato oppure completa con avere. / Напиши число словами или вставь форму avere.",
      items: [
        { id: "g1", before: "21 si scrive ", after: ".", answers: ["ventuno"] },
        { id: "g2", before: "28 si scrive ", after: ".", answers: ["ventotto"] },
        { id: "g3", before: "33 si scrive ", after: ".", answers: ["trentatré", "trentatre"] },
        { id: "g4", before: "Luca ", after: " vent’anni.", cue: "avere", answers: ["ha"] },
        { id: "g5", before: "Quanti anni ", after: " tu?", cue: "avere", answers: ["hai"] },
        { id: "g6", before: "Noi ", after: " diciotto anni.", cue: "avere", answers: ["abbiamo"] }
      ]
    },
    {
      id: "u002_s2_tabella", unitNumber: 2, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · 3 Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "2.6 Completa le schede personali / Заполни анкеты",
      instructions: "Completa la scheda con una frase corretta. / Заполни анкету правильной фразой.",
      columns: ["Nome", "Età", "Nazionalità o città"],
      items: [
        { id: "t1", prompt: "Luca", cells: ["Luca", "20", { input: true }], answers: ["Luca ha vent’anni", "Luca ha venti anni"] },
        { id: "t2", prompt: "Anna", cells: ["Anna", { input: true }, "italiana"], answers: ["ha diciotto anni", "18 anni"] },
        { id: "t3", prompt: "Pavel", cells: ["Pavel", "25", { input: true }], answers: ["Pavel è russo", "russo"] },
        { id: "t4", prompt: "Marta", cells: ["Marta", { input: true }, "di Roma"], answers: ["ha trent’anni", "ha trenta anni", "30 anni"] },
        { id: "t5", prompt: "Gianni", cells: ["Gianni", "40", { input: true }], answers: ["Gianni è di Milano", "di Milano"] }
      ]
    },
    {
      id: "u002_s2_domande", unitNumber: 2, sessionNumber: 2, tier: "Produzione guidata",
      tierLabel: "Sessione 2 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "2.7 Presentati con numeri e informazioni personali / Представься, назвав числа и личные данные",
      instructions: "Scrivi 4–5 frasi: indica il tuo nome, l’età, la città e una nazionalità. Risposta aperta: revisione dell’insegnante. / Напиши 4–5 предложений: назови имя, возраст, город и национальность.",
      items: [{ id: "p1", title: "La mia presentazione", prompt: "Usa essere per la nazionalità o la provenienza e avere per l’età." }]
    },
    {
      id: "u002_s2_intervista", unitNumber: 2, sessionNumber: 2, tier: "Produzione guidata",
      tierLabel: "Sessione 2 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "2.8 Prepara un’intervista / Подготовь интервью",
      instructions: "Scrivi un’intervista di 4 domande e risposte su nome, età, provenienza e nazionalità. Risposta aperta: revisione dell’insegnante. / Напиши интервью из четырёх вопросов и ответов об имени, возрасте, происхождении и национальности.",
      items: [{ id: "p1", title: "Intervista a un compagno", prompt: "Includi le domande: Come ti chiami? Quanti anni hai? Di dove sei? Che nazionalità sei?" }]
    },

    // Sessione 3 — singolare, plurale e descrizioni
    {
      id: "u002_s3_plurale_abbinamento", unitNumber: 2, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "3.1 Abbina singolare e plurale / Соедини единственное и множественное число",
      instructions: "Abbina ogni parola al suo plurale. / Соедини каждое слово с формой множественного числа.",
      options: [
        { value: "A", label: "A · le ragazze" }, { value: "B", label: "B · gli studenti" },
        { value: "C", label: "C · le case" }, { value: "D", label: "D · i libri" },
        { value: "E", label: "E · le auto" }, { value: "F", label: "F · gli amici" }
      ],
      items: [
        { id: "m1", prompt: "la ragazza", answers: ["A"] }, { id: "m2", prompt: "lo studente", answers: ["B"] },
        { id: "m3", prompt: "la casa", answers: ["C"] }, { id: "m4", prompt: "il libro", answers: ["D"] },
        { id: "m5", prompt: "l’auto", answers: ["E"] }, { id: "m6", prompt: "l’amico", answers: ["F"] }
      ]
    },
    {
      id: "u002_s3_aggettivi_mc", unitNumber: 2, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "3.2 Riconosci l’accordo / Определи правильное согласование",
      instructions: "Scegli la frase corretta. / Выбери правильное предложение.",
      items: [
        { id: "q1", prompt: "Una ragazza...", options: [{ value: "a", label: "a · italiana" }, { value: "b", label: "b · italiani" }, { value: "c", label: "c · italiane" }], answers: ["a"] },
        { id: "q2", prompt: "Due libri...", options: [{ value: "a", label: "a · interessante" }, { value: "b", label: "b · interessanti" }, { value: "c", label: "c · interessantе" }], answers: ["b"] },
        { id: "q3", prompt: "Le case...", options: [{ value: "a", label: "a · grande" }, { value: "b", label: "b · grandi" }, { value: "c", label: "c · grandо" }], answers: ["b"] },
        { id: "q4", prompt: "Un ragazzo...", options: [{ value: "a", label: "a · simpatico" }, { value: "b", label: "b · simpatici" }, { value: "c", label: "c · simpatica" }], answers: ["a"] },
        { id: "q5", prompt: "Le amiche sono...", options: [{ value: "a", label: "a · contenti" }, { value: "b", label: "b · contenta" }, { value: "c", label: "c · contente" }], answers: ["c"] }
      ]
    },
    {
      id: "u002_s3_ordine", unitNumber: 2, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      requireItemSubmission: true,
      title: "3.3 Riordina le descrizioni / Составь описания",
      instructions: "Riordina le parole e fai attenzione al numero e al genere. / Расставь слова по порядку и следи за числом и родом.",
      items: [
        { id: "o1", prompt: "Anna", words: ["italiana.", "un’", "ragazza", "è", "Anna"], answers: [4, 3, 1, 2, 0] },
        { id: "o2", prompt: "I ragazzi", words: ["simpatici.", "sono", "ragazzi", "I"], answers: [3, 2, 1, 0] },
        { id: "o3", prompt: "Le case", words: ["grandi.", "sono", "case", "Le"], answers: [3, 2, 1, 0] },
        { id: "o4", prompt: "Marco e Giulia", words: ["una", "hanno", "casa", "grande.", "Marco", "e", "Giulia"], answers: [4, 5, 6, 1, 0, 2, 3] },
        { id: "o5", prompt: "Gli studenti", words: ["interessanti.", "libri", "hanno", "Gli", "degli"], answers: [3, 2, 4, 1, 0] }
      ]
    },
    {
      id: "u002_s3_trasformazione", unitNumber: 2, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "3.4 Trasforma al plurale / Преобразуй во множественное число",
      instructions: "Usa tutte le parole per comporre la frase al plurale. / Используй все слова, чтобы составить предложение во множественном числе.",
      items: [
        { id: "o1", prompt: "Una ragazza italiana", words: ["ragazze", "sono", "italiane.", "Le"], answers: [3, 0, 1, 2] },
        { id: "o2", prompt: "Un libro interessante", words: ["libri", "interessanti.", "sono", "I"], answers: [3, 0, 2, 1] },
        { id: "o3", prompt: "Una casa grande", words: ["case", "Le", "grandi.", "sono"], answers: [1, 0, 3, 2] },
        { id: "o4", prompt: "Un amico simpatico", words: ["amici", "simpatici.", "Gli", "sono"], answers: [2, 0, 3, 1] },
        { id: "o5", prompt: "Un’auto nuova", words: ["nuove.", "auto", "Le", "sono"], answers: [2, 1, 3, 0] }
      ]
    },
    {
      id: "u002_s3_cloze", unitNumber: 2, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · 3 Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "3.5 Completa con l’articolo e l’aggettivo / Заполни артикль и прилагательное",
      instructions: "Completa ogni frase con la forma corretta. / Заполни каждое предложение правильной формой.",
      items: [
        { id: "g1", before: "La ragazza è ", after: ".", cue: "italiano", answers: ["italiana"] },
        { id: "g2", before: "I ragazzi sono ", after: ".", cue: "simpatico", answers: ["simpatici"] },
        { id: "g3", before: "Le case sono ", after: ".", cue: "grande", answers: ["grandi"] },
        { id: "g4", before: "Gli ", after: " sono italiani.", cue: "amico", answers: ["amici"] },
        { id: "g5", before: "Le ", after: " sono nuove.", cue: "auto", answers: ["auto"] },
        { id: "g6", before: "Un libro, due ", after: ".", cue: "libro", answers: ["libri"] }
      ]
    },
    {
      id: "u002_s3_tabella", unitNumber: 2, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · 3 Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "3.6 Completa la tabella singolare/plurale / Заполни таблицу единственного и множественного числа",
      instructions: "Scrivi la forma mancante. / Напиши пропущенную форму.",
      columns: ["Singolare", "Plurale"],
      items: [
        { id: "t1", prompt: "ragazza", cells: ["la ragazza", { input: true }], answers: ["le ragazze"] },
        { id: "t2", prompt: "libro", cells: ["il libro", { input: true }], answers: ["i libri"] },
        { id: "t3", prompt: "amico", cells: ["l’amico", { input: true }], answers: ["gli amici"] },
        { id: "t4", prompt: "casa", cells: ["la casa", { input: true }], answers: ["le case"] },
        { id: "t5", prompt: "auto", cells: ["l’auto", { input: true }], answers: ["le auto"] },
        { id: "t6", prompt: "studente", cells: ["lo studente", { input: true }], answers: ["gli studenti"] }
      ]
    },
    {
      id: "u002_s3_descrizione", unitNumber: 2, sessionNumber: 3, tier: "Produzione guidata",
      tierLabel: "Sessione 3 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "3.7 Descrivi una stanza / Опиши комнату",
      instructions: "Scrivi 5 frasi per descrivere una stanza. Usa almeno tre nomi plurali e fai concordare gli aggettivi. Risposta aperta: revisione dell’insegnante. / Напиши пять предложений об одной комнате. Используй не менее трёх существительных во множественном числе и согласуй прилагательные.",
      items: [{ id: "p1", title: "La mia stanza", prompt: "Puoi descrivere libri, sedie, finestre, quadri o altri oggetti." }]
    },
    {
      id: "u002_s3_correzione", unitNumber: 2, sessionNumber: 3, tier: "Produzione guidata",
      tierLabel: "Sessione 3 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "3.8 Correggi e riscrivi / Исправь и перепиши",
      instructions: "Riscrivi correttamente le frasi e spiega brevemente una correzione. Risposta aperta: revisione dell’insegnante. / Перепиши предложения правильно и кратко объясни одно исправление.",
      items: [{ id: "p1", title: "Attenzione al plurale", prompt: "Correggi: Le ragazze italiano sono simpatica. / I libri è interessante. / Le auto è nuova." }]
    },

    // Sessione 4 — essere, avere e presente
    {
      id: "u002_s4_verbi_matching", unitNumber: 2, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "4.1 Abbina il soggetto alla forma / Соедини подлежащее с формой глагола",
      instructions: "Abbina il soggetto alla forma corretta di essere o avere. / Соедини подлежащее с правильной формой essere или avere.",
      options: [
        { value: "A", label: "A · sono" }, { value: "B", label: "B · hai" },
        { value: "C", label: "C · è" }, { value: "D", label: "D · abbiamo" },
        { value: "E", label: "E · hanno" }, { value: "F", label: "F · siete" }
      ],
      items: [
        { id: "m1", prompt: "Io (essere)", answers: ["A"] }, { id: "m2", prompt: "Tu (avere)", answers: ["B"] },
        { id: "m3", prompt: "Marco (essere)", answers: ["C"] }, { id: "m4", prompt: "Noi (avere)", answers: ["D"] },
        { id: "m5", prompt: "I bambini (avere)", answers: ["E"] }, { id: "m6", prompt: "Voi (essere)", answers: ["F"] }
      ]
    },
    {
      id: "u002_s4_avere_mc", unitNumber: 2, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "4.2 Riconosci le espressioni con avere / Узнай выражения с avere",
      instructions: "Scegli la forma corretta di avere. / Выбери правильную форму avere.",
      items: [
        { id: "q1", prompt: "Io ___ fame.", options: [{ value: "a", label: "a · ho" }, { value: "b", label: "b · ha" }, { value: "c", label: "c · hanno" }], answers: ["a"] },
        { id: "q2", prompt: "Tu ___ paura dei cani?", options: [{ value: "a", label: "a · hai" }, { value: "b", label: "b · ho" }, { value: "c", label: "c · avete" }], answers: ["a"] },
        { id: "q3", prompt: "I ragazzi ___ sonno.", options: [{ value: "a", label: "a · ha" }, { value: "b", label: "b · hanno" }, { value: "c", label: "c · abbiamo" }], answers: ["b"] },
        { id: "q4", prompt: "Noi ___ voglia di mangiare.", options: [{ value: "a", label: "a · avete" }, { value: "b", label: "b · ho" }, { value: "c", label: "c · abbiamo" }], answers: ["c"] },
        { id: "q5", prompt: "Ragazzi, ___ sete?", options: [{ value: "a", label: "a · avete" }, { value: "b", label: "b · hanno" }, { value: "c", label: "c · hai" }], answers: ["a"] }
      ]
    },
    {
      id: "u002_s4_ordine", unitNumber: 2, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "4.3 Riordina le frasi con avere / Составь предложения с avere",
      instructions: "Riordina le parole per formare frasi corrette. / Расставь слова, чтобы составить правильные предложения.",
      items: [
        { id: "o1", prompt: "La mia famiglia", words: ["città.", "una", "in", "piccola", "vive", "famiglia", "La", "mia"], answers: [6, 7, 4, 2, 3, 1, 0] },
        { id: "o2", prompt: "Io", words: ["fame.", "ho", "Io"], answers: [2, 1, 0] },
        { id: "o3", prompt: "Tu", words: ["anni?", "hai", "Quanti", "Tu"], answers: [3, 2, 1, 0] },
        { id: "o4", prompt: "Noi", words: ["voglia", "abbiamo", "di", "mangiare."], answers: [1, 0, 2, 3] },
        { id: "o5", prompt: "Marco", words: ["medico", "è", "Marco", "e", "trent’anni.", "ha"], answers: [2, 1, 0, 3, 5, 4] }
      ]
    },
    {
      id: "u002_s4_ordine_presente", unitNumber: 2, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "4.4 Costruisci frasi al presente / Составь предложения в настоящем времени",
      instructions: "Metti in ordine soggetto, verbo e complementi. / Расставь подлежащее, глагол и остальные части предложения.",
      items: [
        { id: "o1", prompt: "Io parlare italiano", words: ["italiano.", "parlo", "Io"], answers: [2, 1, 0] },
        { id: "o2", prompt: "Tu leggere un libro", words: ["libro.", "un", "leggi", "Tu"], answers: [3, 2, 1, 0] },
        { id: "o3", prompt: "Noi dormire", words: ["dormiamo", "Noi", "bene."], answers: [1, 0, 2] },
        { id: "o4", prompt: "I bambini giocare", words: ["giardino.", "in", "giocano", "I", "bambini"], answers: [3, 4, 2, 1, 0] },
        { id: "o5", prompt: "Voi mangiare la pizza", words: ["pizza?", "la", "mangiate", "Voi"], answers: [3, 2, 1, 0] }
      ]
    },
    {
      id: "u002_s4_essere_avere_cloze", unitNumber: 2, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · 3 Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "4.5 Completa con essere o avere / Заполни формы essere или avere",
      instructions: "Scrivi la forma corretta del verbo indicato. / Напиши правильную форму указанного глагола.",
      items: [
        { id: "g1", before: "Marie ", after: " francese.", cue: "essere", answers: ["è"] },
        { id: "g2", before: "Tu ", after: " trentacinque anni.", cue: "avere", answers: ["hai"] },
        { id: "g3", before: "I bambini ", after: " molta paura.", cue: "avere", answers: ["hanno"] },
        { id: "g4", before: "Noi ", after: " felici di conoscerti.", cue: "essere", answers: ["siamo"] },
        { id: "g5", before: "Paolo ", after: " italiano e ", cue: "essere", answers: ["è"] },
        { id: "g6", before: "Paolo è italiano e ", after: " trent’anni.", cue: "avere", answers: ["ha"] }
      ]
    },
    {
      id: "u002_s4_presente_cloze", unitNumber: 2, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · 3 Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "4.6 Coniuga i verbi regolari al presente / Проспрягай правильные глаголы в настоящем времени",
      instructions: "Coniuga il verbo tra parentesi al presente. / Проспрягай глагол в скобках в настоящем времени.",
      items: [
        { id: "g1", before: "Io ", after: " bene la letteratura. (conoscere)", answers: ["conosco"] },
        { id: "g2", before: "La famiglia ", after: " in una piccola città. (vivere)", answers: ["vive"] },
        { id: "g3", before: "Il professore ", after: " inglese. (parlare)", answers: ["parla"] },
        { id: "g4", before: "I bambini ", after: " in giardino. (giocare)", answers: ["giocano"] },
        { id: "g5", before: "Voi ", after: " spesso la pizza? (mangiare)", answers: ["mangiate"] },
        { id: "g6", before: "Noi ", after: " fino a mezzogiorno. (dormire)", answers: ["dormiamo"] }
      ]
    },
    {
      id: "u002_s4_dialogo", unitNumber: 2, sessionNumber: 4, tier: "Produzione guidata",
      tierLabel: "Sessione 4 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "4.7 Scrivi un dialogo con avere / Напиши диалог с avere",
      instructions: "Scrivi un dialogo di 6 battute. Usa almeno tre espressioni con avere e includi una domanda. Risposta aperta: revisione dell’insegnante. / Напиши диалог из шести реплик. Используй не менее трёх выражений с avere и задай один вопрос.",
      items: [{ id: "p1", title: "Come ti senti?", prompt: "Puoi usare: avere fame, sete, freddo, sonno, paura, voglia di." }]
    },
    {
      id: "u002_s4_routine", unitNumber: 2, sessionNumber: 4, tier: "Produzione guidata",
      tierLabel: "Sessione 4 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "4.8 Racconta una giornata / Расскажи об одном дне",
      instructions: "Scrivi 5–6 frasi sulle attività di una persona. Usa almeno quattro verbi al presente e un’espressione con avere. Risposta aperta: revisione dell’insegnante. / Напиши 5–6 предложений о занятиях одного человека. Используй не менее четырёх глаголов в настоящем времени и одно выражение с avere.",
      items: [{ id: "p1", title: "Una giornata normale", prompt: "Indica chi è la persona, dove vive e che cosa fa durante la giornata." }]
    },

    // Sessione 5 — fare, dire, bere e il racconto di Marco
    {
      id: "u002_s5_comprensione", unitNumber: 2, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "5.1 Ripassa il racconto di Marco / Повтори рассказ о Марко",
      instructions: "Scegli l’informazione corretta secondo il racconto. / Выбери верную информацию по рассказу.",
      items: [
        { id: "q1", prompt: "Chi chiama la madre?", options: [{ value: "a", label: "a · Marco" }, { value: "b", label: "b · Il padre" }, { value: "c", label: "c · L’insegnante" }], answers: ["a"] },
        { id: "q2", prompt: "Che cosa beve Marco?", options: [{ value: "a", label: "a · Un caffè" }, { value: "b", label: "b · L’acqua" }, { value: "c", label: "c · Il latte" }], answers: ["b"] },
        { id: "q3", prompt: "Che cosa mangia Marco?", options: [{ value: "a", label: "a · Un piatto di pasta" }, { value: "b", label: "b · Un panino" }, { value: "c", label: "c · Una mela" }], answers: ["a"] },
        { id: "q4", prompt: "Che cosa fa la madre quando Marco ha sonno?", options: [{ value: "a", label: "a · Accende la luce" }, { value: "b", label: "b · Apre la finestra" }, { value: "c", label: "c · Spegne la luce e chiude la finestra" }], answers: ["c"] },
        { id: "q5", prompt: "Che cosa dice la madre sull’età di Marco?", options: [{ value: "a", label: "a · Ha già trentacinque anni." }, { value: "b", label: "b · Ha già cinque anni." }, { value: "c", label: "c · È ancora piccolo." }], answers: ["a"] }
      ]
    },
    {
      id: "u002_s5_verbi_matching", unitNumber: 2, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "5.2 Abbina il soggetto alla forma di fare, dire o bere / Соедини подлежащее с формой fare, dire или bere",
      instructions: "Abbina ogni soggetto alla forma verbale corretta. / Соедини каждое подлежащее с правильной формой глагола.",
      options: [
        { value: "A", label: "A · faccio" }, { value: "B", label: "B · fai" },
        { value: "C", label: "C · dice" }, { value: "D", label: "D · facciamo" },
        { value: "E", label: "E · bevono" }, { value: "F", label: "F · dite" }
      ],
      items: [
        { id: "m1", prompt: "io — fare", answers: ["A"] }, { id: "m2", prompt: "tu — fare", answers: ["B"] },
        { id: "m3", prompt: "la nonna — dire", answers: ["C"] }, { id: "m4", prompt: "noi — fare", answers: ["D"] },
        { id: "m5", prompt: "gli italiani — bere", answers: ["E"] }, { id: "m6", prompt: "voi — dire", answers: ["F"] }
      ]
    },
    {
      id: "u002_s5_ordine_racconto", unitNumber: 2, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "5.3 Riordina le azioni del racconto / Составь предложения о событиях рассказа",
      instructions: "Ricostruisci le frasi del racconto di Marco. / Восстанови предложения из рассказа о Марко.",
      items: [
        { id: "o1", prompt: "Marco", words: ["madre.", "la", "chiama", "Marco"], answers: [3, 2, 1, 0] },
        { id: "o2", prompt: "La madre", words: ["un", "bicchiere", "d’acqua.", "porta"], answers: [3, 0, 1, 2] },
        { id: "o3", prompt: "Marco", words: ["pasta.", "la", "mangia", "Marco"], answers: [3, 2, 1, 0] },
        { id: "o4", prompt: "La madre", words: ["la", "luce", "spegne", "madre", "La"], answers: [4, 3, 2, 1, 0] },
        { id: "o5", prompt: "Marco", words: ["anni.", "trentacinque", "ha", "Marco"], answers: [3, 2, 1, 0] }
      ]
    },
    {
      id: "u002_s5_ordine_verbi", unitNumber: 2, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "5.4 Riordina le frasi con fare, dire e bere / Составь предложения с fare, dire и bere",
      instructions: "Metti le parole nell’ordine corretto. / Поставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Io fare la spesa", words: ["spesa.", "la", "faccio", "Io"], answers: [3, 2, 1, 0] },
        { id: "o2", prompt: "Tu dire la verità", words: ["verità.", "la", "dici", "Tu"], answers: [3, 2, 1, 0] },
        { id: "o3", prompt: "Noi bere un caffè", words: ["caffè.", "un", "beviamo", "Noi"], answers: [3, 2, 1, 0] },
        { id: "o4", prompt: "Gli studenti fare gli esercizi", words: ["esercizi.", "gli", "fanno", "Gli", "studenti"], answers: [3, 4, 2, 1, 0] },
        { id: "o5", prompt: "Il nonno dire che è stanco", words: ["stanco.", "è", "che", "dice", "Il", "nonno"], answers: [4, 5, 3, 2, 1, 0] }
      ]
    },
    {
      id: "u002_s5_cloze_racconto", unitNumber: 2, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · 3 Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "5.5 Completa il racconto di Marco / Заполни рассказ о Марко",
      instructions: "Coniuga i verbi tra parentesi al presente. / Проспрягай глаголы в скобках в настоящем времени.",
      items: [
        { id: "g1", before: "Marco ", after: " la madre. (chiamare)", answers: ["chiama"] },
        { id: "g2", before: "Marco ", after: ": «Mamma, ho sete». (dire)", answers: ["dice"] },
        { id: "g3", before: "La madre ", after: " un bicchiere d’acqua. (portare)", answers: ["porta"] },
        { id: "g4", before: "Marco ", after: " l’acqua. (bere)", answers: ["beve"] },
        { id: "g5", before: "Poi Marco ", after: " un piatto di pasta. (mangiare)", answers: ["mangia"] },
        { id: "g6", before: "La madre ", after: " la luce. (spegnere)", answers: ["spegne"] }
      ]
    },
    {
      id: "u002_s5_cloze_irregolari", unitNumber: 2, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · 3 Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "5.6 Completa con fare, dire o bere / Заполни формы fare, dire или bere",
      instructions: "Coniuga il verbo tra parentesi al presente. / Проспрягай глагол в скобках в настоящем времени.",
      items: [
        { id: "g1", before: "Io ", after: " colazione al bar. (fare)", answers: ["faccio"] },
        { id: "g2", before: "Tu ", after: " sempre la verità. (dire)", answers: ["dici"] },
        { id: "g3", before: "Noi ", after: " un caffè dopo pranzo. (bere)", answers: ["beviamo"] },
        { id: "g4", before: "Gli studenti ", after: " tutti gli esercizi. (fare)", answers: ["fanno"] },
        { id: "g5", before: "Voi ", after: " sempre le stesse cose. (dire)", answers: ["dite"] },
        { id: "g6", before: "Gli italiani ", after: " il vino a tavola. (bere)", answers: ["bevono"] }
      ]
    },
    {
      id: "u002_s5_racconto", unitNumber: 2, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "5.7 Racconta la storia di Marco / Расскажи историю Марко",
      instructions: "Riassumi il racconto in 6–8 frasi. Usa il presente e almeno tre espressioni con avere. Risposta aperta: revisione dell’insegnante. / Перескажи рассказ в 6–8 предложениях. Используй настоящее время и не менее трёх выражений с avere.",
      items: [{ id: "p1", title: "Marco e sua madre", prompt: "Segui l’ordine degli eventi: sete, fame, freddo, sonno e paura. Includi le azioni della madre." }]
    },
    {
      id: "u002_s5_dialogo", unitNumber: 2, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · 4 Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "5.8 Inventa un finale diverso / Придумай другой конец",
      instructions: "Scrivi 5–7 battute di dialogo: Marco esprime un bisogno e la madre risponde. Usa essere, avere e almeno uno tra fare, dire e bere. Risposta aperta: revisione dell’insegnante. / Напиши диалог из 5–7 реплик: Марко говорит о своей потребности, а мама отвечает. Используй essere, avere и хотя бы один глагол из fare, dire, bere.",
      items: [{ id: "p1", title: "Un’altra sera", prompt: "Puoi inventare un nuovo bisogno o cambiare la risposta della madre." }]
    }
  ]
};
