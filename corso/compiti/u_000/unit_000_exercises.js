// Catalogo esercizi — Unità 0: Alfabeto Italiano (Livello A0 · IT / RU)
window.HOMEWORK_EXERCISES_CATALOG = window.HOMEWORK_EXERCISES_CATALOG || {};
window.HOMEWORK_EXERCISES_CATALOG["0"] = {
  unitNumber: 0,
  unitSlug: "u_000",
  unitTitle: "Unità 0 · Alfabeto Italiano / Итальянский алфавит",
  level: "A0",
  description: "Fonetica, vocali pure senza riduzione, suoni duri e dolci (C/G, CH/GH, GN/GLI, SCI/SCE), H muta, S e Z con traslitterazione in cirillico. / Фонетика, чистые гласные без редукции, твёрдые и мягкие звуки, немая H, S и Z с транслитерацией кириллицей.",
  exercises: [
    {
      id: "u000_es1_c_sort",
      unitNumber: 0,
      tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (Livello base · A0)",
      type: "column_sort",
      title: "1.1 Abbinamento · Suono della C dolce [ч] o dura [к] / Распределение · Мягкий [ч] или твёрдый [к] звук C",
      instructions: "Inserisci ogni scheda (parola + immagine) nella colonna giusta: trascinala (drag & drop) oppure clicca sulla scheda e poi clicca sulla colonna (o viceversa, clicca sulla colonna e poi sulla scheda). / Перетащи карточку в нужный столбец или нажми на карточку, а затем на столбец (или наоборот: сначала выбери столбец, затем карточку).",
      columns: [
        { id: "dolce", label: "C dolce [ч] / Мягкий [ч]" },
        { id: "dura", label: "C dura [к] / Твёрдый [к]" }
      ],
      items: [
        {
          id: "c1",
          word: "cinese",
          translit: "[чинезе]",
          image: "img/cinese.jpg",
          fallbackEmoji: "🇨🇳",
          column: "dolce"
        },
        {
          id: "c2",
          word: "chitarra",
          translit: "[китарра]",
          image: "img/chitarra.jpg",
          fallbackEmoji: "🎸",
          column: "dura"
        },
        {
          id: "c3",
          word: "cinema",
          translit: "[чинема]",
          image: "img/cinema.jpg",
          fallbackEmoji: "🎬",
          column: "dolce"
        },
        {
          id: "c4",
          word: "quaderno",
          translit: "[куадерно]",
          image: "img/quaderno.jpg",
          fallbackEmoji: "📓",
          column: "dura"
        },
        {
          id: "c5",
          word: "città",
          translit: "[читта]",
          image: "img/citta.jpg",
          fallbackEmoji: "🏙️",
          column: "dolce"
        },
        {
          id: "c6",
          word: "chiave",
          translit: "[кьяве]",
          image: "img/chiave.jpg",
          fallbackEmoji: "🔑",
          column: "dura"
        }
      ]
    },
    {
      id: "u000_es1_g_sort",
      unitNumber: 0,
      tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (Livello base · A0)",
      type: "column_sort",
      title: "1.2 Abbinamento · Suono della G dolce [дж] o dura [г] / Распределение · Мягкий [дж] или твёрдый [г] звук G",
      instructions: "Inserisci ogni scheda (parola + immagine) nella colonna giusta tramite drag & drop oppure cliccando sulla scheda e poi sulla colonna (o viceversa). / Перетащи карточку в нужный столбец или нажми на карточку, а затем на столбец (или наоборот).",
      columns: [
        { id: "dolce", label: "G dolce [дж] / Мягкий [дж]" },
        { id: "dura", label: "G dura [г] / Твёрдый [г]" }
      ],
      items: [
        {
          id: "g1",
          word: "gatto",
          translit: "[гатто]",
          image: "img/gatto.jpg",
          fallbackEmoji: "🐱",
          column: "dura"
        },
        {
          id: "g2",
          word: "gioco",
          translit: "[джоко]",
          image: "img/gioco.jpg",
          fallbackEmoji: "🎲",
          column: "dolce"
        },
        {
          id: "g3",
          word: "ghiaccio",
          translit: "[гьяччо]",
          image: "img/ghiaccio.jpg",
          fallbackEmoji: "🧊",
          column: "dura"
        },
        {
          id: "g4",
          word: "giraffa",
          translit: "[джираффа]",
          image: "img/giraffa.jpg",
          fallbackEmoji: "🦒",
          column: "dolce"
        },
        {
          id: "g5",
          word: "gomma",
          translit: "[гомма]",
          image: "img/gomma.jpg",
          fallbackEmoji: "🧼",
          column: "dura"
        },
        {
          id: "g6",
          word: "giardino",
          translit: "[джардино]",
          image: "img/giardino.jpg",
          fallbackEmoji: "🌿",
          column: "dolce"
        }
      ]
    },
    {
      id: "u000_es1_s_sort",
      unitNumber: 0,
      tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (Livello base · A0)",
      type: "column_sort",
      title: "1.3 Abbinamento · Suono della S sorda [с] o sonora [з] / Распределение · Глухой [с] или звонкий [з] звук S",
      instructions: "Inserisci ogni scheda (parola + immagine) nella colonna giusta tramite drag & drop oppure cliccando sulla scheda e poi sulla colonna (o viceversa). / Перетащи карточку в нужный столбец или нажми на карточку, а затем на столбец (или наоборот).",
      columns: [
        { id: "sorda", label: "S sorda [с] / Глухой [с]" },
        { id: "sonora", label: "S sonora [з] / Звонкий [з]" }
      ],
      items: [
        {
          id: "s1",
          word: "sole",
          translit: "[соле]",
          image: "img/sole.jpg",
          fallbackEmoji: "☀️",
          column: "sorda"
        },
        {
          id: "s2",
          word: "vaso",
          translit: "[вазо]",
          image: "img/vaso.jpg",
          fallbackEmoji: "🏺",
          column: "sonora"
        },
        {
          id: "s3",
          word: "stella",
          translit: "[стелла]",
          image: "img/stella.jpg",
          fallbackEmoji: "⭐",
          column: "sorda"
        },
        {
          id: "s4",
          word: "rosa",
          translit: "[роза]",
          image: "img/rosa.jpg",
          fallbackEmoji: "🌹",
          column: "sonora"
        },
        {
          id: "s5",
          word: "scuola",
          translit: "[скуола]",
          image: "img/scuola.jpg",
          fallbackEmoji: "🏫",
          column: "sorda"
        },
        {
          id: "s6",
          word: "svizzero",
          translit: "[свиццеро]",
          image: "img/svizzero.jpg",
          fallbackEmoji: "🇨🇭",
          column: "sonora"
        }
      ]
    },
    {
      id: "u000_es1_gn_gl_qa",
      unitNumber: 0,
      tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (Livello base · A0)",
      type: "multiple_choice",
      title: "1.4 Domande su GN e GLI con trascrizione russa / Вопросы о GN и GLI с русской транскрипцией",
      instructions: "Scegli la trascrizione o la regola corretta per i gruppi GN e GLI. / Выбери правильную транскрипцию или правило для сочетаний GN и GLI.",
      items: [
        {
          id: "q1",
          prompt: "Come si legge «gn» in montagna? / Как читается «gn» в слове montagna [монтанья]?",
          options: [
            { value: "A", label: "A · [нь] (как в «конь»)" },
            { value: "B", label: "B · [гн] (как «гн»)" },
            { value: "C", label: "C · [н] (как «н»)" }
          ],
          answers: ["A"]
        },
        {
          id: "q2",
          prompt: "Qual è la trascrizione corretta di «gnomo»? / Какая транскрипция верна для «gnomo»?",
          options: [
            { value: "A", label: "A · [гномо]" },
            { value: "B", label: "B · [ньомо]" },
            { value: "C", label: "C · [номо]" }
          ],
          answers: ["B"]
        },
        {
          id: "q3",
          prompt: "Come si legge «gli» in famiglia? / Как читается «gli» в слове famiglia [фамилия]?",
          options: [
            { value: "A", label: "A · [гли] (как «гли»)" },
            { value: "B", label: "B · [ль] (мягкий звук, как в «семья»)" },
            { value: "C", label: "C · [ли] (как «ли»)" }
          ],
          answers: ["B"]
        },
        {
          id: "q4",
          prompt: "Qual è la trascrizione corretta di «luglio»? / Какая транскрипция верна для «luglio»?",
          options: [
            { value: "A", label: "A · [луглио]" },
            { value: "B", label: "B · [лульо]" },
            { value: "C", label: "C · [люльо]" }
          ],
          answers: ["B"]
        }
      ]
    },
    {
      id: "u000_es2_incastro",
      unitNumber: 0,
      tier: "Elementare",
      tierLabel: "2 · Manipolazione e riordino (Livello elementare · A0)",
      type: "gap_fill",
      title: "2.1 Incastro ortografico · c / ci / ch e g / gi / gh / Вставка буквосочетаний",
      instructions: "Completa le parole con la grafia corretta per ottenere il suono indicato tra parentesi. / Впиши правильное буквосочетание, чтобы получить звук из подсказки в скобках.",
      items: [
        { id: "q1", before: "", cue: "c / ci / ch → [чи]", after: "na [чина]", answers: ["ci"] },
        { id: "q2", before: "", cue: "c / ci / ch → [ки]", after: "esa [киеза]", answers: ["ch"] },
        { id: "q3", before: "", cue: "g / gi / gh → [джо]", after: "oco [джоко]", answers: ["gi"] },
        { id: "q4", before: "", cue: "g / gi / gh → [джи]", after: "raffa [джираффа]", answers: ["gi"] },
        { id: "q5", before: "", cue: "g / gi / gh → [гья]", after: "anda [гьянда]", answers: ["ghi"] },
        { id: "q6", before: "", cue: "g / gi / gh → [дже]", after: "rmano [джермано]", answers: ["ge"] }
      ]
    },
    {
      id: "u000_es2_plural",
      unitNumber: 0,
      tier: "Elementare",
      tierLabel: "2 · Manipolazione e riordino (Livello elementare · A0)",
      type: "gap_fill",
      title: "2.2 Pattern drill · Plurale mantenendo il suono duro [к] o [г] / Множественное число с сохранением твёрдого звука",
      instructions: "Trasforma al plurale mantenendo il suono duro [к] o [г] (aggiungi «h» dove serve). / Образуй множественное число, сохраняя твёрдый звук [к] или [г] (добавь «h», где нужно).",
      example: "Modello / Образец: un bosco [боско] → i boschi [боски]",
      items: [
        { id: "q1", before: "un fico [фико] → i ", cue: "plurale [к]", after: " [фики]", answers: ["fichi"] },
        { id: "q2", before: "un lago [лаго] → i ", cue: "plurale [г]", after: " [лаги]", answers: ["laghi"] },
        { id: "q3", before: "un fungo [фунго] → i ", cue: "plurale [г]", after: " [фунги]", answers: ["funghi"] },
        { id: "q4", before: "un banco [банко] → i ", cue: "plurale [к]", after: " [банки]", answers: ["banchi"] }
      ]
    },
    {
      id: "u000_es3_vocali",
      unitNumber: 0,
      tier: "Intermedio",
      tierLabel: "3 · Completamento e trasformazione (Livello intermedio · A0)",
      type: "gap_fill",
      title: "3.1 Cloze · Trascrizione in cirillico senza riduzione vocalica / Чтение кириллицей без редукции гласных",
      instructions: "Scrivi la pronuncia in cirillico (senza ridurre le vocali non accentate come accade in russo). / Напиши чтение кириллицей (без редукции безударных гласных, как в русском языке).",
      items: [
        { id: "q1", before: "motore → [", cue: "без редукции «о»", after: "]", answers: ["моторе"] },
        { id: "q2", before: "balcone → [", cue: "без редукции «о/е»", after: "]", answers: ["бальконе"] },
        { id: "q3", before: "musica → [", cue: "s tra vocali → [з]", after: "]", answers: ["музика"] },
        { id: "q4", before: "uovo → [", cue: "u + o + v + o", after: "]", answers: ["уово"] }
      ]
    },
    {
      id: "u000_es3_transcod",
      unitNumber: 0,
      tier: "Intermedio",
      tierLabel: "3 · Completamento e trasformazione (Livello intermedio · A0)",
      type: "gap_fill",
      title: "3.2 Transcodificazione · Dalla regola e dal suono alla parola / От правила и звука к слову",
      instructions: "Scrivi la parola italiana corrispondente all'indizio. / Впиши итальянское слово по подсказке.",
      items: [
        { id: "q1", before: "Inizia con H muta (немая H), significa «я имею»: ", cue: "[о]", after: "", answers: ["ho"] },
        { id: "q2", before: "Contiene GN [нь], significa «гном»: ", cue: "[ньомо]", after: "", answers: ["gnomo"] },
        { id: "q3", before: "Contiene GLI [ль], è un mese estivo: ", cue: "[лульо]", after: "", answers: ["luglio"] },
        { id: "q4", before: "Contiene SCI [ши], è uno sport invernale: ", cue: "[ши]", after: "", answers: ["sci"] }
      ]
    },
    {
      id: "u000_es4_spelling",
      unitNumber: 0,
      tier: "Avanzato",
      tierLabel: "4 · Produzione e interazione libera (Livello avanzato · A0)",
      type: "open_response",
      title: "4.1 Produzione guidata · Lo spelling all'hotel / Диктовка по буквам в отеле",
      instructions: "Alla reception di un hotel non capiscono bene il tuo cognome o una parola. Scrivi 2–3 frasi semplici facendo lo spelling con i nomi delle lettere italiane e aggiungi tra parentesi la lettura in cirillico. / На ресепшене отеля плохо расслышали твою фамилию или слово. Напиши 2–3 простые фразы: продиктуй слово по буквам (названиями итальянских букв) и в скобках напиши чтение кириллицей.",
      example: "Traccia / Подсказка: «Scusi, ripeto: ... Si scrive con ... [...]».",
      items: [
        {
          id: "q1",
          title: "Il tuo spelling in italiano / Твоя диктовка по буквам",
          prompt: "Scrivi 2–3 frasi indicando le lettere (es. ci, acca, i, ti, a, erre, erre, a) e la pronuncia in cirillico. / Напиши 2–3 фразы с названиями букв и чтением кириллицей."
        }
      ]
    }
  ]
};
