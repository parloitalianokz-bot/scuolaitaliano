// Catalogo esercizi — Unità 1: Un albergo in centro (A0/A1 · IT / RU)
window.HOMEWORK_EXERCISES_CATALOG = window.HOMEWORK_EXERCISES_CATALOG || {};
window.HOMEWORK_EXERCISES_CATALOG["1"] = {
  unitNumber: 1,
  unitSlug: "u_001",
  unitTitle: "Unità 1 · Un albergo in centro / Отель в центре",
  level: "A0/A1",
  description: "Esercizi graduati sull'albergo Ponte Vecchio, le persone, le nazionalità e il verbo essere. Tutte le consegne sono in italiano e russo. / Упражнения по теме отеля Ponte Vecchio, людей, национальностей и глагола essere. Все инструкции даны на итальянском и русском языках.",
  defaultExerciseIds: ["u001_base_matching", "u001_base_essere_mc", "u001_elementare_cloze"],
  exercises: [
    {
      id: "u001_base_matching", unitNumber: 1, tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (A0/A1)", type: "matching",
      title: "1. Abbina gli ospiti ai profili / Соедини гостей с описаниями",
      instructions: "Abbina ogni persona alla descrizione corretta. Leggi le parole chiave e scegli la risposta dal menu. / Соедини каждого человека с подходящим описанием. Прочитай ключевые слова и выбери ответ из списка.",
      options: [
        { value: "A", label: "A · Giapponese, dentista, conferenza" },
        { value: "B", label: "B · Francese, avvocato, affari" },
        { value: "C", label: "C · Direttore, sposato, tre figli" },
        { value: "D", label: "D · Russa, studentessa, italiano e shopping" },
        { value: "E", label: "E · Tedeschi, studenti, studiare l'italiano" },
        { value: "F", label: "F · Inglese, insegnante, insegna inglese" }
      ],
      items: [
        { id: "victor", prompt: "Victor", answers: ["B"] },
        { id: "karl_klaus", prompt: "Karl e Klaus", answers: ["E"] },
        { id: "mary", prompt: "Mary", answers: ["F"] },
        { id: "yoko", prompt: "Yoko", answers: ["A"] },
        { id: "olga", prompt: "Olga", answers: ["D"] },
        { id: "paolo", prompt: "Paolo Rossi", answers: ["C"] }
      ]
    },
    {
      id: "u001_base_essere_mc", unitNumber: 1, tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (A0/A1)", type: "multiple_choice",
      title: "2. Scegli la forma corretta di essere / Выбери правильную форму essere",
      instructions: "Scegli una risposta. / Выбери один ответ.",
      items: [
        { id: "q1", prompt: "Le camere ______ grandi.", options: [{ value: "a", label: "a · è" }, { value: "b", label: "b · sono" }, { value: "c", label: "c · siamo" }], answers: ["b"] },
        { id: "q2", prompt: "Signora, Lei ______ in Italia per turismo?", options: [{ value: "a", label: "a · sei" }, { value: "b", label: "b · sono" }, { value: "c", label: "c · è" }], answers: ["c"] },
        { id: "q3", prompt: "Karl e Klaus ______ tedeschi.", options: [{ value: "a", label: "a · sono" }, { value: "b", label: "b · è" }, { value: "c", label: "c · siete" }], answers: ["a"] },
        { id: "q4", prompt: "Io e Olga ______ a Firenze.", options: [{ value: "a", label: "a · sono" }, { value: "b", label: "b · siamo" }, { value: "c", label: "c · è" }], answers: ["b"] },
        { id: "q5", prompt: "Un albergo in centro è ______.", options: [{ value: "a", label: "a · comodo" }, { value: "b", label: "b · sposato" }, { value: "c", label: "c · occupato" }], answers: ["a"] }
      ]
    },
    {
      id: "u001_base_table", unitNumber: 1, tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (A0/A1)", type: "table_fill",
      title: "3. Completa la tabella degli ospiti / Заполни таблицу гостей",
      instructions: "Completa le caselle vuote con le informazioni date nel profilo dell'unità. / Заполни пустые ячейки по информации из текста урока.",
      columns: ["Persona", "Nazionalità", "Lavoro", "Motivo del viaggio"],
      items: [
        { id: "victor", prompt: "Victor — nazionalità", cells: ["Victor", { input: true }, "Avvocato", "Per affari"], answers: ["francese"] },
        { id: "mary", prompt: "Mary — nazionalità", cells: ["Mary", { input: true }, "Insegnante", "Per insegnare l'inglese"], answers: ["inglese"] },
        { id: "yoko", prompt: "Yoko — lavoro", cells: ["Yoko", "Giapponese", { input: true }, "Per una conferenza"], answers: ["dentista"] },
        { id: "olga", prompt: "Olga — nazionalità", cells: ["Olga", { input: true }, "Studentessa", "Per studiare l'italiano e fare shopping"], answers: ["russa"] },
        { id: "paolo", prompt: "Paolo Rossi — lavoro", cells: ["Paolo Rossi", "Italiano", { input: true }, "Lavora all'albergo"], answers: ["direttore", "direttore dell'albergo"] }
      ]
    },
    {
      id: "u001_base_spotting", unitNumber: 1, tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (A0/A1)", type: "gap_fill",
      title: "4. Aggiungi il verbo essere",
      instructions: "Completa le frasi con la forma corretta del verbo essere. Il testo in russo ti aiuta a capire il significato. / Вставь в предложения нужную форму глагола essere. Русский перевод поможет понять смысл.",
      items: [
        { id: "f1", prompt: "Отель находится во Флоренции.", before: "L'albergo ", after: " a Firenze.", answers: ["è"] },
        { id: "f2", prompt: "Номера большие и светлые.", before: "Le camere ", after: " grandi e luminose.", answers: ["sono"] },
        { id: "f3", prompt: "Я новый гость.", before: "Io ", after: " un ospite nuovo.", answers: ["sono"] },
        { id: "f4", prompt: "Марко здесь по работе.", before: "Marco ", after: " qui per lavoro.", answers: ["è"] },
        { id: "f5", prompt: "Вы в отпуске?", before: "Voi ", after: " in vacanza?", answers: ["siete"] },
        { id: "f6", prompt: "Вы здесь на учёбе?", before: "Voi ", after: " qui per studio?", answers: ["siete"] },
        { id: "f7", prompt: "Мы очень рады.", before: "Noi ", after: " molto contenti.", answers: ["siamo"] },
        { id: "f8", prompt: "... быть в Италии.", before: "... di ", after: " in Italia.", answers: ["essere"] }
      ]
    },
    {
      id: "u001_base_odd", unitNumber: 1, tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (A0/A1)", type: "multiple_choice",
      title: "5. Trova l'intruso / Найди лишнее слово",
      instructions: "Scegli l'elemento che non appartiene al gruppo. / Выбери элемент, который не подходит к группе.",
      items: [
        { id: "odd1", prompt: "sposato · occupato · grande · dentista", options: [{ value: "a", label: "sposato" }, { value: "b", label: "grande" }, { value: "c", label: "dentista" }], answers: ["c"] },
        { id: "odd2", prompt: "io sono · tu sei · noi siamo · loro hanno", options: [{ value: "a", label: "io sono" }, { value: "b", label: "noi siamo" }, { value: "c", label: "loro hanno" }], answers: ["c"] },
        { id: "odd3", prompt: "Firenze · Pisa · Siena · giapponese", options: [{ value: "a", label: "Firenze" }, { value: "b", label: "Siena" }, { value: "c", label: "giapponese" }], answers: ["c"] }
      ]
    },
    {
      id: "u001_base_sound", unitNumber: 1, tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (A0/A1)", type: "multiple_choice",
      title: "6. Suono e grafia / Звук и написание",
      instructions: "Leggi la pronuncia semplificata in cirillico e scegli la parola italiana scritta correttamente. Non è un ascolto audio. / Прочитай упрощённую подсказку кириллицей и выбери правильное написание итальянского слова. Это не аудиозадание.",
      items: [
        { id: "sound1", prompt: "[кьямано]", options: [{ value: "a", label: "chiamano" }, { value: "b", label: "ciamano" }, { value: "c", label: "kiamano" }], answers: ["a"] },
        { id: "sound2", prompt: "[инсеньянте]", options: [{ value: "a", label: "insegnante" }, { value: "b", label: "insegniante" }, { value: "c", label: "insignante" }], answers: ["a"] },
        { id: "sound3", prompt: "[скуола]", options: [{ value: "a", label: "scuola" }, { value: "b", label: "squola" }, { value: "c", label: "scula" }], answers: ["a"] }
      ]
    },
    {
      id: "u001_elementare_incastro", unitNumber: 1, tier: "Elementare",
      tierLabel: "2 · Manipolazione e riordino (A1 guidato)", type: "multiple_choice",
      title: "7. Inserisci la frase nel testo / Вставь фразу в текст",
      instructions: "Scegli la frase che completa meglio ogni punto del breve testo. / Выбери фразу, которая лучше всего подходит в каждое место короткого текста.",
      items: [
        { id: "gap1", prompt: "L'albergo Ponte Vecchio è a Firenze. [1]", options: [{ value: "a", label: "È un albergo comodo per gli stranieri: è in centro." }, { value: "b", label: "Sono studenti tedeschi." }, { value: "c", label: "Olga è russa." }], answers: ["a"] },
        { id: "gap2", prompt: "Anche Karl e Klaus sono ospiti. [2]", options: [{ value: "a", label: "È il direttore dell'albergo." }, { value: "b", label: "Sono tedeschi e sono studenti." }, { value: "c", label: "Mary insegna inglese." }], answers: ["b"] },
        { id: "gap3", prompt: "Olga è russa. [3]", options: [{ value: "a", label: "È in Italia per studiare l'italiano e fare shopping." }, { value: "b", label: "È un albergo in centro." }, { value: "c", label: "Sono camere grandi." }], answers: ["a"] },
        { id: "gap4", prompt: "Paolo Rossi è il direttore. [4]", options: [{ value: "a", label: "È giapponese e fa il dentista." }, { value: "b", label: "È sempre molto occupato con i clienti." }, { value: "c", label: "Sono inglesi." }], answers: ["b"] }
      ]
    },
    {
      id: "u001_elementare_pattern", unitNumber: 1, tier: "Elementare",
      tierLabel: "2 · Manipolazione e riordino (A1 guidato)", type: "open_response",
      title: "8. Costruisci frasi con il modello / Составь предложения по образцу",
      instructions: "Segui il modello. Puoi copiare la struttura e cambiare solo nome, nazionalità e motivo. / Следуй образцу. Скопируй структуру и измени только имя, национальность и цель поездки.",
      example: "Victor · francese · affari → Victor è francese, è qui per affari. / Виктор · француз · дела → Виктор француз, он здесь по делам.",
      items: [
        { id: "pattern1", title: "Mary", prompt: "Usa: inglese · insegnare l'inglese. / Используй: англичанка · преподавать английский." },
        { id: "pattern2", title: "Yoko", prompt: "Usa: giapponese · una conferenza. / Используй: японка · конференция." },
        { id: "pattern3", title: "Karl e Klaus", prompt: "Usa: tedeschi · studiare l'italiano. / Используй: немцы · изучать итальянский." },
        { id: "pattern4", title: "Olga", prompt: "Usa: russa · fare shopping. / Используй: русская · ходить по магазинам." }
      ]
    },
    {
      id: "u001_elementare_order", unitNumber: 1, tier: "Elementare",
      tierLabel: "2 · Manipolazione e riordino (A1 guidato)", type: "word_order",
      title: "9. Riordina le parole / Составь предложения из слов",
      instructions: "Tocca le parole nell'ordine giusto per formare la frase. Puoi annullare l'ultima parola o ricominciare. / Нажимай на слова в правильном порядке. Можно отменить последнее слово или начать заново.",
      items: [
        { id: "order1", prompt: "Il signor Rossi / Господин Росси", words: ["e", "sposato", "il", "figli.", "ha", "Rossi", "tre", "signor", "è"], answers: [2, 7, 5, 8, 1, 0, 4, 6, 3] },
        { id: "order2", prompt: "L'albergo / Отель", words: ["in", "centro.", "L'albergo", "è"], answers: [2, 0, 3, 1] },
        { id: "order3", prompt: "Tu / Ты", words: ["o", "Tu", "studi", "lavori", "?"], answers: [1, 3, 0, 2, 4] }
      ]
    },
    {
      id: "u001_intermedio_cloze", unitNumber: 1, tier: "Intermedio",
      tierLabel: "3 · Completamento e trasformazione (A1 guidato)", type: "gap_fill",
      title: "10. Completa con essere / Вставь нужную форму essere",
      instructions: "Completa con: è · sono · siamo · siete · sei. / Вставь: è · sono · siamo · siete · sei.",
      items: [
        { id: "cloze1", before: "Anna, dove ", after: " adesso? / Анна, где ты сейчас?", answers: ["sei"] },
        { id: "cloze2", before: "Io e Luca ", after: " a Firenze. / Мы с Лукой во Флоренции.", answers: ["siamo"] },
        { id: "cloze3", before: "Signori, voi ", after: " qui per una conferenza? / Господа, вы здесь на конференции?", answers: ["siete"] },
        { id: "cloze4", before: "La camera ", after: " tranquilla. / Номер спокойный.", answers: ["è"] },
        { id: "cloze5", before: "Loro ", after: " studenti. / Они студенты.", answers: ["sono"] }
      ]
    },
    {
      id: "u001_intermedio_profile", unitNumber: 1, tier: "Intermedio",
      tierLabel: "3 · Completamento e trasformazione (A1 guidato)", type: "open_response",
      title: "11. Trasforma una scheda in frasi / Преврати анкету в предложения",
      instructions: "Per ogni scheda, scrivi tre frasi brevi: 1) nome, 2) nazionalità e professione o studio, 3) città e motivo del viaggio. Segui l'esempio; non copiare i suoi dati. / Для каждой анкеты напиши три коротких предложения: 1) имя, 2) национальность и профессия или учёба, 3) город и цель поездки. Следуй образцу, но не копируй его данные.",
      example: "Luca Bianchi · italiano · medico · Milano, per lavoro → Si chiama Luca Bianchi. È italiano e fa il medico. È a Milano per lavoro. / Лука Бьянки · итальянец · врач · Милан, по работе → Его зовут Лука Бьянки. Он итальянец и работает врачом. Он в Милане по работе.",
      items: [
        { id: "profile1", title: "Scheda 1 / Анкета 1", prompt: "Nome: Elena Conti · Nazionalità: italiana · Lavoro: architetto · Città e motivo: Roma, per lavoro. / Имя: Елена Конти · Национальность: итальянка · Профессия: архитектор · Город и цель: Рим, по работе." },
        { id: "profile2", title: "Scheda 2 / Анкета 2", prompt: "Nome: Yoko Tanaka · Nazionalità: giapponese · Lavoro: dentista · Città e motivo: Firenze, per una conferenza. / Имя: Ёко Танака · Национальность: японка · Профессия: стоматолог · Город и цель: Флоренция, на конференцию." },
        { id: "profile3", title: "Scheda 3 / Анкета 3", prompt: "Nome: Olga Ivanova · Nazionalità: russa · Studio: studentessa · Città e motivo: Firenze, per studiare l'italiano e fare shopping. / Имя: Ольга Иванова · Национальность: русская · Учёба: студентка · Город и цель: Флоренция, чтобы учить итальянский и ходить по магазинам." }
      ]
    },
    {
      id: "u001_intermedio_self_intro", unitNumber: 1, tier: "Intermedio",
      tierLabel: "3 · Completamento e trasformazione (A1 guidato)", type: "open_response",
      title: "12. Presentati / Расскажи о себе",
      instructions: "Prepara una breve presentazione: scrivi le frasi e poi pronunciale ad alta voce. Puoi parlare di te oppure inventare un personaggio. / Подготовь короткий рассказ о себе: напиши предложения, а затем произнеси их вслух. Можно рассказать о себе или придумать персонажа.",
      items: [{ id: "self_intro", title: "La mia presentazione / Рассказ о себе", prompt: "1. Come ti chiami? / Как тебя зовут?  2. Di dove sei? / Откуда ты?  3. Che lavoro fai o che cosa studi? / Кем ты работаешь или где учишься?  4. Perché sei in Italia? / Почему ты в Италии? (per lavoro, per studio, per turismo...)" }]
    },
    {
      id: "u001_production_intro", unitNumber: 1, tier: "Produzione guidata",
      tierLabel: "4 · Produzione e interazione guidata (A1)", type: "open_response",
      title: "13. Presentati in quattro frasi / Представься в четырёх предложениях",
      instructions: "Completa le frasi guida con parole semplici. Se non vuoi parlare di te, inventa un ospite dell'albergo. / Заполни заготовки простыми словами. Если не хочешь рассказывать о себе, придумай гостя отеля.",
      example: "Mi chiamo ... Sono ... Sono ... Sono qui per ... / Меня зовут ... Я ... Я ... Я здесь, чтобы ...",
      items: [{ id: "intro", title: "La presentazione / Представление", prompt: "1. Mi chiamo ... / Меня зовут ...  2. Sono ... (nazionalità) / Я ... (национальность)  3. Sono ... (lavoro o studio) / Я ... (работаю или учусь)  4. Sono qui per ... / Я здесь, чтобы ..." }]
    }
  ]
};
