// Catalogo esercizi — Unità 0: Alfabeto Italiano (Livello A0 · IT / RU)
window.UNIT_EXERCISES_CATALOG = window.UNIT_EXERCISES_CATALOG || {};
window.UNIT_EXERCISES_CATALOG["0"] = {
  unitNumber: 0,
  unitSlug: "u_000",
  unitTitle: "Unità 0 · Alfabeto Italiano / Итальянский алфавит",
  level: "A0",
  description: "Fonetica, vocali pure senza riduzione, suoni duri e dolci (C/G, CH/GH, GN/GLI, SCI/SCE), H muta, S e Z con traslitterazione in cirillico. / Фонетика, чистые гласные без редукции, твёрдые и мягкие звуки, немая H, S и Z с транслитерацией кириллицей.",
  exercises: [
    {
      id: "u000_es1_mc",
      unitNumber: 0,
      tier: "Base",
      tierLabel: "1 · Riconoscimento e abbinamento (Livello base · A0)",
      type: "multiple_choice",
      title: "1.1 Scelta multipla · Suoni e lettere dell'alfabeto / Выбор ответа · Звуки и буквы",
      instructions: "Leggi la parola e scegli il suono corretto della lettera o del gruppo evidenziato. / Прочитай слово и выбери правильный звук выделенной буквы или сочетания.",
      items: [
        {
          id: "q1",
          prompt: "cinema [чинема] — come suona la C? / Как звучит C?",
          options: [
            { value: "A", label: "A · [к]" },
            { value: "B", label: "B · [ч]" },
            { value: "C", label: "C · [с]" }
          ],
          answers: ["B"]
        },
        {
          id: "q2",
          prompt: "chitarra [китарра] — perché c'è la H? / Зачем здесь H?",
          options: [
            { value: "A", label: "A · Per fare [ч]" },
            { value: "B", label: "B · Per mantenere il suono duro [к] davanti a «i» / Чтобы сохранить твёрдый [к] перед «i»" },
            { value: "C", label: "C · Per allungare la «i»" }
          ],
          answers: ["B"]
        },
        {
          id: "q3",
          prompt: "gatto [гатто] — come suona la G? / Как звучит G?",
          options: [
            { value: "A", label: "A · [дж]" },
            { value: "B", label: "B · [г]" },
            { value: "C", label: "C · È muta / Не произносится" }
          ],
          answers: ["B"]
        },
        {
          id: "q4",
          prompt: "ghiaccio [гьяччо] — come suona «ghi»? / Как звучит «ghi»?",
          options: [
            { value: "A", label: "A · Suono duro [г] + vocale / Твёрдый [г] + гласный" },
            { value: "B", label: "B · Suono dolce [дж] + vocale / Мягкий [дж] + гласный" },
            { value: "C", label: "C · Suono [ль]" }
          ],
          answers: ["A"]
        },
        {
          id: "q5",
          prompt: "montagna [монтанья] — come suona «gn»? / Как звучит «gn»?",
          options: [
            { value: "A", label: "A · [нь] (come in «конь»)" },
            { value: "B", label: "B · [гн]" },
            { value: "C", label: "C · [н]" }
          ],
          answers: ["A"]
        },
        {
          id: "q6",
          prompt: "coniglio [конильо] — come suona «gli»? / Как звучит «gli»?",
          options: [
            { value: "A", label: "A · [гли]" },
            { value: "B", label: "B · [ль] (come in «семья»)" },
            { value: "C", label: "C · [ли]" }
          ],
          answers: ["B"]
        },
        {
          id: "q7",
          prompt: "scena [шена] — come suona «sce»? / Как звучит «sce»?",
          options: [
            { value: "A", label: "A · [ске]" },
            { value: "B", label: "B · [ше] (come «шэ»)" },
            { value: "C", label: "C · [се]" }
          ],
          answers: ["B"]
        },
        {
          id: "q8",
          prompt: "vaso [вазо] — come suona la S tra due vocali? / Как звучит S между двумя гласными?",
          options: [
            { value: "A", label: "A · [с]" },
            { value: "B", label: "B · [з]" },
            { value: "C", label: "C · [ш]" }
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
