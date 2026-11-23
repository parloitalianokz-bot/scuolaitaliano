// Catalogo esercizi — Unità 53: Il viale del tramonto (IT / RU)
window.HOMEWORK_EXERCISES_CATALOG = window.HOMEWORK_EXERCISES_CATALOG || {};
window.HOMEWORK_EXERCISES_CATALOG["53"] = {
  unitNumber: 53,
  unitSlug: "u_053",
  unitTitle: "Unità 53 · Il viale del tramonto / Бульвар заката",
  level: "A2/B1",
  description: "Quaranta attività in cinque sessioni: almeno due esercizi per ciascuna delle quattro tipologie (riconoscimento, manipolazione, completamento e produzione). / Сорок упражнений в пяти занятиях: не менее двух заданий каждого из четырёх типов.",
  defaultExerciseIds: ["u053_s1_matching", "u053_s1_comprensione", "u053_s1_tabella", "u053_s1_intruso"],
  exercises: [
    // Sessione 1 — racconto e lessico
    {
      id: "u053_s1_matching", unitNumber: 53, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "1.1 Abbina i negozi agli acquisti / Соедини магазины и покупки",
      instructions: "Abbina ogni tappa al negozio corretto. / Соедини каждый эпизод с подходящим магазином.",
      options: [
        { value: "D", label: "D · Concessionaria" },
        { value: "A", label: "A · Pellicceria" },
        { value: "F", label: "F · Libreria" },
        { value: "C", label: "C · Negozio di abbigliamento" },
        { value: "I", label: "I · Negozio di elettronica" },
        { value: "B", label: "B · Gioielleria" },
        { value: "H", label: "H · Profumeria" },
        { value: "E", label: "E · Fioraio" },
        { value: "G", label: "G · Panetteria" }
      ],
      items: [
        { id: "fur", prompt: "La contessa prova uno zibellino e un visone", answers: ["A"] },
        { id: "rings", prompt: "La signora confronta un anello con diamante e uno con rubino", answers: ["B"] },
        { id: "clothes", prompt: "La commessa parla di pantaloni e jeans", answers: ["C"] },
        { id: "cars", prompt: "Germano e la contessa guardano una Lamborghini e un’Alfa Romeo", answers: ["D"] },
        { id: "flowers", prompt: "La contessa sceglie un mazzo di rose per un’amica", answers: ["E"] },
        { id: "books", prompt: "Germano cerca una guida della città e un romanzo", answers: ["F"] },
        { id: "bread", prompt: "Prima di tornare in albergo, comprano pane e biscotti", answers: ["G"] },
        { id: "perfume", prompt: "La contessa prova un profumo floreale", answers: ["H"] },
        { id: "phone", prompt: "Germano cerca un caricabatterie e delle cuffie", answers: ["I"] }
      ]
    },
    {
      id: "u053_s1_comprensione", unitNumber: 53, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "1.2 Comprensione del racconto / Понимание рассказа",
      instructions: "Scegli la risposta corretta secondo il racconto. / Выбери правильный ответ по рассказу.",
      items: [
        { id: "q1", prompt: "Chi accompagna la contessa durante lo shopping?", options: [{ value: "a", label: "a · Il gioielliere" }, { value: "b", label: "b · Germano, il suo autista" }, { value: "c", label: "c · La commessa" }], answers: ["b"] },
        { id: "q2", prompt: "Quale pelliccia costa di più?", options: [{ value: "a", label: "a · Il visone" }, { value: "b", label: "b · Lo zibellino" }, { value: "c", label: "c · Costano uguale" }], answers: ["b"] },
        { id: "q3", prompt: "Che cosa compra la contessa?", options: [{ value: "a", label: "a · Un anello" }, { value: "b", label: "b · Un paio di jeans" }, { value: "c", label: "c · Non compra niente" }], answers: ["c"] },
        { id: "q4", prompt: "Perché la contessa confronta due pellicce?", options: [{ value: "a", label: "a · Vuole scegliere quella più adatta" }, { value: "b", label: "b · Deve venderle" }, { value: "c", label: "c · Cerca un regalo per Germano" }], answers: ["a"] },
        { id: "q5", prompt: "Che cosa potrebbe fare Germano mentre la contessa guarda le vetrine?", options: [{ value: "a", label: "a · Aspettarla vicino all’auto" }, { value: "b", label: "b · Chiudere i negozi" }, { value: "c", label: "c · Comprare un autobus" }], answers: ["a"] },
        { id: "q6", prompt: "Secondo te, perché alla fine la contessa non compra niente?", options: [{ value: "a", label: "a · È indecisa e vuole pensarci" }, { value: "b", label: "b · I negozi sono tutti chiusi" }, { value: "c", label: "c · Ha già comprato tutto" }], answers: ["a"] },
        { id: "q7", prompt: "Quale negozio potrebbe visitare dopo la concessionaria?", options: [{ value: "a", label: "a · Una libreria" }, { value: "b", label: "b · Un aeroporto" }, { value: "c", label: "c · Una stazione" }], answers: ["a"] },
        { id: "q8", prompt: "Che cosa potrebbe fare la contessa se cominciasse a piovere?", options: [{ value: "a", label: "a · Entrare in un caffè" }, { value: "b", label: "b · Lasciare la città a piedi" }, { value: "c", label: "c · Comprare una pelliccia per l’autobus" }], answers: ["a"] }
      ]
    },
    {
      id: "u053_s1_tabella", unitNumber: 53, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · 1 Riconoscimento e abbinamento (Livello base)", type: "table_fill",
      title: "1.3 Completa la tabella delle tappe / Заполни таблицу эпизодов",
      instructions: "Scrivi il nome del negozio mancante. / Напиши пропущенное название магазина.",
      columns: ["Tappa", "Oggetto o scelta", "Negozio"],
      items: [
        { id: "t1", prompt: "Prima tappa", cells: ["Pellicce", "Zibellino o visone", { input: true }], answers: ["pellicceria"] },
        { id: "t2", prompt: "Seconda tappa", cells: ["Anelli", "Diamante o rubino", { input: true }], answers: ["gioielleria"] },
        { id: "t3", prompt: "Terza tappa", cells: ["Pantaloni e jeans", "Pantaloni di pelle o jeans strappati", { input: true }], answers: ["negozio di abbigliamento", "negozio d'abbigliamento"] },
        { id: "t4", prompt: "Quarta tappa", cells: ["Automobili", "Lamborghini o Alfa Romeo", { input: true }], answers: ["concessionaria", "concessionaria di auto"] },
        { id: "t5", prompt: "Quinta tappa", cells: ["Fiori", "Rose e tulipani", { input: true }], answers: ["fioraio", "negozio di fiori"] },
        { id: "t6", prompt: "Sesta tappa", cells: ["Libri", "Guida di Firenze e romanzo", { input: true }], answers: ["libreria"] },
        { id: "t7", prompt: "Settima tappa", cells: ["Pane e dolci", "Pane e biscotti", { input: true }], answers: ["panetteria", "forno"] },
        { id: "t8", prompt: "Ottava tappa", cells: ["Profumi", "Profumo floreale", { input: true }], answers: ["profumeria"] },
        { id: "t9", prompt: "Nona tappa", cells: ["Elettronica", "Cuffie e caricabatterie", { input: true }], answers: ["negozio di elettronica"] },
        { id: "t10", prompt: "Decima tappa", cells: ["Occhiali", "Occhiali da sole", { input: true }], answers: ["ottica", "negozio di ottica"] }
      ]
    },
    {
      id: "u053_s1_intruso", unitNumber: 53, sessionNumber: 1, tier: "Base",
      tierLabel: "Sessione 1 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "1.4 Caccia all’intruso / Найди лишнее слово",
      instructions: "Scegli l’elemento che non appartiene alla categoria. / Выбери слово, которое не относится к категории.",
      items: [
        { id: "odd1", prompt: "Gioielli", options: [{ value: "a", label: "a · diamante" }, { value: "b", label: "b · rubino" }, { value: "c", label: "c · visone" }], answers: ["c"] },
        { id: "odd2", prompt: "Abbigliamento", options: [{ value: "a", label: "a · pantaloni" }, { value: "b", label: "b · jeans" }, { value: "c", label: "c · concessionaria" }], answers: ["c"] },
        { id: "odd3", prompt: "Automobili", options: [{ value: "a", label: "a · Lamborghini" }, { value: "b", label: "b · Alfa Romeo" }, { value: "c", label: "c · visone" }], answers: ["c"] },
        { id: "odd4", prompt: "Frutta", options: [{ value: "a", label: "a · mela" }, { value: "b", label: "b · pera" }, { value: "c", label: "c · sciarpa" }], answers: ["c"] },
        { id: "odd5", prompt: "Calzature", options: [{ value: "a", label: "a · stivali" }, { value: "b", label: "b · sandali" }, { value: "c", label: "c · rubino" }], answers: ["c"] },
        { id: "odd6", prompt: "Gioielli", options: [{ value: "a", label: "a · collana" }, { value: "b", label: "b · bracciale" }, { value: "c", label: "c · concessionaria" }], answers: ["c"] },
        { id: "odd7", prompt: "Abbigliamento", options: [{ value: "a", label: "a · cappotto" }, { value: "b", label: "b · camicia" }, { value: "c", label: "c · automobile" }], answers: ["c"] },
        { id: "odd8", prompt: "Elettrodomestici", options: [{ value: "a", label: "a · frullatore" }, { value: "b", label: "b · tostapane" }, { value: "c", label: "c · profumo" }], answers: ["c"] },
        { id: "odd9", prompt: "Pellicce", options: [{ value: "a", label: "a · zibellino" }, { value: "b", label: "b · visone" }, { value: "c", label: "c · libro" }], answers: ["c"] },
        { id: "odd10", prompt: "Cartoleria", options: [{ value: "a", label: "a · quaderno" }, { value: "b", label: "b · penna" }, { value: "c", label: "c · anello" }], answers: ["c"] }
      ]
    },
    {
      id: "u053_s1_ordine", unitNumber: 53, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "1.5 Riordina le tappe / Расставь эпизоды по порядку",
      instructions: "Metti in ordine logico le parole per ricostruire il percorso della contessa. / Расставь слова по порядку, чтобы восстановить маршрут графини.",
      items: [
        { id: "o1", prompt: "Prima visita", words: ["in", "La", "entra", "pellicceria.", "una", "contessa"], answers: [1, 5, 2, 0, 4, 3] },
        { id: "o2", prompt: "Ultima vetrina", words: ["una", "davanti", "passano", "concessionaria.", "a", "I", "due"], answers: [5, 6, 2, 1, 4, 0, 3] },
        { id: "o3", prompt: "Una scelta profumata", words: ["un", "La", "sceglie", "profumo.", "contessa"], answers: [1, 4, 2, 0, 3] },
        { id: "o4", prompt: "Una sosta golosa", words: ["in", "Germano", "compra", "panetteria.", "una", "il", "pane"], answers: [1, 2, 5, 6, 0, 4, 3] },
        { id: "o5", prompt: "Un regalo floreale", words: ["fioraio.", "dal", "delle", "rose", "La", "compra", "contessa"], answers: [4, 6, 5, 2, 3, 1, 0] },
        { id: "o6", prompt: "Una guida della città", words: ["in", "libreria.", "cerca", "Germano", "una", "guida"], answers: [3, 2, 4, 5, 0, 1] },
        { id: "o7", prompt: "Gli occhiali da sole", words: ["un", "compra", "La", "paio", "ottica.", "in", "contessa", "di", "occhiali"], answers: [2, 6, 1, 0, 3, 7, 8, 5, 4] },
        { id: "o8", prompt: "La tappa in profumeria", words: ["prova", "profumeria.", "un", "La", "in", "contessa", "profumo"], answers: [3, 5, 0, 2, 6, 4, 1] }
      ]
    },
    {
      id: "u053_s1_cloze", unitNumber: 53, sessionNumber: 1, tier: "Elementare",
      tierLabel: "Sessione 1 · 2 Manipolazione e riordino (Livello elementare)", type: "gap_fill",
      title: "1.6 Completa il lessico dei negozi / Заполни названия магазинов",
      instructions: "Completa con il nome del negozio adatto. / Вставь подходящее название магазина.",
      items: [
        { id: "g1", before: "Per provare uno zibellino si entra in una ", after: ".", answers: ["pellicceria"] },
        { id: "g2", before: "Per scegliere un anello si va in ", after: ".", answers: ["gioielleria"] },
        { id: "g3", before: "Per vedere una Lamborghini si visita una ", after: ".", answers: ["concessionaria"] },
        { id: "g4", before: "Per comprare rose e tulipani si va dal ", after: ".", answers: ["fioraio"] },
        { id: "g5", before: "Per scegliere un romanzo si entra in una ", after: ".", answers: ["libreria"] },
        { id: "g6", before: "Per comprare pane fresco si va in ", after: ".", answers: ["panetteria", "un panetteria"] },
        { id: "g7", before: "Per provare un nuovo profumo si va in ", after: ".", answers: ["profumeria"] },
        { id: "g8", before: "Per acquistare un computer si visita un negozio di ", after: ".", answers: ["informatica", "elettronica"] },
        { id: "g9", before: "Per comprare occhiali da vista si va dall’", after: ".", answers: ["ottico"] },
        { id: "g10", before: "Per acquistare una torta si entra in una ", after: ".", answers: ["pasticceria"] }
      ]
    },
    {
      id: "u053_s1_riassunto", unitNumber: 53, sessionNumber: 1, tier: "Intermedio",
      tierLabel: "Sessione 1 · 3 Completamento e trasformazione (Livello intermedio)", type: "open_response",
      title: "1.7 Rispondi con frasi complete / Ответь полными предложениями",
      instructions: "Rispondi senza usare le opzioni. / Ответь самостоятельно, без вариантов ответа.",
      items: [
        { id: "r1", title: "Accompagnatore", prompt: "Chi accompagna la contessa? Che cosa fa Germano durante le visite?" },
        { id: "r2", title: "Scelte", prompt: "Quali due oggetti o prodotti confronta la contessa in due negozi diversi?" },
        { id: "r3", title: "Una nuova tappa", prompt: "Quale negozio visiteresti tu durante una giornata di shopping? Che cosa compreresti?" },
        { id: "r4", title: "Una supposizione", prompt: "Secondo te, che cosa avrebbe potuto comprare la contessa se avesse trovato un’offerta speciale?" },
        { id: "r5", title: "La tua esperienza", prompt: "Qual è l’ultimo negozio che hai visitato? Che cosa hai comprato o guardato?" }
      ]
    },
    {
      id: "u053_s1_produzione", unitNumber: 53, sessionNumber: 1, tier: "Produzione guidata",
      tierLabel: "Sessione 1 · 4 Produzione e interazione guidata", type: "open_response",
      title: "1.8 Racconta una giornata di shopping / Расскажи о походе по магазинам",
      instructions: "Scrivi 5–6 frasi su una giornata di shopping ispirata al racconto. Nomina almeno tre negozi e due prodotti. / Напиши 5–6 предложений о походе по магазинам по мотивам рассказа.",
      items: [{ id: "p1", title: "La mia giornata", prompt: "Puoi inventare un personaggio e aggiungere una tappa finale." }]
    },

    // Sessione 2 — comparativi
    {
      id: "u053_s2_comparativi_mc", unitNumber: 53, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "2.1 Riconosci il comparativo / Определи сравнительную конструкцию",
      instructions: "Scegli la forma corretta. / Выбери правильную форму.",
      items: [
        { id: "c1", prompt: "Lo zibellino è più caro ___ visone.", options: [{ value: "a", label: "a · del" }, { value: "b", label: "b · che" }, { value: "c", label: "c · al" }], answers: ["a"] },
        { id: "c2", prompt: "È più facile provare ___ scegliere.", options: [{ value: "a", label: "a · del" }, { value: "b", label: "b · che" }, { value: "c", label: "c · al" }], answers: ["b"] },
        { id: "c3", prompt: "Il rubino è più grande ___ diamante.", options: [{ value: "a", label: "a · del" }, { value: "b", label: "b · che" }, { value: "c", label: "c · allo" }], answers: ["a"] },
        { id: "c4", prompt: "Questo cappotto è meno costoso ___ quello di lana.", options: [{ value: "a", label: "a · di" }, { value: "b", label: "b · che" }, { value: "c", label: "c · allo" }], answers: ["a"] },
        { id: "c5", prompt: "È più comodo pagare con la carta ___ con i contanti.", options: [{ value: "a", label: "a · del" }, { value: "b", label: "b · che" }, { value: "c", label: "c · al" }], answers: ["b"] },
        { id: "c6", prompt: "La borsa rossa è più elegante ___ quella nera.", options: [{ value: "a", label: "a · di" }, { value: "b", label: "b · che" }, { value: "c", label: "c · alla" }], answers: ["a"] },
        { id: "c7", prompt: "È più facile trovare un regalo ___ sceglierlo.", options: [{ value: "a", label: "a · del" }, { value: "b", label: "b · che" }, { value: "c", label: "c · al" }], answers: ["b"] },
        { id: "c8", prompt: "Le scarpe di pelle sono più resistenti ___ quelle di tela.", options: [{ value: "a", label: "a · di" }, { value: "b", label: "b · che" }, { value: "c", label: "c · agli" }], answers: ["a"] },
        { id: "c9", prompt: "È più divertente fare shopping ___ restare a casa.", options: [{ value: "a", label: "a · del" }, { value: "b", label: "b · che" }, { value: "c", label: "c · allo" }], answers: ["b"] },
        { id: "c10", prompt: "Questo negozio è più lontano ___ supermercato.", options: [{ value: "a", label: "a · del" }, { value: "b", label: "b · che" }, { value: "c", label: "c · allo" }], answers: ["a"] }
      ]
    },
    {
      id: "u053_s2_abbinamento", unitNumber: 53, sessionNumber: 2, tier: "Base",
      tierLabel: "Sessione 2 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "2.2 Abbina le frasi ai significati / Соедини предложения со значениями",
      instructions: "Abbina ogni frase alla relazione espressa. / Соедини предложение с выражаемым сравнением.",
      options: [
        { value: "E", label: "E · Durano più a lungo" },
        { value: "C", label: "C · È più semplice" },
        { value: "A", label: "A · Costa di più" },
        { value: "G", label: "G · È più conveniente" },
        { value: "D", label: "D · È più raffinata" },
        { value: "F", label: "F · È più economico" },
        { value: "B", label: "B · Pesa meno" }
      ],
      items: [
        { id: "m1", prompt: "Lo zibellino è più caro del visone", answers: ["A"] },
        { id: "m2", prompt: "Il visone è meno pesante dello zibellino", answers: ["B"] },
        { id: "m3", prompt: "È più semplice provare che scegliere", answers: ["C"] },
        { id: "m4", prompt: "La borsa rossa è più raffinata della nera", answers: ["D"] },
        { id: "m5", prompt: "Le scarpe di pelle durano più a lungo di quelle di tela", answers: ["E"] },
        { id: "m6", prompt: "Il cappotto costa meno della giacca", answers: ["F"] },
        { id: "m7", prompt: "È più conveniente pagare con la carta che con i contanti", answers: ["G"] }
      ]
    },
    {
      id: "u053_s2_ricomponi", unitNumber: 53, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "2.3 Ricostruisci le frasi comparative / Составь сравнительные предложения",
      instructions: "Riordina le parole per formare frasi corrette. / Расставь слова, чтобы составить правильные предложения.",
      items: [
        { id: "o1", prompt: "Confronta il peso", words: ["del", "è", "visone.", "Lo", "più", "leggero", "zibellino"], answers: [3, 6, 1, 4, 5, 0, 2] },
        { id: "o2", prompt: "Confronta la grandezza", words: ["diamante.", "del", "grande", "più", "Il", "è", "rubino"], answers: [4, 6, 5, 3, 2, 1, 0] },
        { id: "o3", prompt: "Confronta la facilità", words: ["che", "è", "scegliere.", "provare", "più", "facile"], answers: [4, 5, 1, 3, 0, 2] },
        { id: "o4", prompt: "Confronta due borse", words: ["della", "borsa", "La", "più", "è", "nera.", "rossa", "elegante"], answers: [2, 6, 4, 3, 7, 0, 1, 5] },
        { id: "o5", prompt: "Confronta le scarpe", words: ["di", "quelle", "pelle", "sono", "Le", "più", "resistenti", "tela.", "scarpe", "di"], answers: [4, 8, 0, 2, 3, 5, 6, 9, 1, 7] },
        { id: "o6", prompt: "Confronta il prezzo", words: ["meno", "La", "giacca", "costa", "del", "cappotto."], answers: [1, 2, 3, 0, 4, 5] },
        { id: "o7", prompt: "Confronta due attività", words: ["che", "fare", "È", "più", "a", "casa.", "divertente", "shopping", "restare"], answers: [2, 3, 6, 1, 7, 0, 8, 4, 5] },
        { id: "o8", prompt: "Confronta il pagamento", words: ["contanti.", "carta", "con", "più", "pagare", "la", "È", "comodo", "che", "con", "i"], answers: [6, 3, 7, 4, 5, 1, 2, 8, 9, 10, 0] },
        { id: "o9", prompt: "Confronta due cappotti", words: ["sintetico.", "di", "Il", "più", "cappotto", "costoso", "è", "quello", "di", "lana"], answers: [2, 4, 9, 6, 3, 5, 1, 7, 8, 0] },
        { id: "o10", prompt: "Confronta la distanza", words: ["supermercato.", "lontano", "è", "negozio", "più", "del", "Il"], answers: [6, 3, 2, 4, 1, 5, 0] }
      ]
    },
    {
      id: "u053_s2_cloze", unitNumber: 53, sessionNumber: 2, tier: "Elementare",
      tierLabel: "Sessione 2 · 2 Manipolazione e riordino (Livello elementare)", type: "gap_fill",
      title: "2.4 Completa con più o meno / Заполни più или meno",
      instructions: "Inserisci più o meno in base al significato. / Вставь più или meno по смыслу.",
      items: [
        { id: "g1", before: "Lo zibellino è ", after: " caro del visone.", answers: ["più"] },
        { id: "g2", before: "Il visone è ", after: " caro dello zibellino.", answers: ["meno"] },
        { id: "g3", before: "I jeans sono ", after: " formali dei pantaloni eleganti.", answers: ["meno"] },
        { id: "g4", before: "La Lamborghini è ", after: " prestigiosa dell’Alfa Romeo.", answers: ["più"] },
        { id: "g5", before: "Questo cappotto è ", after: " costoso della giacca.", answers: ["meno"] },
        { id: "g6", before: "La borsa di pelle è ", after: " resistente di quella di tela.", answers: ["più"] },
        { id: "g7", before: "È ", after: " comodo comprare online che in un negozio affollato.", answers: ["più"] },
        { id: "g8", before: "Le scarpe eleganti sono ", after: " adatte alla spiaggia dei sandali.", answers: ["meno"] }
      ]
    },
    {
      id: "u053_s2_tabella", unitNumber: 53, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · 3 Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "2.5 Trasforma i dati in confronti / Преобразуй данные в сравнения",
      instructions: "Completa la frase comparativa usando le informazioni della tabella. / Составь сравнительное предложение по данным таблицы.",
      columns: ["Confronto", "Frase"],
      items: [
        { id: "t1", prompt: "Prezzo: zibellino > visone", cells: ["Zibellino / visone", { input: true }], answers: ["lo zibellino è più caro del visone", "lo zibellino costa più del visone"] },
        { id: "t2", prompt: "Formalità: jeans < pantaloni eleganti", cells: ["Jeans / pantaloni", { input: true }], answers: ["i jeans sono meno formali dei pantaloni", "i jeans sono meno formali dei pantaloni eleganti"] },
        { id: "t3", prompt: "Facilità: provare > scegliere", cells: ["Provare / scegliere", { input: true }], answers: ["è più facile provare che scegliere"] },
        { id: "t4", prompt: "Prezzo: giacca > cappotto", cells: ["Giacca / cappotto", { input: true }], answers: ["la giacca è più costosa del cappotto", "il cappotto costa meno della giacca"] },
        { id: "t5", prompt: "Resistenza: pelle > tela", cells: ["Scarpe di pelle / scarpe di tela", { input: true }], answers: ["le scarpe di pelle sono più resistenti di quelle di tela"] },
        { id: "t6", prompt: "Comodità: negozio online > negozio affollato", cells: ["Comprare online / comprare in negozio", { input: true }], answers: ["è più comodo comprare online che in un negozio affollato"] },
        { id: "t7", prompt: "Eleganza: borsa rossa > borsa nera", cells: ["Borsa rossa / borsa nera", { input: true }], answers: ["la borsa rossa è più elegante della borsa nera"] },
        { id: "t8", prompt: "Distanza: questo negozio > supermercato", cells: ["Negozio / supermercato", { input: true }], answers: ["questo negozio è più lontano del supermercato"] },
        { id: "t9", prompt: "Preferenza: scegliere > comprare", cells: ["Scegliere / comprare", { input: true }], answers: ["è più difficile scegliere che comprare"] }
      ]
    },
    {
      id: "u053_s2_correzione", unitNumber: 53, sessionNumber: 2, tier: "Intermedio",
      tierLabel: "Sessione 2 · 3 Completamento e trasformazione (Livello intermedio)", type: "open_response",
      title: "2.6 Correggi i comparativi / Исправь сравнительные конструкции",
      instructions: "Riscrivi correttamente ogni frase e indica in breve la regola (di/che). / Перепиши предложения правильно и кратко объясни выбор di/che.",
      items: [
        { id: "e1", title: "Frase 1", prompt: "Correggi: “Lo zibellino è più caro che il visone.”" },
        { id: "e2", title: "Frase 2", prompt: "Correggi: “È più facile provare del scegliere.”" },
        { id: "e3", title: "Frase 3", prompt: "Correggi: “La borsa rossa è più elegante che la nera.”" },
        { id: "e4", title: "Frase 4", prompt: "Correggi: “È più comodo pagare con la carta del pagare in contanti.”" },
        { id: "e5", title: "Frase 5", prompt: "Correggi: “Le scarpe di pelle sono più resistenti che quelle di tela.”" }
      ]
    },
    {
      id: "u053_s2_produzione", unitNumber: 53, sessionNumber: 2, tier: "Produzione guidata",
      tierLabel: "Sessione 2 · 4 Produzione e interazione guidata", type: "open_response",
      title: "2.7 Confronta due prodotti / Сравни два товара",
      instructions: "Scrivi 5–6 frasi confrontando due prodotti a scelta. Usa almeno tre comparativi e spiega quale preferisci. / Напиши 5–6 предложений, сравнивая два товара, и объясни, какой предпочитаешь.",
             items: [{ id: "p1", title: "Due prodotti a confronto", prompt: "" }]
    },

    // Sessione 3 — passato prossimo e imperfetto
    {
      id: "u053_s3_tempi_mc", unitNumber: 53, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "3.1 Passato prossimo o imperfetto? / Passato prossimo или imperfetto?",
      instructions: "Scegli la forma più adatta al contesto. / Выбери подходящую форму по смыслу.",
      items: [
        { id: "t1", prompt: "Mentre la contessa ___ le pellicce, Germano aspettava.", options: [{ value: "a", label: "a · guardava" }, { value: "b", label: "b · ha guardato" }], answers: ["a"] },
        { id: "t2", prompt: "A un certo punto Germano ___ nella conversazione.", options: [{ value: "a", label: "a · interveniva" }, { value: "b", label: "b · è intervenuto" }], answers: ["b"] },
        { id: "t3", prompt: "La contessa ___ indecisa tra i pantaloni e i jeans.", options: [{ value: "a", label: "a · era" }, { value: "b", label: "b · è stata" }], answers: ["a"] },
        { id: "t4", prompt: "Ieri la contessa ___ in una profumeria.", options: [{ value: "a", label: "a · entrava" }, { value: "b", label: "b · è entrata" }], answers: ["b"] },
        { id: "t5", prompt: "Mentre Germano ___ l’auto, lei guardava le vetrine.", options: [{ value: "a", label: "a · parcheggiava" }, { value: "b", label: "b · ha parcheggiato" }], answers: ["a"] },
        { id: "t6", prompt: "A un certo punto la commessa ___ un nuovo modello.", options: [{ value: "a", label: "a · proponeva" }, { value: "b", label: "b · ha proposto" }], answers: ["b"] },
        { id: "t7", prompt: "Il negozio ___ pieno di clienti.", options: [{ value: "a", label: "a · era" }, { value: "b", label: "b · è stato" }], answers: ["a"] },
        { id: "t8", prompt: "La contessa ___ una borsa blu e una rossa.", options: [{ value: "a", label: "a · confrontava" }, { value: "b", label: "b · ha confrontato" }], answers: ["b"] },
                 { id: "t9", prompt: "Mentre loro facevano acquisti fuori, ___.", options: [{ value: "a", label: "a · pioveva" }, { value: "b", label: "b · ha piovuto" }], answers: ["a"] },
        { id: "t10", prompt: "Poi Germano ___ alla contessa di fare una pausa.", options: [{ value: "a", label: "a · suggeriva" }, { value: "b", label: "b · ha suggerito" }], answers: ["b"] }
      ]
    },
    {
      id: "u053_s3_abbinamento", unitNumber: 53, sessionNumber: 3, tier: "Base",
      tierLabel: "Sessione 3 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "3.2 Abbina l’uso del tempo verbale / Соедини время с его употреблением",
      instructions: "Abbina ogni frase alla funzione del tempo verbale. / Соедини предложение с функцией времени.",
      options: [
        { value: "A", label: "A · Evento concluso" },
        { value: "B", label: "B · Descrizione o situazione di sfondo" }
      ],
      items: [
        { id: "m1", prompt: "La contessa è entrata in una pellicceria", answers: ["A"] },
        { id: "m2", prompt: "La signora era elegante", answers: ["B"] },
        { id: "m3", prompt: "Le due pellicce le piacevano", answers: ["B"] },
        { id: "m4", prompt: "Il commesso ha detto il prezzo", answers: ["A"] },
        { id: "m5", prompt: "Mentre Germano aspettava", answers: ["B"] }
      ]
    },
    {
      id: "u053_s3_ordine", unitNumber: 53, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "3.3 Riordina il racconto / Составь рассказ из слов",
      instructions: "Metti le parole nell’ordine corretto. / Расставь слова в правильном порядке.",
      items: [
        { id: "o1", prompt: "Un evento concluso", words: ["una", "è", "La", "in", "entrata", "contessa", "pellicceria."], answers: [2, 5, 1, 4, 0, 3, 6] },
        { id: "o2", prompt: "Una descrizione", words: ["elegante.", "La", "era", "signora"], answers: [1, 3, 2, 0] },
        { id: "o3", prompt: "Il commesso e i clienti", words: ["ha", "il", "prezzo.", "commesso", "detto", "Il"], answers: [5, 3, 0, 1, 4, 2] },
        { id: "o4", prompt: "Una pausa", words: ["una", "Germano", "pausa.", "ha", "proposto"], answers: [1, 3, 4, 0, 2] },
        { id: "o5", prompt: "La pioggia", words: ["mentre", "Fuori", "pioveva.", "loro", "facevano", "acquisti"], answers: [1, 2, 0, 3, 4, 5] }
      ]
    },
    {
      id: "u053_s3_cloze", unitNumber: 53, sessionNumber: 3, tier: "Elementare",
      tierLabel: "Sessione 3 · 2 Manipolazione e riordino (Livello elementare)", type: "gap_fill",
      title: "3.4 Completa con il tempo corretto / Заполни правильной формой прошедшего времени",
      instructions: "Completa con passato prossimo o imperfetto. / Вставь passato prossimo или imperfetto.",
      items: [
        { id: "g1", before: "La contessa ", after: " in una pellicceria. (entrare)", answers: ["è entrata"] },
        { id: "g2", before: "La signora ", after: " elegante. (essere)", answers: ["era"] },
        { id: "g3", before: "Il commesso ", after: " il prezzo. (dire)", answers: ["ha detto"] },
        { id: "g4", before: "Le pellicce le ", after: " molto. (piacere)", answers: ["piacevano"] },
        { id: "g5", before: "La commessa ", after: " una borsa nuova. (mostrare)", answers: ["ha mostrato"] },
        { id: "g6", before: "Il negozio ", after: " molto affollato. (essere)", answers: ["era"] },
        { id: "g7", before: "Mentre Germano ", after: " l’auto, la contessa entrava in libreria. (parcheggiare)", answers: ["parcheggiava"] },
        { id: "g8", before: "A un certo punto la contessa ", after: " un cappotto blu. (provare)", answers: ["ha provato"] },
        { id: "g9", before: "Fuori ", after: " forte e i negozi erano pieni. (piovere)", answers: ["pioveva"] },
        { id: "g10", before: "Alla fine Germano le ", after: " una pausa. (proporre)", answers: ["ha proposto"] }
      ]
    },
    {
      id: "u053_s3_tabella", unitNumber: 53, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · 3 Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "3.5 Dalla tabella al racconto / От таблицы к рассказу",
      instructions: "Trasforma ogni informazione in una frase al passato. / Преобразуй информацию в предложение в прошедшем времени.",
      columns: ["Informazione", "Frase al passato"],
      items: [
        { id: "t1", prompt: "Evento: entrare in pellicceria", cells: ["La contessa / entrare", { input: true }], answers: ["la contessa è entrata in una pellicceria"] },
        { id: "t2", prompt: "Descrizione: la signora / essere elegante", cells: ["La signora / essere elegante", { input: true }], answers: ["la signora era elegante"] },
        { id: "t3", prompt: "Evento: Germano / intervenire", cells: ["Germano / intervenire", { input: true }], answers: ["germano è intervenuto"] },
        { id: "t4", prompt: "Descrizione: il negozio / essere affollato", cells: ["Il negozio / essere affollato", { input: true }], answers: ["il negozio era affollato"] },
        { id: "t5", prompt: "Evento: la commessa / mostrare una borsa", cells: ["La commessa / mostrare una borsa", { input: true }], answers: ["la commessa ha mostrato una borsa"] },
        { id: "t6", prompt: "Descrizione: fuori / piovere", cells: ["Fuori / piovere", { input: true }], answers: ["fuori pioveva"] }
      ]
    },
    {
      id: "u053_s3_riassunto", unitNumber: 53, sessionNumber: 3, tier: "Intermedio",
      tierLabel: "Sessione 3 · 3 Completamento e trasformazione (Livello intermedio)", type: "open_response",
      title: "3.6 Riassumi il racconto / Кратко перескажи рассказ",
      instructions: "Scrivi un riassunto di 6–8 frasi. Usa il passato prossimo per gli eventi e l’imperfetto per descrizioni e sfondo. / Напиши пересказ из 6–8 предложений, используя оба прошедших времени.",
      items: [{ id: "summary", title: "Il pomeriggio della contessa", prompt: "Racconta le tappe, le scelte, le reazioni di Germano e il finale sull’autobus." }]
    },
    {
      id: "u053_s3_produzione", unitNumber: 53, sessionNumber: 3, tier: "Produzione guidata",
      tierLabel: "Sessione 3 · 4 Produzione e interazione guidata", type: "open_response",
      title: "3.7 Racconta un pomeriggio speciale / Расскажи об особенном дне",
      instructions: "Scrivi 6–8 frasi su un pomeriggio di shopping reale o immaginario. Usa almeno tre verbi al passato prossimo e due all’imperfetto. / Напиши 6–8 предложений о реальном или вымышленном походе по магазинам.",
      items: [{ id: "p1", title: "Un pomeriggio di shopping", prompt: "Descrivi com’era la giornata e racconta che cosa è successo." }]
    },

    // Sessione 4 — condizionale presente e passato
    {
      id: "u053_s4_condizionale_mc", unitNumber: 53, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "4.1 Riconosci il condizionale / Определи форму condizionale",
      instructions: "Scegli la forma corretta. / Выбери правильную форму.",
      items: [
        { id: "c1", prompt: "Per una richiesta cortese adesso: “Signora, ___ aiutarmi?”", options: [{ value: "a", label: "a · potrebbe" }, { value: "b", label: "b · avrebbe potuto" }], answers: ["a"] },
        { id: "c2", prompt: "Un desiderio passato non realizzato: “La contessa ___ entrambe le pellicce.”", options: [{ value: "a", label: "a · comprerebbe" }, { value: "b", label: "b · avrebbe comprato" }], answers: ["b"] },
        { id: "c3", prompt: "Un consiglio cortese: “Lei ___ scegliere un solo anello.”", options: [{ value: "a", label: "a · dovrebbe" }, { value: "b", label: "b · avrebbe dovuto" }], answers: ["a"] },
        { id: "c4", prompt: "Per chiedere il prezzo con gentilezza: “Quanto ___ questa borsa?”", options: [{ value: "a", label: "a · costerebbe" }, { value: "b", label: "b · sarebbe costata" }], answers: ["a"] },
        { id: "c5", prompt: "Per un desiderio passato non realizzato: “La contessa ___ il cappotto, ma era troppo caro.”", options: [{ value: "a", label: "a · comprerebbe" }, { value: "b", label: "b · avrebbe comprato" }], answers: ["b"] },
        { id: "c6", prompt: "Per dare un consiglio: “Tu ___ provare anche la giacca blu.”", options: [{ value: "a", label: "a · dovresti" }, { value: "b", label: "b · avresti dovuto" }], answers: ["a"] },
        { id: "c7", prompt: "Per una richiesta cortese: “Mi ___ un sacchetto, per favore?”", options: [{ value: "a", label: "a · darebbe" }, { value: "b", label: "b · avrebbe dato" }], answers: ["a"] },
        { id: "c8", prompt: "Per un acquisto mancato ieri: “Io ___ quelle scarpe, ma non avevo abbastanza soldi.”", options: [{ value: "a", label: "a · prenderei" }, { value: "b", label: "b · avrei preso" }], answers: ["b"] },
        { id: "c9", prompt: "Per un consiglio: “Voi ___ confrontare i prezzi.”", options: [{ value: "a", label: "a · dovreste" }, { value: "b", label: "b · avreste dovuto" }], answers: ["a"] },
        { id: "c10", prompt: "Per chiedere una taglia: “___ portarmi una misura più grande?”", options: [{ value: "a", label: "a · Potrebbe" }, { value: "b", label: "b · Avrebbe potuto" }], answers: ["a"] }
      ]
    },
    {
      id: "u053_s4_abbinamento", unitNumber: 53, sessionNumber: 4, tier: "Base",
      tierLabel: "Sessione 4 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "4.2 Abbina la frase alla funzione / Соедини предложение с функцией",
      instructions: "Abbina ogni frase al significato corretto. / Соедини предложение с правильным значением.",
      options: [
        { value: "A", label: "A · Richiesta cortese nel presente" },
        { value: "B", label: "B · Desiderio non realizzato nel passato" },
        { value: "C", label: "C · Consiglio" }
      ],
      items: [
        { id: "m5", prompt: "Avrei comprato il cappotto, ma costava troppo", answers: ["B"] },
        { id: "m1", prompt: "Potrebbe fare i biglietti, per favore?", answers: ["A"] },
        { id: "m7", prompt: "Potrebbe prepararmi il pacchetto regalo?", answers: ["A"] },
        { id: "m3", prompt: "Dovresti scegliere un solo anello", answers: ["C"] },
        { id: "m8", prompt: "Avrebbe preso le scarpe, ma non c’era la sua misura", answers: ["B"] },
        { id: "m4", prompt: "Mi potrebbe mostrare una taglia più grande?", answers: ["A"] },
        { id: "m2", prompt: "Avrebbe comprato entrambe le pellicce", answers: ["B"] },
        { id: "m6", prompt: "Dovresti confrontare i prezzi", answers: ["C"] }
      ]
    },
    {
      id: "u053_s4_ordine", unitNumber: 53, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "4.3 Riordina le richieste cortesi / Составь вежливые просьбы",
      instructions: "Riordina le parole per formare richieste corrette. / Расставь слова, чтобы составить правильные просьбы.",
      items: [
        { id: "o1", prompt: "Chiedere di provare una pelliccia", words: ["potrei", "Signora,", "provare", "pelliccia?", "questa"], answers: [1, 0, 2, 4, 3] },
        { id: "o2", prompt: "Chiedere un consiglio", words: ["consiglierebbe?", "mi", "Quale", "anello"], answers: [2, 3, 1, 0] },
        { id: "o3", prompt: "Chiedere di fare i biglietti", words: ["fare", "Potrebbe", "biglietti,", "i", "per", "favore?"], answers: [1, 0, 3, 2, 4, 5] },
        { id: "o4", prompt: "Chiedere una taglia", words: ["una", "Potrebbe", "grande?", "taglia", "portarmi", "più"], answers: [1, 4, 0, 5, 3, 2] },
        { id: "o5", prompt: "Chiedere il prezzo", words: ["borsa?", "Quanto", "costerebbe", "questa"], answers: [1, 2, 3, 0] },
        { id: "o6", prompt: "Chiedere un pacchetto", words: ["prepararmi", "Potrebbe", "regalo?", "il", "pacchetto"], answers: [1, 0, 3, 4, 2] },
        { id: "o7", prompt: "Chiedere un consiglio", words: ["consigliare", "mi", "Quale", "potrebbe", "modello?"], answers: [2, 4, 1, 3, 0] },
        { id: "o8", prompt: "Chiedere di provare le scarpe", words: ["queste", "provare", "Potrei", "scarpe?"], answers: [2, 1, 0, 3] }
      ]
    },
    {
      id: "u053_s4_cloze", unitNumber: 53, sessionNumber: 4, tier: "Elementare",
      tierLabel: "Sessione 4 · 2 Manipolazione e riordino (Livello elementare)", type: "gap_fill",
      title: "4.4 Completa il condizionale presente / Заполни condizionale presente",
      instructions: "Completa con la forma di cortesia al condizionale presente. / Вставь вежливую форму condizionale presente.",
      items: [
        { id: "g1", before: "Signora, quale anello mi ", after: "? (consigliare)", answers: ["consiglierebbe"] },
        { id: "g2", before: "Scusi, ", after: " provare questa pelliccia? (potere)", answers: ["potrebbe"] },
        { id: "g3", before: "Io ", after: " entrambe le pellicce. (prendere)", answers: ["prenderei"] },
        { id: "g4", before: "Germano, io ", after: " a casa. (tornare)", answers: ["tornerei"] },
        { id: "g5", before: "Signora, mi ", after: " una taglia più grande? (portare)", answers: ["porterebbe"] },
        { id: "g6", before: "Tu ", after: " confrontare i prezzi prima di comprare. (dovere)", answers: ["dovresti"] },
        { id: "g7", before: "Io ", after: " queste scarpe, ma non c’era la mia misura. (prendere)", answers: ["avrei preso"] },
        { id: "g8", before: "Mi ", after: " dire quanto costa? (potere)", answers: ["potrebbe"] },
        { id: "g9", before: "Voi ", after: " chiedere uno sconto. (potere)", answers: ["potreste"] },
        { id: "g10", before: "La contessa ", after: " la borsa, ma aveva dimenticato il portafoglio. (comprare)", answers: ["avrebbe comprato"] }
      ]
    },
    {
      id: "u053_s4_trasformazione", unitNumber: 53, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · 3 Completamento e trasformazione (Livello intermedio)", type: "open_response",
      title: "4.5 Trasforma le frasi / Преобразуй предложения",
             instructions: "Riformula mantenendo il significato e usando il condizionale di cortesia. / Переформулируй, сохранив смысл и используя вежливую форму condizionale.",
       items: [
         { id: "tr1", title: "Richiesta cortese", prompt: "Trasforma: “Signora, può dirmi il prezzo?”" },
         { id: "tr2", title: "Consiglio", prompt: "Trasforma: “Devi scegliere un solo anello.”" },
         { id: "tr3", title: "Desiderio passato", prompt: "Riformula: “La contessa voleva comprare entrambe le pellicce, ma non le ha comprate.”" },
         { id: "tr4", title: "Richiesta cortese", prompt: "Trasforma: “Può mostrarmi una borsa più piccola?”" },
         { id: "tr5", title: "Richiesta cortese", prompt: "Trasforma: “Mi dai lo scontrino?” Rivolgiti formalmente al commesso." },
         { id: "tr6", title: "Consiglio", prompt: "Trasforma: “È meglio provare le scarpe.” Dai un consiglio alla contessa." },
         { id: "tr7", title: "Consiglio", prompt: "Trasforma: “È necessario confrontare i prezzi.” Dai un consiglio." },
         { id: "tr8", title: "Desiderio passato", prompt: "Riformula: “Volevo comprare il cappotto, ma costava troppo.”" },
         { id: "tr9", title: "Desiderio passato", prompt: "Riformula: “Germano voleva comprare una guida, ma la libreria era chiusa.”" }
      ]
    },
    {
      id: "u053_s4_correzione", unitNumber: 53, sessionNumber: 4, tier: "Intermedio",
      tierLabel: "Sessione 4 · 3 Completamento e trasformazione (Livello intermedio)", type: "open_response",
      title: "4.6 Correggi le forme verbali / Исправь формы глаголов",
      instructions: "Riscrivi ogni frase correggendo il tempo verbale e spiega brevemente la scelta. / Перепиши предложения, исправь время и кратко объясни выбор.",
      items: [
        { id: "e1", title: "Richiesta", prompt: "Correggi la forma: “Signora, avrebbe potuto consigliarmi un anello?” (la richiesta è nel presente)." },
        { id: "e2", title: "Desiderio passato", prompt: "Correggi la forma: “La contessa comprerebbe entrambe le pellicce, ma ieri non le ha comprate.”" }
      ]
    },
    {
      id: "u053_s4_produzione", unitNumber: 53, sessionNumber: 4, tier: "Produzione guidata",
      tierLabel: "Sessione 4 · 4 Produzione e interazione guidata", type: "open_response",
      title: "4.7 Scrivi un dialogo cortese / Напиши вежливый диалог",
      instructions: "Scrivi un dialogo di 6–8 battute in un negozio. Usa due richieste cortesi al condizionale presente e una frase con il condizionale passato. / Напиши диалог из 6–8 реплик, используя вежливые просьбы и condizionale passato.",
      items: [{ id: "p1", title: "Cliente e commesso", prompt: "Concludi con una decisione o con un ripensamento." }]
    },

    // Sessione 5 — ripasso e produzione
    {
      id: "u053_s5_ripasso_mc", unitNumber: 53, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · 1 Riconoscimento e abbinamento (Livello base)", type: "multiple_choice",
      title: "5.1 Ripasso: lessico e grammatica / Повторение: лексика и грамматика",
      instructions: "Scegli la risposta corretta. / Выбери правильный ответ.",
      items: [
        { id: "r1", prompt: "La contessa ___ in una gioielleria e ___ due anelli.", options: [{ value: "a", label: "a · è entrata / ha visto" }, { value: "b", label: "b · entrava / vedeva" }, { value: "c", label: "c · sarebbe entrata / avrebbe visto" }], answers: ["a"] },
        { id: "r2", prompt: "Mentre Germano ___, la contessa guardava le vetrine.", options: [{ value: "a", label: "a · sospirava" }, { value: "b", label: "b · ha sospirato" }], answers: ["a"] },
        { id: "r3", prompt: "Il visone è più leggero ___ zibellino.", options: [{ value: "a", label: "a · che" }, { value: "b", label: "b · dello" }, { value: "c", label: "c · allo" }], answers: ["b"] }
      ]
    },
    {
      id: "u053_s5_abbinamento", unitNumber: 53, sessionNumber: 5, tier: "Base",
      tierLabel: "Sessione 5 · 1 Riconoscimento e abbinamento (Livello base)", type: "matching",
      title: "5.2 Abbina le forme al tempo / Соедини формы со временем",
      instructions: "Abbina ogni forma verbale al tempo corretto. / Соедини глагольную форму с правильным временем.",
      options: [
        { value: "A", label: "A · Passato prossimo" },
        { value: "B", label: "B · Imperfetto" },
        { value: "C", label: "C · Condizionale presente" },
        { value: "D", label: "D · Condizionale passato" }
      ],
      items: [
        { id: "m1", prompt: "è entrata", answers: ["A"] },
        { id: "m2", prompt: "era", answers: ["B"] },
        { id: "m3", prompt: "potrebbe", answers: ["C"] },
        { id: "m4", prompt: "avrebbe comprato", answers: ["D"] }
      ]
    },
    {
      id: "u053_s5_ordine", unitNumber: 53, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · 2 Manipolazione e riordino (Livello elementare)", type: "word_order",
      title: "5.3 Riordina le frasi di riepilogo / Составь итоговые предложения",
      instructions: "Riordina le parole per ottenere frasi corrette. / Расставь слова, чтобы получить правильные предложения.",
      items: [
        { id: "o1", prompt: "Un acquisto mancato", words: ["ha", "La", "niente.", "non", "comprato", "contessa"], answers: [1, 5, 3, 0, 4, 2] },
        { id: "o2", prompt: "Una richiesta cortese", words: ["fare", "Potrebbe", "biglietti,", "i", "per", "favore?"], answers: [1, 0, 3, 2, 4, 5] }
      ]
    },
    {
      id: "u053_s5_cloze", unitNumber: 53, sessionNumber: 5, tier: "Elementare",
      tierLabel: "Sessione 5 · 2 Manipolazione e riordino (Livello elementare)", type: "gap_fill",
      title: "5.4 Completa il riepilogo / Заполни итоговый текст",
      instructions: "Completa con la forma corretta indicata tra parentesi. / Вставь правильную форму глагола.",
      items: [
        { id: "z1", before: "La contessa ", after: " in diversi negozi. (entrare — passato prossimo)", answers: ["è entrata"] },
        { id: "z2", before: "Germano le ", after: " di non comprare le pellicce. (consigliare — passato prossimo)", answers: ["ha consigliato"] },
        { id: "z3", before: "Alla fermata lei non ", after: " monete. (avere — imperfetto)", answers: ["aveva"] },
        { id: "z4", before: "La contessa ", after: " volentieri un anello, ma non l’ha comprato. (prendere — condizionale passato)", answers: ["avrebbe preso"] }
      ]
    },
    {
      id: "u053_s5_tabella", unitNumber: 53, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · 3 Completamento e trasformazione (Livello intermedio)", type: "table_fill",
      title: "5.5 Dati e racconto / Данные и рассказ",
      instructions: "Scrivi una frase completa per ogni informazione. / Составь полное предложение по каждой подсказке.",
      columns: ["Dato", "Frase"],
      items: [
        { id: "t1", prompt: "Evento concluso", cells: ["La contessa / entrare in gioielleria", { input: true }], answers: ["la contessa è entrata in gioielleria", "la contessa è entrata in una gioielleria"] },
        { id: "t2", prompt: "Situazione di sfondo", cells: ["Germano / essere contrario", { input: true }], answers: ["germano era contrario"] },
        { id: "t3", prompt: "Desiderio non realizzato", cells: ["La contessa / comprare le pellicce", { input: true }], answers: ["la contessa avrebbe comprato le pellicce"] }
      ]
    },
    {
      id: "u053_s5_domande", unitNumber: 53, sessionNumber: 5, tier: "Intermedio",
      tierLabel: "Sessione 5 · 3 Completamento e trasformazione (Livello intermedio)", type: "open_response",
      title: "5.6 Rispondi sul racconto / Ответь по рассказу",
      instructions: "Rispondi con frasi autonome e complete. / Ответь самостоятельными полными предложениями.",
      items: [
        { id: "q1", title: "Le scelte", prompt: "Quali prodotti ha confrontato la contessa e perché alla fine non ha comprato niente?" },
        { id: "q2", title: "L’autobus", prompt: "Che cosa chiede la contessa a Germano alla fermata e perché?" }
      ]
    },
    {
      id: "u053_s5_dialogo", unitNumber: 53, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · 4 Produzione e interazione guidata", type: "open_response",
      title: "5.7 Scrivi un dialogo in un negozio / Напиши диалог в магазине",
      instructions: "Scrivi un dialogo di 8–10 battute tra cliente e commesso. Inserisci due richieste cortesi con il condizionale presente, un comparativo e una risposta del commesso. / Напиши диалог из 8–10 реплик, используя две вежливые просьбы, сравнение и ответ продавца.",
      items: [{ id: "dialogue", title: "Cliente e commesso", prompt: "Scegli un negozio e due prodotti da confrontare. Concludi con una decisione o con un ripensamento." }]
    },
    {
      id: "u053_s5_profilo", unitNumber: 53, sessionNumber: 5, tier: "Produzione guidata",
      tierLabel: "Sessione 5 · 4 Produzione e interazione guidata", type: "open_response",
      title: "5.8 Descrivi i tuoi gusti / Расскажи о своих вкусах",
      instructions: "Scrivi 6–8 frasi sui tuoi gusti nell’abbigliamento. Usa almeno tre comparativi e una forma del condizionale. / Напиши 6–8 предложений о своих предпочтениях в одежде, используя сравнения и condizionale.",
      items: [{ id: "style", title: "Il mio stile", prompt: "Parla di capi, colori, occasioni e materiali che preferisci. Puoi inventare un personaggio." }]
    }
  ]
};
