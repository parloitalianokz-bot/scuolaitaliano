// Catalogo esercizi — Unità 11: La casalinga (A1.1 · IT / RU)
window.HOMEWORK_EXERCISES_CATALOG = window.HOMEWORK_EXERCISES_CATALOG || {};
window.HOMEWORK_EXERCISES_CATALOG["11"] = {
  unitNumber: 11,
  unitSlug: "u_011",
  unitTitle: "Unità 11 · La casalinga / Домохозяйка",
  level: "A1.1",
  description: "Quaranta attività in cinque sessioni progressive sulla routine quotidiana, gli orari, i luoghi della casa, fare e stare + gerundio. Le risposte aperte richiedono la revisione dell’insegnante. / Сорок заданий в пяти занятиях: повседневные дела, время, места в доме, fare и stare + gerundio. Открытые ответы проверяет преподаватель.",
  sessions: [
    { number: 1, title: "Sessione 1 · La giornata di Maria / День Марии" },
    { number: 2, title: "Sessione 2 · Orari, luoghi e preposizioni / Время, места и предлоги" },
    { number: 3, title: "Sessione 3 · Il verbo fare / Глагол fare" },
    { number: 4, title: "Sessione 4 · Stare + gerundio / Stare + gerundio" },
    { number: 5, title: "Sessione 5 · Presente abituale e progressivo / Обычное и длительное настоящее" }
  ],
  defaultExerciseIds: ["u011_s1_comprensione", "u011_s1_abbinamento", "u011_s1_ordine", "u011_s1_trasformazione", "u011_s1_cloze", "u011_s1_tabella", "u011_s1_risposte", "u011_s1_produzione"],
  exercises: [
    // Sessione 1 — comprensione e routine al presente
    {
      id: "u011_s1_comprensione", unitNumber: 11, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "1.1 Comprendi la giornata di Maria / Пойми распорядок дня Марии",
      instructions: "Scegli la risposta corretta secondo il racconto. / Выбери правильный ответ по рассказу.",
      items: [
        { id: "q1", prompt: "A che ora comincia la giornata di Maria?", options: [{ value: "a", label: "a · Alle sette" }, { value: "b", label: "b · Alle otto e mezzo" }, { value: "c", label: "c · Alle undici" }], answers: ["a"] },
        { id: "q2", prompt: "Dove porta i bambini alle otto e mezzo?", options: [{ value: "a", label: "a · Al supermercato" }, { value: "b", label: "b · A scuola" }, { value: "c", label: "c · In salotto" }], answers: ["b"] },
        { id: "q3", prompt: "Che cosa fa dopo aver accompagnato i bambini?", options: [{ value: "a", label: "a · Va al supermercato e fa la spesa" }, { value: "b", label: "b · Prepara la cena" }, { value: "c", label: "c · Fa una passeggiata" }], answers: ["a"] },
        { id: "q4", prompt: "Che cosa fanno i bambini dopo aver studiato?", options: [{ value: "a", label: "a · Dormono in camera" }, { value: "b", label: "b · Giocano in salotto" }, { value: "c", label: "c · Vanno al supermercato" }], answers: ["b"] },
        { id: "q5", prompt: "Che cosa prepara Maria alle sette?", options: [{ value: "a", label: "a · La colazione" }, { value: "b", label: "b · Il pranzo" }, { value: "c", label: "c · La cena" }], answers: ["c"] },
        { id: "q6", prompt: "Con chi fa una passeggiata alle dieci e mezzo?", options: [{ value: "a", label: "a · Con il cane" }, { value: "b", label: "b · Con i bambini" }, { value: "c", label: "c · Con il marito" }], answers: ["a"] }
      ]
    },
    {
      id: "u011_s1_abbinamento", unitNumber: 11, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "1.2 Abbina l’orario all’attività / Соедини время с занятием",
      instructions: "Abbina ogni orario all’attività del racconto. / Соедини время с занятием из рассказа.",
      options: [
        { value: "D", label: "D · Maria prepara la cena" }, { value: "A", label: "A · Maria porta i bambini a scuola" },
        { value: "F", label: "F · Maria porta i bambini a letto" }, { value: "C", label: "C · La famiglia pranza" },
        { value: "B", label: "B · Maria fa una passeggiata con il cane" }, { value: "E", label: "E · Maria prepara la colazione" }
      ],
      items: [
        { id: "m1", prompt: "Alle sette del mattino", answers: ["E"] }, { id: "m2", prompt: "Alle otto e mezzo", answers: ["A"] },
        { id: "m3", prompt: "All’una", answers: ["C"] }, { id: "m4", prompt: "Alle sette di sera", answers: ["D"] },
        { id: "m5", prompt: "Alle dieci", answers: ["F"] }, { id: "m6", prompt: "Alle dieci e mezzo", answers: ["B"] }
      ]
    },
    {
      id: "u011_s1_ordine", unitNumber: 11, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "1.3 Riordina le frasi della routine / Составь предложения о распорядке дня",
      instructions: "Tocca le parole nell’ordine corretto per formare le frasi. / Нажимай на слова в правильном порядке, чтобы составить предложения.",
      items: [
        { id: "o1", prompt: "La mattina", words: ["sette.", "alle", "comincia", "giornata", "La", "mia"], answers: [4, 5, 3, 2, 1, 0] },
        { id: "o2", prompt: "La colazione", words: ["famiglia.", "la", "Preparo", "per", "colazione", "tutta", "la"], answers: [2, 1, 4, 3, 5, 6, 0] },
        { id: "o3", prompt: "La scuola", words: ["a", "bambini", "porto", "scuola.", "i", "Io"], answers: [5, 2, 4, 1, 0, 3] },
        { id: "o4", prompt: "Il supermercato", words: ["spesa.", "la", "faccio", "supermercato", "al", "Vado", "e"], answers: [5, 4, 3, 6, 2, 1, 0] },
        { id: "o5", prompt: "Il pranzo", words: ["pranzo.", "il", "preparo", "casa", "a", "Torno", "e"], answers: [5, 3, 4, 6, 2, 1, 0] },
        { id: "o6", prompt: "I bambini", words: ["salotto.", "in", "giocano", "bambini", "I"], answers: [4, 3, 2, 1, 0] },
        { id: "o7", prompt: "La cena", words: ["cena", "la", "Maria", "sette.", "prepara", "alle"], answers: [2, 4, 1, 0, 5, 3] },
        { id: "o8", prompt: "La passeggiata", words: ["cane.", "il", "con", "passeggiata", "una", "faccio"], answers: [5, 4, 3, 2, 1, 0] }
      ]
    },
    {
      id: "u011_s1_trasformazione", unitNumber: 11, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "1.4 Ricostruisci le frasi al presente / Составь предложения в настоящем времени",
      instructions: "Riordina soggetto, verbo e complementi. / Расставь подлежащее, глагол и остальные части предложения.",
      items: [
        { id: "o1", prompt: "Maria e i bambini", words: ["a", "Maria", "i", "casa.", "bambini", "tornano", "e"], answers: [1, 6, 2, 4, 5, 0, 3] },
        { id: "o2", prompt: "Il marito", words: ["televisione", "guarda", "marito", "Il", "la", "in", "salotto."], answers: [3, 2, 1, 4, 0, 5, 6] },
        { id: "o3", prompt: "La famiglia", words: ["mangiamo", "noi", "All’una", "insieme."], answers: [2, 3, 1, 0] },
        { id: "o4", prompt: "Dopo pranzo", words: ["a", "vado", "bambini", "prendere", "i", "Dopo", "pranzo"], answers: [5, 6, 1, 3, 4, 2, 0] },
        { id: "o5", prompt: "I piatti", words: ["piatti.", "io", "i", "lavo", "Poi"], answers: [4, 1, 3, 2, 0] },
        { id: "o6", prompt: "A mezzanotte", words: ["letto.", "da", "camera", "in", "vado", "A", "mezzanotte"], answers: [5, 6, 4, 3, 2, 1, 0] }
      ]
    },
    {
      id: "u011_s1_cloze", unitNumber: 11, sessionNumber: 1, tier: "Intermedio",
      tierLabel: "Sessione 1 · Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "1.5 Completa il racconto al presente / Заполни рассказ формами настоящего времени",
      instructions: "Coniuga i verbi tra parentesi al presente. / Проспрягай глаголы в скобках в настоящем времени.",
      items: [
        { id: "g1", before: "La giornata di Maria ", after: " alle sette. (cominciare)", answers: ["comincia"] },
        { id: "g2", before: "Maria ", after: " la colazione. (preparare)", answers: ["prepara"] },
        { id: "g3", before: "I bambini ", after: " ancora. (dormire)", answers: ["dormono"] },
        { id: "g4", before: "Alle otto e mezzo Maria ", after: " i bambini a scuola. (portare)", answers: ["porta"] },
        { id: "g5", before: "Poi lei ", after: " al supermercato. (andare)", answers: ["va"] },
        { id: "g6", before: "All’una Maria e suo marito ", after: " insieme. (mangiare)", answers: ["mangiano"] },
        { id: "g7", before: "I bambini ", after: " un po’ e poi giocano. (studiare)", answers: ["studiano"] },
        { id: "g8", before: "Dopo cena Maria ", after: " i piatti. (lavare)", answers: ["lava"] }
      ]
    },
    {
      id: "u011_s1_tabella", unitNumber: 11, sessionNumber: 1, tier: "Intermedio",
      tierLabel: "Sessione 1 · Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "1.6 Completa la tabella della giornata / Заполни таблицу распорядка дня",
      instructions: "Completa ogni informazione con una frase breve tratta dal racconto. / Заполни таблицу короткими фразами по рассказу.",
      columns: ["Orario", "Persona", "Attività"],
      items: [
        { id: "t1", prompt: "Alle sette", cells: ["Alle sette", "Maria", { input: true }], answers: ["prepara la colazione"] },
        { id: "t2", prompt: "Alle otto e mezzo", cells: ["Alle otto e mezzo", "Maria", { input: true }], answers: ["porta i bambini a scuola"] },
        { id: "t3", prompt: "Alle undici", cells: ["Alle undici", "Maria", { input: true }], answers: ["torna a casa e prepara il pranzo"] },
        { id: "t4", prompt: "All’una", cells: ["All’una", "Maria e suo marito", { input: true }], answers: ["vanno a mangiare", "mangiano"] },
        { id: "t5", prompt: "Alle tre", cells: ["Alle tre", "Maria e i bambini", { input: true }], answers: ["tornano a casa"] },
        { id: "t6", prompt: "Alle sette di sera", cells: ["Alle sette", "Maria", { input: true }], answers: ["prepara la cena"] },
        { id: "t7", prompt: "Alle dieci", cells: ["Alle dieci", "Maria", { input: true }], answers: ["porta i bambini a letto"] },
        { id: "t8", prompt: "Alle dieci e mezzo", cells: ["Alle dieci e mezzo", "Maria e il cane", { input: true }], answers: ["fanno una passeggiata in giardino"] }
      ]
    },
    {
      id: "u011_s1_risposte", unitNumber: 11, sessionNumber: 1, tier: "Produzione guidata",
      tierLabel: "Sessione 1 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "1.7 Rispondi sul racconto / Ответь по рассказу",
      instructions: "Rispondi con frasi complete. Risposta aperta: revisione dell’insegnante. / Ответь полными предложениями. Открытый ответ проверяет преподаватель.",
      items: [
        { id: "r1", title: "La mattina", prompt: "Che cosa fa Maria alle sette e alle otto e mezzo?" },
        { id: "r2", title: "Il pranzo", prompt: "Dove torna Maria alle undici e che cosa fa? Che cosa succede all’una?" },
        { id: "r3", title: "Il pomeriggio", prompt: "Che cosa fanno i bambini dopo aver studiato? Che cosa fanno Maria e suo marito?" },
        { id: "r4", title: "La sera", prompt: "Che cosa fa Maria dopo cena e a mezzanotte?" }
      ]
    },
    {
      id: "u011_s1_produzione", unitNumber: 11, sessionNumber: 1, tier: "Produzione guidata",
      tierLabel: "Sessione 1 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "1.8 Racconta la tua giornata tipo / Расскажи о своём обычном дне",
      instructions: "Scrivi 6–8 frasi sulla tua giornata. Inserisci almeno quattro orari e sei verbi al presente. Risposta aperta: revisione dell’insegnante. / Напиши 6–8 предложений о своём обычном дне: укажи не менее четырёх временных отметок и используй шесть глаголов в настоящем времени. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "La mia giornata", prompt: "Puoi parlare di mattina, pomeriggio e sera. / Расскажи об утре, дне и вечере." }]
    },

    // Sessione 2 — orari, luoghi e preposizioni
    {
      id: "u011_s2_abbinamento", unitNumber: 11, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "2.1 Abbina i luoghi alle attività / Соедини места с занятиями",
      instructions: "Abbina ogni attività al luogo corretto. / Соедини занятие с подходящим местом.",
      options: [
        { value: "C", label: "C · in salotto" }, { value: "F", label: "F · a scuola" }, { value: "A", label: "A · in cucina" },
        { value: "E", label: "E · in giardino" }, { value: "B", label: "B · al supermercato" }, { value: "D", label: "D · in camera da letto" }
      ],
      items: [
        { id: "m1", prompt: "I bambini studiano", answers: ["F"] }, { id: "m2", prompt: "Maria fa la spesa", answers: ["B"] },
        { id: "m3", prompt: "La famiglia prepara e mangia il pranzo", answers: ["A"] }, { id: "m4", prompt: "Il marito guarda la televisione e i bambini giocano", answers: ["C"] },
        { id: "m5", prompt: "Maria fa una passeggiata con il cane", answers: ["E"] }, { id: "m6", prompt: "Il marito guarda la televisione la mattina", answers: ["D"] }
      ]
    },
    {
      id: "u011_s2_preposizioni_mc", unitNumber: 11, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "2.2 Riconosci la preposizione / Выбери правильный предлог",
      instructions: "Scegli la preposizione o la forma articolata corretta. / Выбери правильный предлог или слитную форму.",
      items: [
        { id: "q1", prompt: "Maria porta i bambini ___ scuola.", options: [{ value: "a", label: "a · a" }, { value: "b", label: "b · in" }, { value: "c", label: "c · da" }], answers: ["a"] },
        { id: "q2", prompt: "Maria va ___ supermercato.", options: [{ value: "a", label: "a · in" }, { value: "b", label: "b · al" }, { value: "c", label: "c · a" }], answers: ["b"] },
        { id: "q3", prompt: "I bambini giocano ___ salotto.", options: [{ value: "a", label: "a · a" }, { value: "b", label: "b · da" }, { value: "c", label: "c · in" }], answers: ["c"] },
        { id: "q4", prompt: "Maria prepara la colazione ___ tutta la famiglia.", options: [{ value: "a", label: "a · per" }, { value: "b", label: "b · con" }, { value: "c", label: "c · da" }], answers: ["a"] },
        { id: "q5", prompt: "Il marito guarda la televisione in camera ___ letto.", options: [{ value: "a", label: "a · a" }, { value: "b", label: "b · da" }, { value: "c", label: "c · di" }], answers: ["b"] },
        { id: "q6", prompt: "Alle dieci porto i bambini ___ letto.", options: [{ value: "a", label: "a · in" }, { value: "b", label: "b · a" }, { value: "c", label: "c · al" }], answers: ["b"] },
        { id: "q7", prompt: "Faccio una passeggiata ___ giardino ___ il cane.", options: [{ value: "a", label: "a · in / con" }, { value: "b", label: "b · a / per" }, { value: "c", label: "c · al / da" }], answers: ["a"] },
        { id: "q8", prompt: "___ mezzanotte vado in camera da letto.", options: [{ value: "a", label: "a · Alle" }, { value: "b", label: "b · A" }, { value: "c", label: "c · In" }], answers: ["b"] }
      ]
    },
    {
      id: "u011_s2_ordine", unitNumber: 11, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "2.3 Ricostruisci le frasi con i luoghi / Составь предложения с названиями мест",
      instructions: "Riordina le parole e fai attenzione alle preposizioni. / Расставь слова по порядку и обрати внимание на предлоги.",
      items: [
        { id: "o1", prompt: "La cucina", words: ["cucina.", "in", "Maria", "pranzo", "il", "prepara"], answers: [2, 5, 4, 3, 1, 0] },
        { id: "o2", prompt: "La scuola", words: ["a", "bambini", "scuola.", "i", "porta", "Maria"], answers: [5, 4, 3, 1, 0, 2] },
        { id: "o3", prompt: "Il salotto", words: ["televisione", "in", "guarda", "marito", "la", "Il", "salotto."], answers: [5, 3, 2, 4, 0, 1, 6] },
        { id: "o4", prompt: "Il supermercato", words: ["spesa", "supermercato.", "la", "al", "faccio", "Io"], answers: [5, 4, 2, 0, 3, 1] },
        { id: "o5", prompt: "A casa", words: ["casa", "Alle", "a", "undici", "torno."], answers: [1, 3, 4, 2, 0] },
        { id: "o6", prompt: "Il giardino", words: ["giardino", "in", "passeggiata", "una", "faccio", "il", "con", "cane."], answers: [4, 3, 2, 1, 0, 6, 5, 7] },
        { id: "o7", prompt: "La camera da letto", words: ["letto.", "da", "camera", "in", "va", "Maria", "a", "dormire"], answers: [5, 4, 6, 7, 3, 2, 1, 0] },
        { id: "o8", prompt: "Dopo pranzo", words: ["scuola.", "a", "bambini", "prendere", "i", "va", "Maria", "Dopo", "pranzo"], answers: [7, 8, 6, 5, 3, 4, 2, 1, 0] }
      ]
    },
    {
      id: "u011_s2_cloze", unitNumber: 11, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · Manipolazione e riordino (Livello elementare)", type: "gap_fill",
      title: "2.4 Inserisci le preposizioni / Вставь предлоги",
      instructions: "Completa le espressioni con la preposizione corretta. / Вставь правильный предлог.",
      items: [
        { id: "g1", before: "La giornata comincia ", after: " sette.", answers: ["alle"] },
        { id: "g2", before: "Maria porta i bambini ", after: " scuola.", answers: ["a"] },
        { id: "g3", before: "Poi va ", after: " supermercato.", answers: ["al"] },
        { id: "g4", before: "Alle undici torna ", after: " casa.", answers: ["a"] },
        { id: "g5", before: "Il marito guarda la televisione ", after: " salotto.", answers: ["in"] },
        { id: "g6", before: "Maria prepara la cena ", after: " tutta la famiglia.", answers: ["per"] },
        { id: "g7", before: "Fa una passeggiata in giardino ", after: " il cane.", answers: ["con"] },
        { id: "g8", before: "Alle dieci porta i bambini ", after: " letto.", answers: ["a"] }
      ]
    },
    {
      id: "u011_s2_tabella", unitNumber: 11, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "2.5 Completa la tabella dei luoghi / Заполни таблицу мест",
      instructions: "Scrivi l’espressione di luogo completa, con la preposizione. / Запиши выражение места полностью, вместе с предлогом.",
      columns: ["Attività", "Luogo"],
      items: [
        { id: "t1", prompt: "Portare i bambini a lezione", cells: ["Portare i bambini", { input: true }], answers: ["a scuola"] },
        { id: "t2", prompt: "Fare la spesa", cells: ["Fare la spesa", { input: true }], answers: ["al supermercato"] },
        { id: "t3", prompt: "Guardare la televisione (mattina)", cells: ["Guardare la televisione", { input: true }], answers: ["in camera da letto"] },
        { id: "t4", prompt: "Guardare la televisione (pomeriggio)", cells: ["Guardare la televisione", { input: true }], answers: ["in salotto"] },
        { id: "t5", prompt: "Guardare la televisione (sera)", cells: ["Guardare la televisione", { input: true }], answers: ["in bagno"] },
        { id: "t6", prompt: "Fare una passeggiata", cells: ["Fare una passeggiata", { input: true }], answers: ["in giardino"] },
        { id: "t7", prompt: "Andare a dormire", cells: ["Andare a dormire", { input: true }], answers: ["in camera da letto"] },
        { id: "t8", prompt: "Mettere a dormire i bambini", cells: ["Portare i bambini", { input: true }], answers: ["a letto"] }
      ]
    },
    {
      id: "u011_s2_correzione", unitNumber: 11, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · Completamento e trasformazione (Livello intermedio · revisione docente)", type: "open_response",
      title: "2.6 Correggi le preposizioni / Исправь предлоги",
      instructions: "Riscrivi correttamente ogni frase e indica la preposizione da correggere. Risposta aperta: revisione dell’insegnante. / Перепиши предложения правильно и укажи, какой предлог нужно исправить. Ответ проверяет преподаватель.",
      items: [
        { id: "e1", title: "Frase 1", prompt: "Correggi: Maria porta i bambini in scuola." },
        { id: "e2", title: "Frase 2", prompt: "Correggi: Vado a supermercato a fare la spesa." },
        { id: "e3", title: "Frase 3", prompt: "Correggi: I bambini giocano a salotto." },
        { id: "e4", title: "Frase 4", prompt: "Correggi: Faccio una passeggiata a giardino con il cane." }
      ]
    },
    {
      id: "u011_s2_produzione", unitNumber: 11, sessionNumber: 2, tier: "Produzione guidata",
      tierLabel: "Sessione 2 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "2.7 Organizza un pomeriggio / Составь план на день",
      instructions: "Organizza un pomeriggio con almeno cinque attività, tre orari e quattro luoghi. Usa le preposizioni studiate. Risposta aperta: revisione dell’insegnante. / Составь план дня: не менее пяти занятий, трёх временных отметок и четырёх мест. Используй изученные предлоги. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "Il mio programma", prompt: "Scrivi frasi complete dal pranzo alla sera. / Напиши полные предложения о времени после обеда и до вечера." }]
    },

    // Sessione 3 — fare al presente e soggetti
    {
      id: "u011_s3_abbinamento", unitNumber: 11, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "3.1 Abbina il soggetto alla forma di fare / Соедини подлежащее с формой fare",
      instructions: "Abbina ogni soggetto alla forma corretta del verbo fare. / Соедини подлежащее с правильной формой глагола fare.",
      options: [
        { value: "C", label: "C · facciamo" }, { value: "F", label: "F · fanno" }, { value: "A", label: "A · faccio" },
        { value: "E", label: "E · fa" }, { value: "B", label: "B · fai" }, { value: "D", label: "D · fate" }
      ],
      items: [
        { id: "m1", prompt: "Io", answers: ["A"] }, { id: "m2", prompt: "Tu", answers: ["B"] },
        { id: "m3", prompt: "Maria", answers: ["E"] }, { id: "m4", prompt: "Noi", answers: ["C"] },
        { id: "m5", prompt: "Voi", answers: ["D"] }, { id: "m6", prompt: "I bambini", answers: ["F"] }
      ]
    },
    {
      id: "u011_s3_mc", unitNumber: 11, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "3.2 Scegli fare al presente / Выбери форму fare в настоящем времени",
      instructions: "Completa scegliendo la forma corretta di fare. / Выбери правильную форму fare.",
      items: [
        { id: "q1", prompt: "Io ___ colazione alle sette.", options: [{ value: "a", label: "a · faccio" }, { value: "b", label: "b · fai" }, { value: "c", label: "c · fa" }], answers: ["a"] },
        { id: "q2", prompt: "Tu ___ la doccia la mattina.", options: [{ value: "a", label: "a · fanno" }, { value: "b", label: "b · fai" }, { value: "c", label: "c · facciamo" }], answers: ["b"] },
        { id: "q3", prompt: "Mia sorella ___ la spesa il sabato.", options: [{ value: "a", label: "a · fate" }, { value: "b", label: "b · fa" }, { value: "c", label: "c · faccio" }], answers: ["b"] },
        { id: "q4", prompt: "Io e Marco ___ una passeggiata.", options: [{ value: "a", label: "a · fanno" }, { value: "b", label: "b · facciamo" }, { value: "c", label: "c · fate" }], answers: ["b"] },
        { id: "q5", prompt: "Ragazzi, che cosa ___ stasera?", options: [{ value: "a", label: "a · fate" }, { value: "b", label: "b · fanno" }, { value: "c", label: "c · facciamo" }], answers: ["a"] },
        { id: "q6", prompt: "I miei genitori ___ colazione in cucina.", options: [{ value: "a", label: "a · fai" }, { value: "b", label: "b · fa" }, { value: "c", label: "c · fanno" }], answers: ["c"] },
        { id: "q7", prompt: "Maria e suo marito ___ la spesa insieme.", options: [{ value: "a", label: "a · fanno" }, { value: "b", label: "b · faccio" }, { value: "c", label: "c · fate" }], answers: ["a"] },
        { id: "q8", prompt: "Che cosa ___ tu dopo pranzo?", options: [{ value: "a", label: "a · fa" }, { value: "b", label: "b · fai" }, { value: "c", label: "c · facciamo" }], answers: ["b"] }
      ]
    },
    {
      id: "u011_s3_ordine", unitNumber: 11, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "3.3 Ricostruisci le frasi con fare / Составь предложения с fare",
      instructions: "Riordina le parole e coniuga fare secondo il soggetto. / Расставь слова и согласуй fare с подлежащим.",
      items: [
        { id: "o1", prompt: "Io", words: ["colazione.", "faccio", "Io", "la"], answers: [2, 1, 3, 0] },
        { id: "o2", prompt: "Tu", words: ["spesa", "fai", "Tu", "la", "oggi."], answers: [2, 1, 3, 0, 4] },
        { id: "o3", prompt: "Maria", words: ["una", "fa", "passeggiata.", "Maria"], answers: [3, 1, 0, 2] },
        { id: "o4", prompt: "Noi", words: ["la", "facciamo", "Noi", "spesa."], answers: [2, 1, 0, 3] },
        { id: "o5", prompt: "Voi", words: ["fate", "doccia", "la", "Voi", "a", "casa."], answers: [3, 0, 2, 1, 4, 5] },
        { id: "o6", prompt: "I bambini", words: ["fanno", "bambini", "i", "i", "compiti."], answers: [1, 2, 0, 3, 4] },
        { id: "o7", prompt: "Io e Anna", words: ["colazione", "facciamo", "Io", "insieme.", "e", "Anna"], answers: [2, 4, 5, 1, 0, 3] },
        { id: "o8", prompt: "Che cosa fate?", words: ["fate", "cosa", "Che", "voi", "oggi?"], answers: [2, 1, 0, 3, 4] }
      ]
    },
    {
      id: "u011_s3_ordine2", unitNumber: 11, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "3.4 Unisci i soggetti con noi o loro / Объедини подлежащие с noi или loro",
      instructions: "Riordina gli elementi formando un soggetto composto e scegli la forma di fare adatta. / Составь сложное подлежащее и выбери подходящую форму fare.",
      items: [
        { id: "o1", prompt: "Io + mio fratello", words: ["colazione.", "facciamo", "Io", "mio", "e", "fratello", "la"], answers: [2, 4, 3, 5, 1, 6, 0] },
        { id: "o2", prompt: "Tu + la signora", words: ["spesa.", "fate", "Tu", "signora", "e", "la", "la"], answers: [2, 4, 5, 3, 1, 6, 0] },
        { id: "o3", prompt: "Marco + Stefano", words: ["passeggiata.", "fanno", "Marco", "e", "una", "Stefano"], answers: [2, 3, 5, 1, 4, 0] },
        { id: "o4", prompt: "Io + Maria", words: ["ginnastica.", "Io", "facciamo", "e", "Maria"], answers: [1, 3, 4, 2, 0] },
        { id: "o5", prompt: "Tu + i tuoi amici", words: ["fate", "voi", "doccia", "la", "e", "i", "tuoi", "amici"], answers: [1, 4, 5, 6, 7, 0, 3, 2] },
        { id: "o6", prompt: "La mamma + il papà", words: ["spesa.", "fanno", "mamma", "e", "papà", "La", "il", "la"], answers: [5, 2, 3, 6, 4, 1, 7, 0] }
      ]
    },
    {
      id: "u011_s3_cloze", unitNumber: 11, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "3.5 Completa con fare / Заполни пропуски формами fare",
      instructions: "Scrivi la forma corretta di fare al presente. / Напиши правильную форму fare в настоящем времени.",
      items: [
        { id: "g1", before: "Io ", after: " colazione alle sette.", answers: ["faccio"] },
        { id: "g2", before: "Tu ", after: " una passeggiata con il cane.", answers: ["fai"] },
        { id: "g3", before: "Maria ", after: " la spesa al supermercato.", answers: ["fa"] },
        { id: "g4", before: "Noi ", after: " i compiti dopo pranzo.", answers: ["facciamo"] },
        { id: "g5", before: "Voi ", after: " la doccia la sera.", answers: ["fate"] },
        { id: "g6", before: "I bambini ", after: " colazione in cucina.", answers: ["fanno"] },
        { id: "g7", before: "Io e Luca ", after: " una passeggiata.", answers: ["facciamo"] },
        { id: "g8", before: "Anna e Sara ", after: " ginnastica.", answers: ["fanno"] },
        { id: "g9", before: "Che cosa ", after: " tu dopo cena?", answers: ["fai"] },
        { id: "g10", before: "Ragazzi, ", after: " i compiti insieme?", answers: ["fate"] }
      ]
    },
    {
      id: "u011_s3_tabella", unitNumber: 11, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "3.6 Completa la tabella di fare / Заполни таблицу форм fare",
      instructions: "Scrivi la forma di fare che concorda con ciascun soggetto. / Напиши форму fare, согласованную с подлежащим.",
      columns: ["Soggetto", "Forma di fare"],
      items: [
        { id: "t1", prompt: "io", cells: ["io", { input: true }], answers: ["faccio"] },
        { id: "t2", prompt: "tu", cells: ["tu", { input: true }], answers: ["fai"] },
        { id: "t3", prompt: "lui / lei", cells: ["lui / lei", { input: true }], answers: ["fa"] },
        { id: "t4", prompt: "noi", cells: ["noi", { input: true }], answers: ["facciamo"] },
        { id: "t5", prompt: "voi", cells: ["voi", { input: true }], answers: ["fate"] },
        { id: "t6", prompt: "loro", cells: ["loro", { input: true }], answers: ["fanno"] }
      ]
    },
    {
      id: "u011_s3_intervista", unitNumber: 11, sessionNumber: 3, tier: "Produzione guidata",
      tierLabel: "Sessione 3 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "3.7 Intervista sulle attività quotidiane / Интервью о повседневных делах",
      instructions: "Scrivi quattro domande con fare e immagina le risposte di un compagno. Risposta aperta: revisione dell’insegnante. / Напиши четыре вопроса с fare и придумай ответы одноклассника. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "Che cosa fai?", prompt: "Includi fare colazione, fare la doccia, fare la spesa o fare una passeggiata. / Используй выражения fare colazione, fare la doccia, fare la spesa или fare una passeggiata." }]
    },
    {
      id: "u011_s3_produzione", unitNumber: 11, sessionNumber: 3, tier: "Produzione guidata",
      tierLabel: "Sessione 3 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "3.8 Racconta che cosa fate in famiglia / Расскажи, что вы делаете всей семьёй",
      instructions: "Scrivi 6 frasi usando almeno quattro forme diverse di fare. Usa io, noi, tu o voi e soggetti plurali. Risposta aperta: revisione dell’insegnante. / Напиши 6 предложений, используя не менее четырёх форм fare, включая разные подлежащие. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "Le nostre attività", prompt: "Puoi parlare di colazione, spesa, compiti e passeggiate. / Расскажи о завтраке, покупках, домашних заданиях и прогулках." }]
    },

    // Sessione 4 — stare + gerundio
    {
      id: "u011_s4_abbinamento", unitNumber: 11, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "4.1 Abbina il soggetto alla forma di stare / Соедини подлежащее с формой stare",
      instructions: "Abbina il soggetto alla forma di stare necessaria per il presente progressivo. / Соедини подлежащее с формой stare для presente progressivo.",
      options: [
        { value: "C", label: "C · sta" }, { value: "F", label: "F · stanno" }, { value: "A", label: "A · sto" },
        { value: "E", label: "E · stiamo" }, { value: "B", label: "B · stai" }, { value: "D", label: "D · state" }
      ],
      items: [
        { id: "m1", prompt: "Io", answers: ["A"] }, { id: "m2", prompt: "Tu", answers: ["B"] },
        { id: "m3", prompt: "Maria", answers: ["C"] }, { id: "m4", prompt: "Noi", answers: ["E"] },
        { id: "m5", prompt: "Voi", answers: ["D"] }, { id: "m6", prompt: "I bambini", answers: ["F"] }
      ]
    },
    {
      id: "u011_s4_mc", unitNumber: 11, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "4.2 Riconosci stare + gerundio / Определи форму stare + gerundio",
      instructions: "Scegli la forma corretta del presente progressivo. / Выбери правильную форму presente progressivo.",
      items: [
        { id: "q1", prompt: "Maria (preparare) la cena.", options: [{ value: "a", label: "a · sta preparando" }, { value: "b", label: "b · stanno preparando" }, { value: "c", label: "c · sto preparando" }], answers: ["a"] },
        { id: "q2", prompt: "I bambini (giocare) in salotto.", options: [{ value: "a", label: "a · sta giocando" }, { value: "b", label: "b · stanno giocando" }, { value: "c", label: "c · stiamo giocando" }], answers: ["b"] },
        { id: "q3", prompt: "Io (fare) la spesa.", options: [{ value: "a", label: "a · sto facendo" }, { value: "b", label: "b · sta facendo" }, { value: "c", label: "c · stai facendo" }], answers: ["a"] },
        { id: "q4", prompt: "Noi (mangiare) il pranzo.", options: [{ value: "a", label: "a · stanno mangiando" }, { value: "b", label: "b · stiamo mangiando" }, { value: "c", label: "c · state mangiando" }], answers: ["b"] },
        { id: "q5", prompt: "Tu (leggere) un libro.", options: [{ value: "a", label: "a · sto leggendo" }, { value: "b", label: "b · stai leggendo" }, { value: "c", label: "c · sta leggendo" }], answers: ["b"] },
        { id: "q6", prompt: "Voi (dormire) ancora.", options: [{ value: "a", label: "a · state dormendo" }, { value: "b", label: "b · stiamo dormendo" }, { value: "c", label: "c · stanno dormendo" }], answers: ["a"] },
        { id: "q7", prompt: "Il marito (guardare) la televisione.", options: [{ value: "a", label: "a · stanno guardando" }, { value: "b", label: "b · sta guardando" }, { value: "c", label: "c · stai guardando" }], answers: ["b"] },
        { id: "q8", prompt: "Maria e il cane (camminare) in giardino.", options: [{ value: "a", label: "a · stiamo camminando" }, { value: "b", label: "b · stanno camminando" }, { value: "c", label: "c · sta camminando" }], answers: ["b"] }
      ]
    },
    {
      id: "u011_s4_ordine", unitNumber: 11, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "4.3 Costruisci frasi al presente progressivo / Составь предложения в presente progressivo",
      instructions: "Riordina le parole: stare + gerundio. / Расставь слова: stare + gerundio.",
      items: [
        { id: "o1", prompt: "Maria prepara la cena", words: ["cena.", "sta", "Maria", "la", "preparando"], answers: [2, 1, 4, 3, 0] },
        { id: "o2", prompt: "I bambini giocano", words: ["salotto.", "stanno", "bambini", "giocando", "I", "in"], answers: [4, 2, 1, 3, 5, 0] },
        { id: "o3", prompt: "Io faccio la spesa", words: ["spesa.", "facendo", "sto", "la", "Io"], answers: [4, 2, 1, 3, 0] },
        { id: "o4", prompt: "Noi mangiamo", words: ["pranzo.", "mangiando", "stiamo", "Noi", "il"], answers: [3, 2, 1, 4, 0] },
        { id: "o5", prompt: "Tu leggi", words: ["libro.", "leggendo", "stai", "un", "Tu"], answers: [4, 2, 1, 3, 0] },
        { id: "o6", prompt: "Voi dormite", words: ["ancora.", "dormendo", "state", "Voi"], answers: [3, 2, 1, 0] },
        { id: "o7", prompt: "Il marito guarda la TV", words: ["televisione.", "guardando", "sta", "Il", "la", "marito"], answers: [3, 5, 2, 1, 4, 0] },
        { id: "o8", prompt: "Maria e il cane camminano", words: ["giardino.", "camminando", "stanno", "Maria", "e", "il", "cane", "in"], answers: [3, 4, 5, 6, 2, 1, 7, 0] }
      ]
    },
    {
      id: "u011_s4_ordine2", unitNumber: 11, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "4.4 Forma il gerundio / Образуй gerundio",
      instructions: "Riordina i segmenti per formare il gerundio corretto. / Расставь части, чтобы получить правильный gerundio.",
      items: [
        { id: "o1", prompt: "preparare", words: ["-ando", "prepar-"], answers: [1, 0] },
        { id: "o2", prompt: "leggere", words: ["-endo", "legg-"], answers: [1, 0] },
        { id: "o3", prompt: "dormire", words: ["-endo", "dorm-"], answers: [1, 0] },
        { id: "o4", prompt: "fare (forma irregolare)", words: ["-endo", "fac-", "fac-", "facendo"], answers: [3] },
        { id: "o5", prompt: "giocare", words: ["-ando", "gioc-"], answers: [1, 0] },
        { id: "o6", prompt: "pulire", words: ["-endo", "pul-"], answers: [1, 0] }
      ]
    },
    {
      id: "u011_s4_cloze", unitNumber: 11, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "4.5 Completa con stare + gerundio / Заполни формы stare + gerundio",
      instructions: "Scrivi la forma completa di stare + gerundio. / Напиши полную форму stare + gerundio.",
      items: [
        { id: "g1", before: "Io ", after: " la colazione. (preparare)", answers: ["sto preparando"] },
        { id: "g2", before: "Tu ", after: " un libro. (leggere)", answers: ["stai leggendo"] },
        { id: "g3", before: "Maria ", after: " la spesa. (fare)", answers: ["sta facendo"] },
        { id: "g4", before: "Noi ", after: " il pranzo. (mangiare)", answers: ["stiamo mangiando"] },
        { id: "g5", before: "Voi ", after: " ancora. (dormire)", answers: ["state dormendo"] },
        { id: "g6", before: "I bambini ", after: " in salotto. (giocare)", answers: ["stanno giocando"] },
        { id: "g7", before: "Il marito ", after: " la televisione. (guardare)", answers: ["sta guardando"] },
        { id: "g8", before: "Io e mia sorella ", after: " la casa. (pulire)", answers: ["stiamo pulendo"] },
        { id: "g9", before: "Le signore ", after: " una passeggiata. (fare)", answers: ["stanno facendo"] },
        { id: "g10", before: "Che cosa ", after: " tu? (fare)", answers: ["stai facendo"] }
      ]
    },
    {
      id: "u011_s4_tabella", unitNumber: 11, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "4.6 Completa le forme progressive / Заполни формы длительного действия",
      instructions: "Completa la forma stare + gerundio per ogni soggetto e verbo. / Заполни форму stare + gerundio для каждого подлежащего и глагола.",
      columns: ["Soggetto e verbo", "Forma completa"],
      items: [
        { id: "t1", prompt: "io · parlare", cells: ["io · parlare", { input: true }], answers: ["sto parlando"] },
        { id: "t2", prompt: "tu · scrivere", cells: ["tu · scrivere", { input: true }], answers: ["stai scrivendo"] },
        { id: "t3", prompt: "lei · fare", cells: ["lei · fare", { input: true }], answers: ["sta facendo"] },
        { id: "t4", prompt: "noi · leggere", cells: ["noi · leggere", { input: true }], answers: ["stiamo leggendo"] },
        { id: "t5", prompt: "voi · dormire", cells: ["voi · dormire", { input: true }], answers: ["state dormendo"] },
        { id: "t6", prompt: "loro · preparare", cells: ["loro · preparare", { input: true }], answers: ["stanno preparando"] },
        { id: "t7", prompt: "Maria e Luca · pulire", cells: ["Maria e Luca · pulire", { input: true }], answers: ["stanno pulendo"] },
        { id: "t8", prompt: "io e Marco · fare", cells: ["io e Marco · fare", { input: true }], answers: ["stiamo facendo"] }
      ]
    },
    {
      id: "u011_s4_produzione", unitNumber: 11, sessionNumber: 4, tier: "Produzione guidata",
      tierLabel: "Sessione 4 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "4.7 Che cosa sta succedendo? / Что сейчас происходит?",
      instructions: "Descrivi in 5–6 frasi che cosa stanno facendo le persone in una casa. Usa stare + gerundio con almeno tre soggetti diversi. Risposta aperta: revisione dell’insegnante. / Опиши в 5–6 предложениях, чем занимаются люди дома. Используй stare + gerundio как минимум с тремя подлежащими. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "Una scena in casa", prompt: "Puoi descrivere la cucina, il salotto e il giardino. / Опиши кухню, гостиную и сад." }]
    },
    {
      id: "u011_s4_dialogo", unitNumber: 11, sessionNumber: 4, tier: "Produzione guidata",
      tierLabel: "Sessione 4 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "4.8 Telefonata in un momento impegnato / Звонок во время домашних дел",
      instructions: "Scrivi un dialogo di 6–8 battute. Una persona telefona e l’altra spiega che cosa sta facendo. Risposta aperta: revisione dell’insegnante. / Напиши диалог из 6–8 реплик: один человек звонит, а другой рассказывает, чем он сейчас занят. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "Pronto?", prompt: "Usa almeno quattro forme di stare + gerundio. / Используй не менее четырёх форм stare + gerundio." }]
    },

    // Sessione 5 — contrasto e ripasso
    {
      id: "u011_s5_mc", unitNumber: 11, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "5.1 Presente abituale o progressivo? / Обычное или длительное действие?",
      instructions: "Scegli la forma coerente con l’indicazione di tempo. / Выбери форму, подходящую к указанию времени.",
      items: [
        { id: "q1", prompt: "Ogni mattina Maria ___ la colazione.", options: [{ value: "a", label: "a · prepara" }, { value: "b", label: "b · sta preparando" }], answers: ["a"] },
        { id: "q2", prompt: "Adesso Maria ___ la cena.", options: [{ value: "a", label: "a · prepara" }, { value: "b", label: "b · sta preparando" }], answers: ["b"] },
        { id: "q3", prompt: "Di solito i bambini ___ in salotto.", options: [{ value: "a", label: "a · giocano" }, { value: "b", label: "b · stanno giocando" }], answers: ["a"] },
        { id: "q4", prompt: "In questo momento i bambini ___ in salotto.", options: [{ value: "a", label: "a · giocano" }, { value: "b", label: "b · stanno giocando" }], answers: ["b"] },
        { id: "q5", prompt: "Tutte le sere io ___ i piatti.", options: [{ value: "a", label: "a · lavo" }, { value: "b", label: "b · sto lavando" }], answers: ["a"] },
        { id: "q6", prompt: "Ora noi ___ il pranzo.", options: [{ value: "a", label: "a · mangiamo" }, { value: "b", label: "b · stiamo mangiando" }], answers: ["b"] },
        { id: "q7", prompt: "Maria spesso ___ la spesa al supermercato.", options: [{ value: "a", label: "a · fa" }, { value: "b", label: "b · sta facendo" }], answers: ["a"] },
        { id: "q8", prompt: "Guarda! Maria ___ la spesa.", options: [{ value: "a", label: "a · fa" }, { value: "b", label: "b · sta facendo" }], answers: ["b"] }
      ]
    },
    {
      id: "u011_s5_abbinamento", unitNumber: 11, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "5.2 Abbina l’espressione al tipo di azione / Соедини выражение с типом действия",
      instructions: "Abbina ogni indicazione al presente abituale o all’azione in corso. / Соедини указание с обычным действием или действием в данный момент.",
      options: [
        { value: "B", label: "B · Azione in corso: stare + gerundio" },
        { value: "A", label: "A · Abitudine o routine: presente semplice" }
      ],
      items: [
        { id: "m1", prompt: "Di solito", answers: ["A"] }, { id: "m2", prompt: "In questo momento", answers: ["B"] },
        { id: "m3", prompt: "Ogni mattina", answers: ["A"] }, { id: "m4", prompt: "Adesso", answers: ["B"] },
        { id: "m5", prompt: "Tutte le sere", answers: ["A"] }, { id: "m6", prompt: "Guarda!", answers: ["B"] },
        { id: "m7", prompt: "Spesso", answers: ["A"] }, { id: "m8", prompt: "Proprio ora", answers: ["B"] }
      ]
    },
    {
      id: "u011_s5_ordine", unitNumber: 11, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "5.3 Ricostruisci le frasi abituali e progressive / Составь обычные и длительные предложения",
      instructions: "Riordina le parole seguendo l’indicazione di tempo. / Расставь слова с учётом указания времени.",
      items: [
        { id: "o1", prompt: "Routine: ogni mattina", words: ["colazione.", "prepara", "Maria", "Ogni", "mattina", "la"], answers: [3, 4, 2, 1, 5, 0] },
        { id: "o2", prompt: "Adesso", words: ["cena.", "sta", "Maria", "preparando", "la", "Adesso"], answers: [5, 2, 1, 3, 4, 0] },
        { id: "o3", prompt: "Di solito", words: ["salotto.", "giocano", "bambini", "in", "Di", "solito", "i"], answers: [4, 5, 6, 2, 1, 3, 0] },
        { id: "o4", prompt: "In questo momento", words: ["stanno", "giocando", "momento", "I", "bambini", "in", "questo", "salotto."], answers: [5, 6, 2, 3, 4, 0, 1, 7] },
        { id: "o5", prompt: "Tutte le sere", words: ["piatti.", "lavo", "sere", "i", "Tutte", "le", "io"], answers: [4, 5, 2, 6, 1, 3, 0] },
        { id: "o6", prompt: "Ora", words: ["pranzo.", "stiamo", "mangiando", "Ora", "il", "noi"], answers: [3, 5, 1, 2, 4, 0] },
        { id: "o7", prompt: "Spesso", words: ["spesa.", "fa", "spesso", "Maria", "la", "Spesso"], answers: [5, 3, 2, 1, 4, 0] },
        { id: "o8", prompt: "Guarda!", words: ["facendo", "Guarda!", "Maria", "sta", "la", "spesa."], answers: [1, 2, 3, 0, 4, 5] }
      ]
    },
    {
      id: "u011_s5_trasformazione", unitNumber: 11, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "5.4 Costruisci la forma indicata / Составь форму по указанию",
      instructions: "Riordina i segmenti per scrivere la forma verbale richiesta. / Расставь части, чтобы записать нужную глагольную форму.",
      items: [
        { id: "o1", prompt: "presente semplice · io / fare", words: ["faccio", "io"], answers: [1, 0] },
        { id: "o2", prompt: "presente semplice · loro / dormire", words: ["dormono", "loro"], answers: [1, 0] },
        { id: "o3", prompt: "presente progressivo · tu / leggere", words: ["leggendo", "stai", "tu"], answers: [2, 1, 0] },
        { id: "o4", prompt: "presente progressivo · noi / mangiare", words: ["mangiando", "stiamo", "noi"], answers: [2, 1, 0] },
        { id: "o5", prompt: "presente semplice · Maria / pulire", words: ["pulisce", "Maria"], answers: [1, 0] },
        { id: "o6", prompt: "presente progressivo · i bambini / giocare", words: ["giocando", "stanno", "i", "bambini"], answers: [2, 3, 1, 0] }
      ]
    },
    {
      id: "u011_s5_cloze", unitNumber: 11, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · Completamento e trasformazione (Livello intermedio)", type: "gap_fill",
      title: "5.5 Scegli il presente corretto / Выбери правильное настоящее время",
      instructions: "Completa con il presente semplice o progressivo secondo il contesto. / Выбери presente semplice или progressivo по контексту.",
      items: [
        { id: "g1", before: "Ogni giorno Maria ", after: " la colazione. (preparare)", answers: ["prepara"] },
        { id: "g2", before: "Adesso Maria ", after: " il pranzo. (preparare)", answers: ["sta preparando"] },
        { id: "g3", before: "Di solito i bambini ", after: " in salotto. (giocare)", answers: ["giocano"] },
        { id: "g4", before: "In questo momento i bambini ", after: " in salotto. (giocare)", answers: ["stanno giocando"] },
        { id: "g5", before: "La sera io ", after: " i piatti. (lavare)", answers: ["lavo"] },
        { id: "g6", before: "Ora noi ", after: " insieme. (mangiare)", answers: ["stiamo mangiando"] },
        { id: "g7", before: "Maria spesso ", after: " la spesa al supermercato. (fare)", answers: ["fa"] },
        { id: "g8", before: "Guarda! Maria ", after: " la spesa. (fare)", answers: ["sta facendo"] },
        { id: "g9", before: "Ogni mattina mio marito ", after: " la televisione. (guardare)", answers: ["guarda"] },
        { id: "g10", before: "Proprio ora mio marito ", after: " la televisione. (guardare)", answers: ["sta guardando"] }
      ]
    },
    {
      id: "u011_s5_tabella", unitNumber: 11, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "5.6 Completa il contrasto / Заполни таблицу сравнения",
      instructions: "Scrivi la forma verbale completa rispettando la frequenza o l’azione in corso. / Запиши полную глагольную форму с учётом привычки или действия сейчас.",
      columns: ["Indicazione", "Soggetto e verbo", "Forma"],
      items: [
        { id: "t1", prompt: "Ogni mattina", cells: ["Ogni mattina", "io · fare colazione", { input: true }], answers: ["faccio colazione"] },
        { id: "t2", prompt: "Adesso", cells: ["Adesso", "io · fare colazione", { input: true }], answers: ["sto facendo colazione"] },
        { id: "t3", prompt: "Di solito", cells: ["Di solito", "Maria · preparare la cena", { input: true }], answers: ["prepara la cena"] },
        { id: "t4", prompt: "In questo momento", cells: ["In questo momento", "Maria · preparare la cena", { input: true }], answers: ["sta preparando la cena"] },
        { id: "t5", prompt: "Tutte le sere", cells: ["Tutte le sere", "i bambini · dormire", { input: true }], answers: ["dormono"] },
        { id: "t6", prompt: "Ora", cells: ["Ora", "i bambini · dormire", { input: true }], answers: ["stanno dormendo"] },
        { id: "t7", prompt: "Spesso", cells: ["Spesso", "noi · guardare la televisione", { input: true }], answers: ["guardiamo la televisione"] },
        { id: "t8", prompt: "Proprio adesso", cells: ["Proprio adesso", "noi · guardare la televisione", { input: true }], answers: ["stiamo guardando la televisione"] }
      ]
    },
    {
      id: "u011_s5_dialogo", unitNumber: 11, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "5.7 Dialogo: abitudini e attività di adesso / Диалог: привычки и занятия сейчас",
      instructions: "Scrivi un dialogo di 8 battute tra due persone. Inserisci due abitudini e due azioni in corso. Risposta aperta: revisione dell’insegnante. / Напиши диалог из 8 реплик: включи две привычки и два действия, происходящие сейчас. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "Che cosa fai di solito?", prompt: "Usa espressioni come di solito, ogni giorno, adesso e in questo momento. / Используй выражения di solito, ogni giorno, adesso и in questo momento." }]
    },
    {
      id: "u011_s5_composizione", unitNumber: 11, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · Produzione e interazione guidata (revisione docente)", type: "open_response",
      title: "5.8 Una giornata, due momenti / Один день, два момента",
      instructions: "Scrivi 8–10 frasi: descrivi prima la tua routine e poi che cosa stai facendo adesso. Usa almeno tre forme di fare e tre forme di stare + gerundio. Risposta aperta: revisione dell’insegnante. / Напиши 8–10 предложений: сначала опиши распорядок дня, затем расскажи, чем занимаешься сейчас. Используй не менее трёх форм fare и трёх форм stare + gerundio. Ответ проверяет преподаватель.",
      items: [{ id: "p1", title: "La mia routine e adesso", prompt: "Organizza il testo con orari e luoghi. / Структурируй текст с указанием времени и мест." }]
    }
  ]
};
