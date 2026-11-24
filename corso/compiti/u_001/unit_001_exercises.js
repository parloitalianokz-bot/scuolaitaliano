// Catalogo esercizi — Unità 1: Un albergo in centro (A0/A1 · IT / RU)
window.HOMEWORK_EXERCISES_CATALOG = window.HOMEWORK_EXERCISES_CATALOG || {};
window.HOMEWORK_EXERCISES_CATALOG["1"] = {
  unitNumber: 1,
  unitSlug: "u_001",
  unitTitle: "Unità 1 · Un albergo in centro / Отель в центре",
  level: "A0/A1",
  description: "Quaranta attività in cinque sessioni progressive. Ogni sessione comprende riconoscimento, manipolazione, completamento e produzione, con attività coerenti con gli argomenti già affrontati. / Сорок заданий в пяти последовательных занятиях. В каждом занятии есть упражнения на распознавание, преобразование, заполнение пропусков и самостоятельное высказывание по уже изученным темам.",
  sessions: [
    { number: 1, title: "Sessione 1 · L’albergo e i suoi ospiti" },
    { number: 2, title: "Sessione 2 · Il verbo essere al presente" },
    { number: 3, title: "Sessione 3 · Nazionalità, professioni e motivi del viaggio" },
    { number: 4, title: "Sessione 4 · Domande e presentazioni" },
    { number: 5, title: "Sessione 5 · Ripasso e produzione" }
  ],
  defaultExerciseIds: ["u001_s1_matching", "u001_s1_mc", "u001_s1_order", "u001_s1_order2", "u001_s1_gap", "u001_s1_table", "u001_s1_production", "u001_s1_production2"],
  exercises: [
    // Sessione 1 — l'albergo e i suoi ospiti
    {
      id: "u001_s1_matching", unitNumber: 1, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · Riconoscimento", type: "matching",
      title: "1.1 Abbina gli ospiti ai profili / Соедини гостей с описаниями",
      instructions: "Abbina ogni persona al profilo corretto. / Соедини каждого человека с подходящим описанием.",
      options: [
        { value: "C", label: "C · Giapponese, dentista, conferenza" },
        { value: "F", label: "F · Tedeschi, studenti" },
        { value: "A", label: "A · Francese, avvocato, affari" },
        { value: "E", label: "E · Inglese, insegnante" },
        { value: "B", label: "B · Russa, studentessa, italiano" },
        { value: "D", label: "D · Direttore, sposato, tre figli" }
      ],
      items: [
        { id: "victor", prompt: "Victor", answers: ["A"] },
        { id: "olga", prompt: "Olga", answers: ["B"] },
        { id: "yoko", prompt: "Yoko", answers: ["C"] },
        { id: "paolo", prompt: "Paolo Rossi", answers: ["D"] },
        { id: "mary", prompt: "Mary", answers: ["E"] },
        { id: "karl", prompt: "Karl e Klaus", answers: ["F"] }
      ]
    },
    {
      id: "u001_s1_mc", unitNumber: 1, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · Riconoscimento", type: "multiple_choice",
      title: "1.2 Riconosci le informazioni / Определи верную информацию",
      instructions: "Scegli la risposta corretta. / Выбери правильный ответ.",
      items: [
        { id: "q1", prompt: "Dove si trova l'albergo Ponte Vecchio?", options: [{ value: "a", label: "a · A Firenze" }, { value: "b", label: "b · A Mosca" }, { value: "c", label: "c · A Tokyo" }], answers: ["a"] },
        { id: "q2", prompt: "Chi è il direttore dell'albergo?", options: [{ value: "a", label: "a · Victor" }, { value: "b", label: "b · Paolo Rossi" }, { value: "c", label: "c · Karl" }], answers: ["b"] },
        { id: "q3", prompt: "Perché Yoko è in Italia?", options: [{ value: "a", label: "a · Per una conferenza" }, { value: "b", label: "b · Per affari" }, { value: "c", label: "c · Per insegnare inglese" }], answers: ["a"] },
        { id: "q4", prompt: "Che lavoro fa Victor?", options: [{ value: "a", label: "a · L'avvocato" }, { value: "b", label: "b · Il dentista" }, { value: "c", label: "c · L'insegnante" }], answers: ["a"] },
        { id: "q5", prompt: "Che cosa studia Olga?", options: [{ value: "a", label: "a · Il francese" }, { value: "b", label: "b · L'italiano" }, { value: "c", label: "c · Il giapponese" }], answers: ["b"] },
        { id: "q6", prompt: "Quanti figli ha Paolo Rossi?", options: [{ value: "a", label: "a · Due" }, { value: "b", label: "b · Tre" }, { value: "c", label: "c · Quattro" }], answers: ["b"] },
        { id: "q7", prompt: "Chi sono Karl e Klaus?", options: [{ value: "a", label: "a · Due studenti tedeschi" }, { value: "b", label: "b · Due avvocati francesi" }, { value: "c", label: "c · Due insegnanti inglesi" }], answers: ["a"] }
      ]
    },
    {
      id: "u001_s1_order", unitNumber: 1, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · Manipolazione", type: "word_order",
      title: "1.3 Riordina le frasi sull'albergo / Составь предложения об отеле",
      instructions: "Riordina le parole per formare frasi corrette. / Расставь слова, чтобы составить правильные предложения.",
      items: [
        { id: "o1", prompt: "L'albergo", words: ["centro.", "in", "L'albergo", "è"], answers: [2, 3, 1, 0] },
        { id: "o2", prompt: "Le camere", words: ["grandi", "Le", "sono", "camere."], answers: [1, 3, 2, 0] },
        { id: "o3", prompt: "Paolo Rossi", words: ["dell'albergo.", "direttore", "è", "Paolo", "Rossi", "il"], answers: [3, 4, 2, 5, 1, 0] },
        { id: "o4", prompt: "L'albergo Ponte Vecchio", words: ["Italia.", "in", "Firenze", "a", "è", "Vecchio", "Ponte", "L'albergo"], answers: [7, 6, 5, 4, 3, 2, 1, 0] },
        { id: "o5", prompt: "La hall", words: ["grande.", "è", "dell'albergo", "hall", "La"], answers: [4, 3, 2, 1, 0] },
        { id: "o6", prompt: "La colazione", words: ["inclusa.", "è", "colazione", "La"], answers: [3, 2, 1, 0] },
        { id: "o7", prompt: "Le camere", words: ["bagno", "hanno", "privato.", "un", "Le", "camere"], answers: [4, 5, 1, 3, 2, 0] },
        { id: "o8", prompt: "L'albergo", words: ["alla", "stazione.", "vicino", "è", "L'albergo"], answers: [4, 3, 2, 0, 1] },
        { id: "o9", prompt: "Il ristorante", words: ["elegante.", "è", "dell'albergo", "ristorante", "Il"], answers: [4, 3, 2, 1, 0] },
        { id: "o10", prompt: "I turisti", words: ["a", "Firenze.", "sono", "I", "turisti"], answers: [3, 4, 2, 0, 1] }
      ]
    },
    {
      id: "u001_s1_order2", unitNumber: 1, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · Manipolazione", type: "word_order",
      title: "1.4 Riordina le presentazioni / Составь представления",
      instructions: "Metti le parole nell'ordine giusto. / Расставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Victor", words: ["francese.", "Victor", "è"], answers: [1, 2, 0] },
        { id: "o2", prompt: "Karl e Klaus", words: ["studenti.", "tedeschi", "sono", "Karl", "e", "Klaus"], answers: [3, 4, 5, 2, 1, 0] },
        { id: "o3", prompt: "Yoko", words: ["dentista.", "è", "Yoko", "giapponese", "e"], answers: [2, 1, 3, 4, 0] },
        { id: "o4", prompt: "Olga", words: ["studentessa.", "una", "è", "Olga"], answers: [3, 2, 1, 0] },
        { id: "o5", prompt: "Mary", words: ["inglese.", "insegna", "Mary"], answers: [2, 1, 0] },
        { id: "o6", prompt: "Paolo Rossi", words: ["tre", "ha", "figli.", "Paolo", "Rossi"], answers: [3, 4, 1, 0, 2] }
      ]
    },
    {
      id: "u001_s1_gap", unitNumber: 1, sessionNumber: 1, tier: "Intermedio",
      tierLabel: "Sessione 1 · Completamento", type: "gap_fill",
      title: "1.5 Completa con essere / Заполни форму essere",
      instructions: "Completa con la forma corretta di essere. / Вставь правильную форму essere.",
      items: [
        { id: "g1", before: "L'albergo ", after: " a Firenze.", answers: ["è"] },
        { id: "g2", before: "Le camere ", after: " grandi.", answers: ["sono"] },
        { id: "g3", before: "Io ", after: " un ospite nuovo.", answers: ["sono"] },
        { id: "g4", before: "Voi ", after: " in vacanza?", answers: ["siete"] },
        { id: "g5", before: "Loro ", after: " due ospiti dell'albergo.", answers: ["sono"] }
      ]
    },
    {
      id: "u001_s1_table", unitNumber: 1, sessionNumber: 1, tier: "Intermedio",
      tierLabel: "Sessione 1 · Completamento", type: "table_fill",
      title: "1.6 Completa la tabella degli ospiti / Заполни таблицу гостей",
      instructions: "Completa le informazioni mancanti. / Заполни пропущенную информацию.",
      columns: ["Persona", "Nazionalità", "Lavoro"],
      items: [
        { id: "t1", prompt: "Victor — nazionalità", cells: ["Victor", { input: true }, "Avvocato"], answers: ["francese"] },
        { id: "t2", prompt: "Yoko — lavoro", cells: ["Yoko", "Giapponese", { input: true }], answers: ["dentista"] },
        { id: "t3", prompt: "Mary — nazionalità", cells: ["Mary", { input: true }, "Insegnante"], answers: ["inglese"] },
        { id: "t4", prompt: "Olga — nazionalità", cells: ["Olga", { input: true }, "Studentessa"], answers: ["russa"] },
        { id: "t5", prompt: "Paolo Rossi — lavoro", cells: ["Paolo Rossi", "Italiano", { input: true }], answers: ["direttore"] },
        { id: "t6", prompt: "Karl e Klaus — nazionalità", cells: ["Karl e Klaus", { input: true }, "Studenti"], answers: ["tedeschi"] }
      ]
    },
    {
      id: "u001_s1_production", unitNumber: 1, sessionNumber: 1, tier: "Produzione guidata",
      tierLabel: "Sessione 1 · Produzione", type: "open_response",
      title: "1.7 Descrivi un ospite / Опиши гостя",
      instructions: "Scrivi 3–4 frasi su un ospite dell'albergo. / Напиши 3–4 предложения о госте отеля.",
      items: [{ id: "p1", title: "Un ospite", prompt: "Indica il nome, la nazionalità, il lavoro o lo studio e il motivo del viaggio. / Укажи имя, национальность, профессию или место учёбы и цель поездки." }]
    },
    {
      id: "u001_s1_production2", unitNumber: 1, sessionNumber: 1, tier: "Produzione guidata",
      tierLabel: "Sessione 1 · Produzione", type: "open_response",
      title: "1.8 Presenta l'albergo / Представь отель",
      instructions: "Scrivi 3 frasi semplici sull'albergo. / Напиши 3 простых предложения об отеле.",
      items: [{ id: "p1", title: "L'albergo Ponte Vecchio", prompt: "Descrivi la città, la posizione dell'albergo e una caratteristica delle camere. / Опиши город, расположение отеля и одну особенность номеров." }]
    },

    // Sessione 2 — il verbo essere al presente
    {
      id: "u001_s2_matching", unitNumber: 1, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · Riconoscimento", type: "matching",
      title: "2.1 Abbina il soggetto alla forma / Соедини подлежащее с формой глагола",
      instructions: "Abbina ogni soggetto alla forma corretta di essere. / Соедини подлежащее с правильной формой essere.",
      options: [
        { value: "D", label: "D · siamo" }, { value: "B", label: "B · sei" },
        { value: "F", label: "F · sono" }, { value: "E", label: "E · siete" },
        { value: "A", label: "A · è" }
      ],
      items: [
        { id: "m1", prompt: "Io", answers: ["F"] }, { id: "m2", prompt: "Tu", answers: ["B"] },
        { id: "m3", prompt: "Lei", answers: ["A"] }, { id: "m4", prompt: "Noi", answers: ["D"] },
        { id: "m5", prompt: "Voi", answers: ["E"] }, { id: "m6", prompt: "Loro", answers: ["F"] }
      ]
    },
    {
      id: "u001_s2_mc", unitNumber: 1, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · Riconoscimento", type: "multiple_choice",
      title: "2.2 Scegli essere al presente / Выбери форму essere в настоящем времени",
      instructions: "Scegli la forma corretta. / Выбери правильную форму.",
      items: [
        { id: "q1", prompt: "Tu ___ italiano?", options: [{ value: "a", label: "a · sei" }, { value: "b", label: "b · è" }, { value: "c", label: "c · siamo" }], answers: ["a"] },
        { id: "q2", prompt: "Anna ___ a Roma.", options: [{ value: "a", label: "a · sono" }, { value: "b", label: "b · è" }, { value: "c", label: "c · siete" }], answers: ["b"] },
        { id: "q3", prompt: "Noi ___ contenti.", options: [{ value: "a", label: "a · siamo" }, { value: "b", label: "b · siete" }, { value: "c", label: "c · è" }], answers: ["a"] },
        { id: "q4", prompt: "Signori, voi ___ qui per turismo?", options: [{ value: "a", label: "a · sono" }, { value: "b", label: "b · siete" }, { value: "c", label: "c · sei" }], answers: ["b"] },
        { id: "q5", prompt: "Io ___ un ospite nuovo.", options: [{ value: "a", label: "a · sei" }, { value: "b", label: "b · sono" }, { value: "c", label: "c · è" }], answers: ["b"] },
        { id: "q6", prompt: "Loro ___ studenti tedeschi.", options: [{ value: "a", label: "a · siete" }, { value: "b", label: "b · sono" }, { value: "c", label: "c · siamo" }], answers: ["b"] },
        { id: "q7", prompt: "Tu e Anna ___ in albergo.", options: [{ value: "a", label: "a · siete" }, { value: "b", label: "b · siamo" }, { value: "c", label: "c · è" }], answers: ["a"] },
        { id: "q8", prompt: "Paolo ___ il direttore.", options: [{ value: "a", label: "a · siamo" }, { value: "b", label: "b · è" }, { value: "c", label: "c · sono" }], answers: ["b"] },
        { id: "q9", prompt: "Noi ___ a Firenze per lavoro.", options: [{ value: "a", label: "a · sono" }, { value: "b", label: "b · siamo" }, { value: "c", label: "c · sei" }], answers: ["b"] },
        { id: "q10", prompt: "Voi ___ in vacanza?", options: [{ value: "a", label: "a · è" }, { value: "b", label: "b · siete" }, { value: "c", label: "c · sono" }], answers: ["b"] }
      ]
    },
    {
      id: "u001_s2_order", unitNumber: 1, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · Manipolazione", type: "word_order",
      title: "2.3 Riordina le frasi con essere / Составь предложения с essere",
      instructions: "Riordina le parole. / Расставь слова по порядку.",
      items: [
        { id: "o1", prompt: "Io", words: ["sono", "ospite.", "un", "Io"], answers: [3, 0, 2, 1] },
        { id: "o2", prompt: "Tu", words: ["italiano?", "Tu", "sei"], answers: [1, 2, 0] },
        { id: "o3", prompt: "Noi", words: ["a", "siamo", "Firenze."], answers: [1, 0, 2] },
        { id: "o4", prompt: "Tu", words: ["italiano?", "sei", "Tu"], answers: [2, 1, 0] },
        { id: "o5", prompt: "Loro", words: ["studenti.", "sono", "Loro"], answers: [2, 1, 0] },
        { id: "o6", prompt: "Lei", words: ["a", "è", "Firenze.", "Lei"], answers: [3, 1, 0, 2] },
        { id: "o7", prompt: "Voi", words: ["in", "siete", "albergo?", "Voi"], answers: [3, 1, 0, 2] },
        { id: "o8", prompt: "Anna", words: ["studentessa.", "è", "Anna"], answers: [2, 1, 0] },
        { id: "o9", prompt: "Io e Olga", words: ["italiano.", "studiamo", "e", "Io", "Olga", "l'"], answers: [3, 2, 4, 1, 5, 0] },
        { id: "o10", prompt: "Gli ospiti", words: ["contenti.", "sono", "Gli", "ospiti"], answers: [2, 3, 1, 0] }
      ]
    },
    {
      id: "u001_s2_order2", unitNumber: 1, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · Manipolazione", type: "word_order",
      title: "2.4 Riordina le frasi / Составь предложения",
      instructions: "Metti le parole nell'ordine corretto. / Расставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Lei", words: ["Signora,", "Italia", "in", "è", "Lei", "vacanza?", "in"], answers: [0, 4, 3, 1, 2, 6, 5] },
        { id: "o2", prompt: "Loro", words: ["studenti.", "sono", "Loro"], answers: [2, 1, 0] },
        { id: "o3", prompt: "Voi", words: ["qui", "siete", "per", "studio?", "Voi"], answers: [4, 1, 0, 2, 3] },
        { id: "o4", prompt: "Lui", words: ["italiano.", "è", "Lui"], answers: [2, 1, 0] },
        { id: "o5", prompt: "Noi", words: ["in", "siamo", "vacanza.", "Noi"], answers: [3, 1, 0, 2] },
        { id: "o6", prompt: "Loro", words: ["qui", "sono", "per", "studio.", "Loro"], answers: [4, 1, 0, 2, 3] },
        { id: "o7", prompt: "Signore", words: ["Signore,", "perché", "Lei", "è", "in", "Italia?"], answers: [0, 1, 2, 3, 4, 5] },
        { id: "o8", prompt: "La camera", words: ["grande.", "è", "camera", "La"], answers: [3, 2, 1, 0] },
        { id: "o9", prompt: "Voi", words: ["studenti?", "siete", "Voi"], answers: [2, 1, 0] },
        { id: "o10", prompt: "Anna e Luca", words: ["a", "sono", "Firenze.", "Anna", "e", "Luca"], answers: [3, 4, 5, 1, 0, 2] }
      ]
    },
    {
      id: "u001_s2_gap", unitNumber: 1, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · Completamento", type: "gap_fill",
      title: "2.5 Completa le frasi con essere / Заполни предложения формой essere",
      instructions: "Inserisci la forma corretta di essere. / Вставь правильную форму essere.",
      items: [
        { id: "g1", before: "Anna, dove ", after: " adesso?", answers: ["sei"] },
        { id: "g2", before: "Io e Luca ", after: " a Firenze.", answers: ["siamo"] },
        { id: "g3", before: "La camera ", after: " tranquilla.", answers: ["è"] },
        { id: "g4", before: "Loro ", after: " studenti.", answers: ["sono"] },
        { id: "g5", before: "Signori, voi ", after: " qui per una conferenza?", answers: ["siete"] }
      ]
    },
    {
      id: "u001_s2_table", unitNumber: 1, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · Completamento", type: "table_fill",
      title: "2.6 Completa la tabella / Заполни таблицу",
      instructions: "Scrivi la forma di essere adatta al soggetto. / Напиши форму essere для каждого подлежащего.",
      columns: ["Soggetto", "Forma di essere"],
      items: [
        { id: "t1", prompt: "Io", cells: ["Io", { input: true }], answers: ["sono"] },
        { id: "t2", prompt: "Tu", cells: ["Tu", { input: true }], answers: ["sei"] },
        { id: "t3", prompt: "Lui / Lei", cells: ["Lui / Lei", { input: true }], answers: ["è"] },
        { id: "t4", prompt: "Noi", cells: ["Noi", { input: true }], answers: ["siamo"] },
        { id: "t5", prompt: "Voi", cells: ["Voi", { input: true }], answers: ["siete"] },
        { id: "t6", prompt: "Loro", cells: ["Loro", { input: true }], answers: ["sono"] }
      ]
    },
    {
      id: "u001_s2_production", unitNumber: 1, sessionNumber: 2, tier: "Produzione guidata",
      tierLabel: "Sessione 2 · Produzione", type: "open_response",
      title: "2.7 Descrivi dove sei / Опиши, где ты находишься",
      instructions: "Scrivi 3–4 frasi usando essere. / Напиши 3–4 предложения с глаголом essere.",
      items: [{ id: "p1", title: "Dove sono", prompt: "Di' dove sei, come sei e perché sei lì. Puoi inventare le informazioni. / Напиши, где ты находишься, какой ты и почему ты там. Информацию можно придумать." }]
    },
    {
      id: "u001_s2_production2", unitNumber: 1, sessionNumber: 2, tier: "Produzione guidata",
      tierLabel: "Sessione 2 · Produzione", type: "open_response",
      title: "2.8 Intervista a un ospite / Интервью с гостем",
      instructions: "Scrivi un breve dialogo di 4 battute usando essere. / Напиши короткий диалог из 4 реплик с глаголом essere.",
      items: [{ id: "p1", title: "Alla reception", prompt: "Chiedi a un ospite se è in Italia per lavoro, studio o turismo e scrivi le sue risposte. / Спроси гостя, приехал ли он в Италию по работе, учёбе или на отдых, и запиши его ответы." }]
    },

    // Sessione 3 — nazionalità, professioni e motivi del viaggio
    {
      id: "u001_s3_matching", unitNumber: 1, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · Riconoscimento", type: "matching",
      title: "3.1 Abbina nazionalità e paese / Соедини национальность и страну",
      instructions: "Abbina la nazionalità al paese corretto. / Соедини национальность с подходящей страной.",
      options: [
        { value: "J", label: "J · Canada" }, { value: "C", label: "C · Russia" },
        { value: "H", label: "H · Grecia" }, { value: "F", label: "F · Spagna" }, { value: "A", label: "A · Francia" },
        { value: "I", label: "I · Cina" }, { value: "D", label: "D · Inghilterra" },
        { value: "G", label: "G · Portogallo" }, { value: "B", label: "B · Giappone" }, { value: "E", label: "E · Germania" }
      ],
      items: [
        { id: "m1", prompt: "Francese", answers: ["A"] }, { id: "m2", prompt: "Giapponese", answers: ["B"] },
        { id: "m3", prompt: "Russa", answers: ["C"] }, { id: "m4", prompt: "Inglese", answers: ["D"] },
        { id: "m5", prompt: "Tedesco", answers: ["E"] }, { id: "m6", prompt: "Spagnolo", answers: ["F"] },
        { id: "m7", prompt: "Portoghese", answers: ["G"] }, { id: "m8", prompt: "Greco", answers: ["H"] },
        { id: "m9", prompt: "Cinese", answers: ["I"] }, { id: "m10", prompt: "Canadese", answers: ["J"] }
      ]
    },
    {
      id: "u001_s3_mc", unitNumber: 1, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · Riconoscimento", type: "multiple_choice",
      title: "3.2 Riconosci professioni e motivi / Определи профессии и цели поездки",
      instructions: "Scegli la risposta corretta. / Выбери правильный ответ.",
      items: [
        { id: "q1", prompt: "Chi è dentista?", options: [{ value: "a", label: "a · Yoko" }, { value: "b", label: "b · Mary" }, { value: "c", label: "c · Olga" }], answers: ["a"] },
        { id: "q2", prompt: "Perché Victor è in Italia?", options: [{ value: "a", label: "a · Per affari" }, { value: "b", label: "b · Per una conferenza" }, { value: "c", label: "c · Per studiare" }], answers: ["a"] },
        { id: "q3", prompt: "Che cosa fa Mary?", options: [{ value: "a", label: "a · Insegna inglese" }, { value: "b", label: "b · Fa l'avvocato" }, { value: "c", label: "c · Studia medicina" }], answers: ["a"] },
        { id: "q4", prompt: "Chi è studentessa e studia italiano?", options: [{ value: "a", label: "a · Mary" }, { value: "b", label: "b · Olga" }, { value: "c", label: "c · Yoko" }], answers: ["b"] },
        { id: "q5", prompt: "Chi è sposato e ha tre figli?", options: [{ value: "a", label: "a · Paolo Rossi" }, { value: "b", label: "b · Victor" }, { value: "c", label: "c · Karl" }], answers: ["a"] },
        { id: "q6", prompt: "Qual è la nazionalità di Karl e Klaus?", options: [{ value: "a", label: "a · Inglese" }, { value: "b", label: "b · Tedeschi" }, { value: "c", label: "c · Francesi" }], answers: ["b"] },
        { id: "q7", prompt: "Perché Yoko è in Italia?", options: [{ value: "a", label: "a · Per una conferenza" }, { value: "b", label: "b · Per studiare" }, { value: "c", label: "c · Per affari" }], answers: ["a"] },
        { id: "q8", prompt: "Victor è in Italia per…", options: [{ value: "a", label: "a · turismo" }, { value: "b", label: "b · affari" }, { value: "c", label: "c · studio" }], answers: ["b"] },
        { id: "q9", prompt: "Chi insegna inglese?", options: [{ value: "a", label: "a · Mary" }, { value: "b", label: "b · Olga" }, { value: "c", label: "c · Paolo" }], answers: ["a"] }
      ]
    },
    {
      id: "u001_s3_order", unitNumber: 1, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · Manipolazione", type: "word_order",
      title: "3.3 Riordina i profili / Составь описания",
      instructions: "Riordina le parole per formare frasi. / Расставь слова, чтобы составить предложения.",
      items: [
        { id: "o1", prompt: "Olga", words: ["russa.", "Olga", "è"], answers: [1, 2, 0] },
        { id: "o2", prompt: "Mary", words: ["inglese.", "insegna", "Mary"], answers: [2, 1, 0] },
        { id: "o3", prompt: "Victor", words: ["per", "Victor", "affari.", "è", "qui"], answers: [1, 3, 4, 0, 2] },
        { id: "o4", prompt: "Yoko", words: ["giapponese.", "Yoko", "è"], answers: [1, 2, 0] },
        { id: "o5", prompt: "Olga", words: ["italiano.", "studia", "Olga", "l'"], answers: [2, 1, 3, 0] },
        { id: "o6", prompt: "Mary", words: ["inglese.", "insegna", "Mary"], answers: [2, 1, 0] },
        { id: "o7", prompt: "Paolo Rossi", words: ["tre", "ha", "figli.", "Paolo", "Rossi"], answers: [3, 4, 1, 0, 2] },
        { id: "o8", prompt: "Karl e Klaus", words: ["tedeschi.", "sono", "Klaus", "Karl", "e"], answers: [3, 4, 2, 1, 0] },
        { id: "o9", prompt: "Victor", words: ["avvocato.", "un", "è", "Victor"], answers: [3, 2, 1, 0] },
        { id: "o10", prompt: "Yoko", words: ["una", "conferenza.", "per", "è", "in", "Italia", "Yoko"], answers: [6, 3, 4, 5, 2, 0, 1] }
      ]
    },
    {
      id: "u001_s3_order2", unitNumber: 1, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · Manipolazione", type: "word_order",
      title: "3.4 Ricostruisci le frasi / Восстанови предложения",
      instructions: "Tocca le parole nell'ordine corretto. / Нажимай на слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Karl e Klaus", words: ["studiare", "sono", "italiano.", "qui", "per", "l'"], answers: [1, 3, 4, 0, 5, 2] },
        { id: "o2", prompt: "Yoko", words: ["una", "è", "conferenza.", "per", "qui"], answers: [1, 4, 3, 0, 2] },
        { id: "o3", prompt: "Paolo Rossi", words: ["direttore", "è", "albergo.", "dell'", "il"], answers: [4, 1, 0, 3, 2] },
        { id: "o4", prompt: "Olga", words: ["l'italiano.", "studia", "Olga"], answers: [2, 1, 0] },
        { id: "o5", prompt: "Mary", words: ["inglese.", "insegna", "Mary"], answers: [2, 1, 0] },
        { id: "o6", prompt: "Victor", words: ["per", "affari.", "qui", "è", "Victor"], answers: [4, 3, 2, 0, 1] },
        { id: "o7", prompt: "Yoko", words: ["dentista.", "una", "è", "Yoko"], answers: [3, 2, 1, 0] },
        { id: "o8", prompt: "Klaus e Karl", words: ["studenti", "tedeschi.", "sono", "Klaus", "e", "Karl"], answers: [3, 4, 5, 2, 0, 1] },
        { id: "o9", prompt: "Olga", words: ["studentessa.", "una", "è", "Olga"], answers: [3, 2, 1, 0] },
        { id: "o10", prompt: "Paolo Rossi", words: ["sposato.", "è", "Rossi", "Paolo"], answers: [3, 2, 1, 0] }
      ]
    },
    {
      id: "u001_s3_gap", unitNumber: 1, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · Completamento", type: "gap_fill",
      title: "3.5 Completa i profili / Заполни описания",
      instructions: "Completa con le parole adatte. / Вставь подходящие слова.",
      items: [
        { id: "g1", before: "Victor è ", after: ".", answers: ["francese"] },
        { id: "g2", before: "Yoko fa la ", after: ".", answers: ["dentista"] },
        { id: "g3", before: "Olga è ", after: " e studia l'italiano.", answers: ["russa"] },
        { id: "g4", before: "Mary è ", after: " e insegna inglese.", answers: ["inglese"] },
        { id: "g5", before: "Karl e Klaus sono ", after: ".", answers: ["tedeschi"] }
      ]
    },
    {
      id: "u001_s3_table", unitNumber: 1, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · Completamento", type: "table_fill",
      title: "3.6 Completa i motivi del viaggio / Заполни цели поездки",
      instructions: "Scrivi il motivo del viaggio o il lavoro mancante. / Напиши пропущенную цель поездки или профессию.",
      columns: ["Persona", "Lavoro o studio", "Motivo"],
      items: [
        { id: "t1", prompt: "Yoko — motivo", cells: ["Yoko", "Dentista", { input: true }], answers: ["per una conferenza", "una conferenza"] },
        { id: "t2", prompt: "Victor — lavoro", cells: ["Victor", { input: true }, "Per affari"], answers: ["avvocato"] },
        { id: "t3", prompt: "Olga — motivo", cells: ["Olga", "Studentessa", { input: true }], answers: ["per studiare l'italiano e fare shopping", "studiare l'italiano e fare shopping"] },
        { id: "t4", prompt: "Paolo Rossi — lavoro", cells: ["Paolo Rossi", { input: true }, "Vive e lavora a Firenze"], answers: ["direttore"] },
        { id: "t5", prompt: "Mary — lavoro", cells: ["Mary", { input: true }, "Per insegnare inglese"], answers: ["insegnante"] },
        { id: "t6", prompt: "Karl e Klaus — motivo", cells: ["Karl e Klaus", "Studenti", { input: true }], answers: ["per studiare l'italiano"] }
      ]
    },
    {
      id: "u001_s3_production", unitNumber: 1, sessionNumber: 3, tier: "Produzione guidata",
      tierLabel: "Sessione 3 · Produzione", type: "open_response",
      title: "3.7 Scrivi un profilo / Напиши описание",
      instructions: "Scrivi 3–4 frasi seguendo i dati. / Напиши 3–4 предложения по данным.",
      items: [{ id: "p1", title: "Новая гостья", prompt: "Имя: Елена · национальность: итальянка · профессия: архитектор · она во Флоренции по работе." }]
    },
    {
      id: "u001_s3_production2", unitNumber: 1, sessionNumber: 3, tier: "Produzione guidata",
      tierLabel: "Sessione 3 · Produzione", type: "open_response",
      title: "3.8 Immagina un viaggio / Придумай поездку",
      instructions: "Inventa un ospite e scrivi 4 frasi sul suo viaggio. / Придумай гостя и напиши 4 предложения о его поездке.",
      items: [{ id: "p1", title: "Международный гость", prompt: "Придумай имя, национальность, профессию или место учёбы и причину, по которой он приехал в Италию." }]
    },

    // Sessione 4 — domande e presentazioni
    {
      id: "u001_s4_matching", unitNumber: 1, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · Riconoscimento", type: "matching",
      title: "4.1 Abbina le domande alle risposte / Соедини вопросы с ответами",
      instructions: "Abbina ogni domanda alla risposta adatta. / Соедини каждый вопрос с подходящим ответом.",
      options: [
        { value: "A", label: "A · Sono di Roma." }, { value: "B", label: "B · Sono qui per turismo." },
        { value: "C", label: "C · Mi chiamo Anna." }, { value: "D", label: "D · Sono insegnante." }
      ],
      items: [
        { id: "m1", prompt: "Come ti chiami?", answers: ["C"] },
        { id: "m2", prompt: "Di dove sei?", answers: ["A"] },
        { id: "m3", prompt: "Che lavoro fai?", answers: ["D"] },
        { id: "m4", prompt: "Perché sei in Italia?", answers: ["B"] }
      ]
    },
    {
      id: "u001_s4_mc", unitNumber: 1, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · Riconoscimento", type: "multiple_choice",
      title: "4.2 Scegli la domanda corretta / Выбери правильный вопрос",
      instructions: "Scegli la domanda adatta alla risposta. / Выбери вопрос, подходящий к ответу.",
      items: [
        { id: "q1", prompt: "Risposta: “Mi chiamo Luca.”", options: [{ value: "a", label: "a · Come ti chiami?" }, { value: "b", label: "b · Dove sei?" }, { value: "c", label: "c · Quanti anni ha l'albergo?" }], answers: ["a"] },
        { id: "q2", prompt: "Risposta: “Sono qui per studio.”", options: [{ value: "a", label: "a · Che nazionalità sei?" }, { value: "b", label: "b · Perché sei in Italia?" }, { value: "c", label: "c · Chi è il direttore?" }], answers: ["b"] },
        { id: "q3", prompt: "Risposta: “Sono giapponese.”", options: [{ value: "a", label: "a · Di dove sei?" }, { value: "b", label: "b · Che lavoro fai?" }, { value: "c", label: "c · Come ti chiami?" }], answers: ["a"] }
      ]
    },
    {
      id: "u001_s4_order", unitNumber: 1, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · Manipolazione", type: "word_order",
      title: "4.3 Riordina le domande / Составь вопросы",
      instructions: "Riordina le parole e inserisci la punteggiatura corretta. / Расставь слова и поставь правильный знак препинания.",
      items: [
        { id: "o1", prompt: "Nome", words: ["chiami?", "ti", "Come"], answers: [2, 1, 0] },
        { id: "o2", prompt: "Provenienza", words: ["sei?", "dove", "Di"], answers: [2, 1, 0] },
        { id: "o3", prompt: "Motivo", words: ["Italia?", "in", "sei", "Perché"], answers: [3, 2, 1, 0] }
      ]
    },
    {
      id: "u001_s4_order2", unitNumber: 1, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · Manipolazione", type: "word_order",
      title: "4.4 Riordina le risposte / Составь ответы",
      instructions: "Metti le parole nell'ordine corretto. / Расставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Presentazione", words: ["Anna.", "chiamo", "Mi"], answers: [2, 1, 0] },
        { id: "o2", prompt: "Città", words: ["Firenze.", "a", "Sono"], answers: [2, 1, 0] },
        { id: "o3", prompt: "Studio", words: ["l'italiano.", "studiare", "per", "in", "Italia", "Sono"], answers: [5, 3, 4, 2, 1, 0] }
      ]
    },
    {
      id: "u001_s4_gap", unitNumber: 1, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · Completamento", type: "gap_fill",
      title: "4.5 Completa il dialogo / Заполни диалог",
      instructions: "Completa le domande con le parole mancanti. / Заполни вопросы пропущенными словами.",
      items: [
        { id: "g1", before: "Come ti ", after: "?", answers: ["chiami"] },
        { id: "g2", before: "Di dove ", after: "?", answers: ["sei"] },
        { id: "g3", before: "Che lavoro ", after: "?", answers: ["fai"] },
        { id: "g4", before: "Perché sei ", after: " Italia?", answers: ["in"] }
      ]
    },
    {
      id: "u001_s4_table", unitNumber: 1, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · Completamento", type: "table_fill",
      title: "4.6 Completa la scheda personale / Заполни личную анкету",
      instructions: "Completa la scheda con i tuoi dati personali: scrivi il tuo nome, la nazionalità, il lavoro o lo studio, la città e il motivo del viaggio. / Заполни анкету своими данными: напиши имя, национальность, профессию или место учёбы, город и цель поездки.",
      columns: ["Informazione", "Risposta"],
      items: [
        { id: "t1", prompt: "Nome", cells: ["Nome", { input: true }], answers: ["risposta libera"] },
        { id: "t2", prompt: "Nazionalità", cells: ["Nazionalità", { input: true }], answers: ["risposta libera"] },
        { id: "t3", prompt: "Lavoro o studio", cells: ["Lavoro o studio", { input: true }], answers: ["risposta libera"] },
        { id: "t4", prompt: "Città", cells: ["Città", { input: true }], answers: ["risposta libera"] },
        { id: "t5", prompt: "Motivo del viaggio", cells: ["Motivo del viaggio", { input: true }], answers: ["risposta libera"] }
      ]
    },
    {
      id: "u001_s4_production", unitNumber: 1, sessionNumber: 4, tier: "Produzione guidata",
      tierLabel: "Sessione 4 · Produzione", type: "open_response",
      title: "4.7 Rispondi alle domande / Ответь на вопросы",
      instructions: "Rispondi con frasi brevi e complete. Puoi inventare le informazioni. / Ответь короткими полными предложениями. Можно придумать информацию.",
      items: [
        { id: "q1", title: "Nome", prompt: "Come ti chiami?" },
        { id: "q2", title: "Provenienza", prompt: "Di dove sei?" },
        { id: "q3", title: "Motivo", prompt: "Perché sei in Italia?" }
      ]
    },
    {
      id: "u001_s4_production2", unitNumber: 1, sessionNumber: 4, tier: "Produzione guidata",
      tierLabel: "Sessione 4 · Produzione", type: "open_response",
      title: "4.8 Scrivi un dialogo alla reception / Напиши диалог на ресепшене",
      instructions: "Scrivi un dialogo di 4–6 battute tra un ospite e il receptionist. / Напиши диалог из 4–6 реплик между гостем и администратором.",
      items: [{ id: "p1", title: "Nuovo ospite", prompt: "Usa domande e risposte su nome, nazionalità e motivo del viaggio." }]
    },

    // Sessione 5 — ripasso e produzione
    {
      id: "u001_s5_matching", unitNumber: 1, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · Riconoscimento", type: "matching",
      title: "5.1 Abbina le parole alle categorie / Соедини слова с категориями",
      instructions: "Abbina ogni parola alla categoria corretta. / Соедини каждое слово с правильной категорией.",
      options: [
        { value: "A", label: "A · Professione" }, { value: "B", label: "B · Nazionalità" },
        { value: "C", label: "C · Motivo del viaggio" }, { value: "D", label: "D · Luogo" }
      ],
      items: [
        { id: "m1", prompt: "Dentista", answers: ["A"] }, { id: "m2", prompt: "Giapponese", answers: ["B"] },
        { id: "m3", prompt: "Per turismo", answers: ["C"] }, { id: "m4", prompt: "Firenze", answers: ["D"] },
        { id: "m5", prompt: "Avvocato", answers: ["A"] }, { id: "m6", prompt: "Russa", answers: ["B"] }
      ]
    },
    {
      id: "u001_s5_mc", unitNumber: 1, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · Riconoscimento", type: "multiple_choice",
      title: "5.2 Ripasso: scegli la frase corretta / Повторение: выбери правильное предложение",
      instructions: "Scegli la frase corretta. / Выбери правильное предложение.",
      items: [
        { id: "q1", prompt: "Una persona:", options: [{ value: "a", label: "a · è italiana" }, { value: "b", label: "b · sono italiana" }, { value: "c", label: "c · siamo italiana" }], answers: ["a"] },
        { id: "q2", prompt: "Noi:", options: [{ value: "a", label: "a · è a Firenze" }, { value: "b", label: "b · siamo a Firenze" }, { value: "c", label: "c · siete a Firenze" }], answers: ["b"] },
        { id: "q3", prompt: "Loro:", options: [{ value: "a", label: "a · sono studenti" }, { value: "b", label: "b · è studenti" }, { value: "c", label: "c · sei studenti" }], answers: ["a"] },
        { id: "q4", prompt: "Per chiedere il motivo del viaggio:", options: [{ value: "a", label: "a · Di dove sei?" }, { value: "b", label: "b · Perché sei in Italia?" }, { value: "c", label: "c · Come ti chiami?" }], answers: ["b"] }
      ]
    },
    {
      id: "u001_s5_order", unitNumber: 1, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · Manipolazione", type: "word_order",
      title: "5.3 Riordina le frasi di ripasso / Составь предложения для повторения",
      instructions: "Riordina le parole. / Расставь слова по порядку.",
      items: [
        { id: "o1", prompt: "Olga", words: ["russa.", "è", "Olga"], answers: [2, 1, 0] },
        { id: "o2", prompt: "Gli ospiti", words: ["albergo.", "in", "sono", "Gli", "ospiti"], answers: [3, 4, 2, 1, 0] },
        { id: "o3", prompt: "La camera", words: ["grande.", "è", "La", "camera"], answers: [2, 3, 1, 0] }
      ]
    },
    {
      id: "u001_s5_order2", unitNumber: 1, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · Manipolazione", type: "word_order",
      title: "5.4 Ricostruisci le presentazioni / Восстанови представления",
      instructions: "Metti le parole nell'ordine corretto. / Расставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Direttore", words: ["albergo.", "dell'", "è", "Rossi", "Paolo", "il", "direttore"], answers: [4, 3, 2, 5, 6, 1, 0] },
        { id: "o2", prompt: "Insegnante", words: ["inglese.", "un'insegnante", "è", "Mary"], answers: [3, 2, 1, 0] },
        { id: "o3", prompt: "Affari", words: ["affari.", "per", "qui", "è", "Victor"], answers: [4, 3, 2, 1, 0] },
        { id: "o4", prompt: "Dentista", words: ["dentista.", "una", "è", "Yoko"], answers: [3, 2, 1, 0] },
        { id: "o5", prompt: "Studentessa", words: ["studentessa.", "una", "è", "Olga"], answers: [3, 2, 1, 0] }
      ]
    },
    {
      id: "u001_s5_gap", unitNumber: 1, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · Completamento", type: "gap_fill",
      title: "5.5 Completa il riepilogo / Заполни краткое содержание",
      instructions: "Completa con la forma corretta di essere. / Вставь правильную форму essere.",
      items: [
        { id: "g1", before: "Paolo Rossi ", after: " il direttore.", answers: ["è"] },
        { id: "g2", before: "Karl e Klaus ", after: " tedeschi.", answers: ["sono"] },
        { id: "g3", before: "Io e Olga ", after: " a Firenze.", answers: ["siamo"] },
        { id: "g4", before: "Tu ", after: " qui per studio?", answers: ["sei"] },
        { id: "g5", before: "Signori, voi ", after: " in vacanza?", answers: ["siete"] }
      ]
    },
    {
      id: "u001_s5_table", unitNumber: 1, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · Completamento", type: "table_fill",
      title: "5.6 Completa la tabella di ripasso / Заполни итоговую таблицу",
      instructions: "Completa ogni informazione con una parola o una frase breve. / Заполни таблицу словом или короткой фразой.",
      columns: ["Indizio", "Informazione"],
      items: [
        { id: "t1", prompt: "Nazionalità di Yoko", cells: ["Yoko", { input: true }], answers: ["giapponese"] },
        { id: "t2", prompt: "Lavoro di Victor", cells: ["Victor", { input: true }], answers: ["avvocato"] },
        { id: "t3", prompt: "Città dell'albergo", cells: ["Albergo Ponte Vecchio", { input: true }], answers: ["firenze", "a firenze"] },
        { id: "t4", prompt: "Lavoro di Mary", cells: ["Mary", { input: true }], answers: ["insegnante"] },
        { id: "t5", prompt: "Nazionalità di Karl e Klaus", cells: ["Karl e Klaus", { input: true }], answers: ["tedeschi"] }
      ]
    },
    {
      id: "u001_s5_production", unitNumber: 1, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · Produzione", type: "open_response",
      title: "5.7 Presenta un ospite dell'albergo / Представь гостя отеля",
      instructions: "Scrivi 4–5 frasi complete. Puoi inventare un ospite. / Напиши 4–5 полных предложений. Можно придумать гостя.",
      items: [{ id: "p1", title: "Un ospite", prompt: "Presenta la persona, indica nazionalità, professione o studio, città e motivo del viaggio. / Представь человека, укажи его национальность, профессию или место учёбы, город и цель поездки." }]
    },
    {
      id: "u001_s5_production2", unitNumber: 1, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · Produzione", type: "open_response",
      title: "5.8 Scrivi una scena alla reception / Напиши сцену на ресепшене",
      instructions: "Scrivi un dialogo di 6 battute tra un ospite e il receptionist. / Напиши диалог из 6 реплик между гостем и администратором.",
      items: [{ id: "p1", title: "Добро пожаловать во Флоренцию", prompt: "Включи приветствие, имя гостя, его национальность и цель поездки." }]
    }
  ]
};

// Mescola le parole degli esercizi di riordino e aggiorna gli indici delle soluzioni.
window.HOMEWORK_EXERCISES_CATALOG["1"].exercises
  .filter(exercise => exercise.type === "word_order")
  .forEach(exercise => {
    exercise.items.forEach(item => {
      if (!Array.isArray(item.words) || !Array.isArray(item.answers)) return;

      const shuffledIndexes = item.words.map((_, index) => index);
      for (let i = shuffledIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndexes[i], shuffledIndexes[j]] = [shuffledIndexes[j], shuffledIndexes[i]];
      }

      const newIndexByOldIndex = [];
      shuffledIndexes.forEach((oldIndex, newIndex) => {
        newIndexByOldIndex[oldIndex] = newIndex;
      });
      item.words = shuffledIndexes.map(index => item.words[index]);
      item.answers = item.answers.map(index => newIndexByOldIndex[index]);
    });
  });
