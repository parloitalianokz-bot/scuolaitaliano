// Motori esterni per il rendering degli esercizi nei compiti dinamici e nelle pagine di unità
(function (global) {
  "use strict";

    const ExerciseEngines = {
    matching(ctx) {
      const { ex, savedAnswers, disabled, onChangeItem } = ctx;
      const wrap = document.createElement("div");
      (ex.items || []).forEach((item, idx) => {
        const block = document.createElement("div");
        block.className = "item-block";
        const label = document.createElement("label");
        label.className = "gap-line";
        const prompt = document.createElement("strong");
        prompt.textContent = `${idx + 1}. ${item.prompt} `;
        const select = document.createElement("select");
        select.className = "matching-select";
        select.disabled = disabled;
        select.appendChild(new Option("— scegli / выбери —", ""));
        (ex.options || []).forEach(option => select.appendChild(new Option(option.label, option.value)));
        select.value = savedAnswers[item.id] || "";
        select.addEventListener("change", () => onChangeItem(item.id, select.value));
        label.append(prompt, select);
        block.appendChild(label);
        wrap.appendChild(block);
      });
      return wrap;
    },

    table_fill(ctx) {
      const { ex, savedAnswers, disabled, onChangeItem } = ctx;
      const wrap = document.createElement("div");
      wrap.className = "homework-table-wrap";
      const table = document.createElement("table");
      table.className = "homework-data-table";
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      (ex.columns || []).forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      (ex.items || []).forEach(item => {
        const tr = document.createElement("tr");
        (item.cells || []).forEach(cell => {
          const td = document.createElement("td");
          if (cell && typeof cell === "object" && cell.input) {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "gap-input";
            input.value = savedAnswers[item.id] || "";
            input.disabled = disabled;
            input.setAttribute("aria-label", item.prompt || "Risposta / Ответ");
            input.addEventListener("input", () => onChangeItem(item.id, input.value));
            td.appendChild(input);
          } else {
            td.textContent = cell == null ? "" : String(cell);
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      return wrap;
    },

    word_order(ctx) {
      const { ex, savedAnswers, disabled, onChangeItem } = ctx;
      const wrap = document.createElement("div");
      wrap.className = "word-order-list";
      (ex.items || []).forEach((item, idx) => {
        const block = document.createElement("section");
        block.className = "answer-form-card word-order-card";
        const header = document.createElement("div");
        header.className = "answer-form-header";
        const prompt = document.createElement("strong");
        prompt.className = "word-order-prompt";
        prompt.textContent = `${idx + 1}. ${item.prompt || ""}`;
        header.appendChild(prompt);
        const built = document.createElement("div");
        built.className = "word-order-built";
        built.setAttribute("aria-live", "polite");
        const tray = document.createElement("div");
        tray.className = "word-order-bank";
        const savedOrder = savedAnswers[item.id];
        const words = savedOrder && !Array.isArray(savedOrder) && Array.isArray(savedOrder.words)
          ? savedOrder.words
          : (item.words || []);
        let selected = Array.isArray(savedOrder)
          ? savedOrder.filter(position => Number.isInteger(position) && position >= 0 && position < words.length)
          : savedOrder && Array.isArray(savedOrder.order)
            ? savedOrder.order.filter(position => Number.isInteger(position) && position >= 0 && position < words.length)
            : [];
        const saveSelection = () => onChangeItem(item.id, { words: [...words], order: [...selected] });
        const redraw = () => {
          built.textContent = selected.map(position => words[position]).join(" ") || "Tocca le parole per comporre la frase…";
          built.classList.toggle("is-empty", selected.length === 0);
          tray.replaceChildren();
          words.forEach((word, position) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "word-order-token";
            button.textContent = word;
            const isSelected = selected.includes(position);
            button.disabled = disabled;
            button.setAttribute("aria-pressed", String(isSelected));
            button.addEventListener("click", () => {
              if (disabled) return;
              selected = isSelected
                ? selected.filter(selectedPosition => selectedPosition !== position)
                : [...selected, position];
              saveSelection();
              redraw();
            });
            tray.appendChild(button);
          });
        };
        const actions = document.createElement("div");
        actions.className = "word-order-actions";
        const undo = document.createElement("button");
        undo.type = "button";
        undo.className = "word-order-action";
        undo.textContent = "↩ Annulla ultima / Отменить последнее";
        undo.disabled = disabled;
        undo.addEventListener("click", () => {
          selected.pop();
          saveSelection();
          redraw();
        });
        const reset = document.createElement("button");
        reset.type = "button";
        reset.className = "word-order-action";
        reset.textContent = "Ricomincia / Начать заново";
        reset.disabled = disabled;
        reset.addEventListener("click", () => {
          selected = [];
          saveSelection();
          redraw();
        });
        actions.append(undo, reset);
        block.append(header, built, tray, actions);
        wrap.appendChild(block);
        redraw();
      });
      return wrap;
    },

    multiple_choice(ctx) {
      const { ex, savedAnswers, disabled, onChangeItem } = ctx;
      const wrap = document.createElement("div");

      (ex.items || []).forEach((item, idx) => {
        const block = document.createElement("div");
        block.className = "item-block";
        const savedVal = savedAnswers[item.id] || "";

                const q = document.createElement("div");
         q.className = "mc-question";
         const number = document.createElement("strong");
         number.textContent = `${idx + 1}. `;
         q.append(number, document.createTextNode(item.prompt || ""));
         block.appendChild(q);

         const opts = document.createElement("div");
         opts.className = "mc-options";
         const radioName = `${ex.id}_${item.id}`;

         (item.options || []).forEach((opt) => {
           const lbl = document.createElement("label");
           lbl.className = "mc-label";
           const radio = document.createElement("input");
           radio.type = "radio";
           radio.name = radioName;
           radio.value = opt.value;
           radio.checked = savedVal === opt.value;
           radio.disabled = disabled;
           radio.addEventListener("change", () => onChangeItem(item.id, opt.value));

           const optionMatch = String(opt.label).match(/^([a-z])\s*[·.)-]\s*(.*)$/i);
           const letter = document.createElement("span");
           letter.className = "mc-option-letter";
           letter.textContent = optionMatch ? optionMatch[1] : String(opt.value);
           const text = document.createElement("span");
           text.className = "mc-option-text";
           text.textContent = optionMatch ? optionMatch[2] : opt.label;
           lbl.append(radio, letter, text);
           opts.appendChild(lbl);
         });

        block.appendChild(opts);
        wrap.appendChild(block);
      });

      return wrap;
    },

    gap_fill(ctx) {
      const { ex, savedAnswers, disabled, onChangeItem } = ctx;
      const wrap = document.createElement("div");

      (ex.items || []).forEach((item, idx) => {
        const block = document.createElement("div");
        block.className = "item-block";
        const savedVal = savedAnswers[item.id] || "";

        const line = document.createElement("div");
        line.className = "gap-line";
        line.appendChild(Object.assign(document.createElement("strong"), { textContent: `${idx + 1}.` }));
        if (item.before) line.appendChild(document.createTextNode(item.before));

        const input = document.createElement("input");
        input.type = "text";
        input.className = "gap-input";
        input.value = savedVal;
        input.disabled = disabled;
        input.addEventListener("input", () => onChangeItem(item.id, input.value));
        line.appendChild(input);

        if (item.after) line.appendChild(document.createTextNode(item.after));
                if (item.cue) {
          const cue = document.createElement("span");
          cue.className = "gap-cue";
          cue.textContent = `(${item.cue})`;
          line.appendChild(cue);
        }

        block.appendChild(line);
        if (item.prompt) {
          const hint = document.createElement("p");
          hint.className = "item-hint";
          hint.textContent = item.prompt;
          block.appendChild(hint);
        }
        wrap.appendChild(block);
      });

      return wrap;
    },

        open_response(ctx) {
      const { ex, savedAnswers, disabled, onChangeItem } = ctx;
      const wrap = document.createElement("div");
      wrap.className = "open-response-list";

      (ex.items || []).forEach((item, idx) => {
        const block = document.createElement("section");
        block.className = "answer-form-card open-response-card";
        const header = document.createElement("div");
        header.className = "answer-form-header";
        const h3 = document.createElement("h3");
        h3.className = "open-response-title";
        h3.textContent = item.title || `Risposta ${idx + 1}`;
        header.appendChild(h3);

        const p = document.createElement("p");
        p.className = "open-response-prompt";
        p.textContent = item.prompt || "";

        const ta = document.createElement("textarea");
        ta.className = "answer-input open-input";
        ta.value = savedAnswers[item.id] || "";
        ta.disabled = disabled;
        ta.setAttribute("aria-label", item.title || `Risposta ${idx + 1}`);
        ta.addEventListener("input", () => onChangeItem(item.id, ta.value));

        block.append(header, p, ta);
        wrap.appendChild(block);
      });

      return wrap;
    },

    column_sort(ctx) {
      const { ex, savedAnswers, disabled, activePick, onPickChange, onChangeWhole } = ctx;
      const placementMap = {
        ...(savedAnswers && typeof savedAnswers === "object" ? savedAnswers : {})
      };

      const wrap = document.createElement("div");

      function buildTile(item) {
        const isSelectedCard = activePick && activePick.kind === "card" && activePick.id === item.id;
        const tile = document.createElement("div");
        tile.className = `word-tile${isSelectedCard ? " selected-tile" : ""}`;
        tile.draggable = !disabled;

        tile.addEventListener("dragstart", (e) => {
          if (disabled) return;
          e.dataTransfer.setData("text/plain", item.id);
        });

        const img = document.createElement("img");
        img.src = `u_000/${item.image}`;
        img.alt = item.word;

        const emoji = document.createElement("div");
        emoji.className = "tile-emoji";
        emoji.textContent = item.fallbackEmoji || "🇮🇹";
        emoji.hidden = true;

        img.addEventListener("error", () => {
          img.hidden = true;
          emoji.hidden = false;
        });

        const wordEl = document.createElement("div");
        wordEl.className = "tile-word";
        wordEl.textContent = item.word;

        const trEl = document.createElement("div");
        trEl.className = "tile-translit";
        trEl.textContent = item.translit || "";

        tile.append(img, emoji, wordEl, trEl);

        tile.addEventListener("click", (e) => {
          if (disabled) return;
          if (e.target.closest(".tile-btn")) return;
          if (activePick && activePick.kind === "col") {
            placementMap[item.id] = activePick.id;
            onPickChange(null);
            onChangeWhole({ ...placementMap });
            return;
          }
          onPickChange(isSelectedCard ? null : { kind: "card", id: item.id });
        });

        if (placementMap[item.id] && !disabled) {
          const actions = document.createElement("div");
          actions.className = "tile-actions";
          const backBtn = document.createElement("button");
          backBtn.type = "button";
          backBtn.className = "tile-btn";
          backBtn.textContent = "↩";
          backBtn.title = "Riporta in alto";
          backBtn.addEventListener("click", () => {
            delete placementMap[item.id];
            onChangeWhole({ ...placementMap });
          });
          actions.appendChild(backBtn);
          tile.appendChild(actions);
        }

        return tile;
      }

      const unassigned = (ex.items || []).filter((it) => !placementMap[it.id]);
      const pool = document.createElement("div");
      pool.className = "sort-pool";
      pool.addEventListener("dragover", (e) => e.preventDefault());
      pool.addEventListener("drop", (e) => {
        e.preventDefault();
        if (disabled) return;
        const itemId = e.dataTransfer.getData("text/plain");
        if (itemId && placementMap[itemId]) {
          delete placementMap[itemId];
          onChangeWhole({ ...placementMap });
        }
      });

      unassigned.forEach((item) => pool.appendChild(buildTile(item)));
      if (!unassigned.length) {
        const doneNote = document.createElement("div");
        doneNote.className = "note";
        doneNote.textContent =
          "Tutte le schede sono state inserite nelle colonne. / Все карточки распределены по столбцам.";
        pool.appendChild(doneNote);
      }
      wrap.appendChild(pool);

      const colsWrap = document.createElement("div");
      colsWrap.className = "sort-columns";

      (ex.columns || []).forEach((col) => {
        const colBox = document.createElement("div");
        const isArmedCol = activePick && activePick.kind === "col" && activePick.id === col.id;
        colBox.className = `sort-col${isArmedCol ? " armed-target" : ""}`;

        colBox.addEventListener("dragover", (e) => {
          e.preventDefault();
          colBox.classList.add("drag-over");
        });
        colBox.addEventListener("dragleave", () => colBox.classList.remove("drag-over"));
        colBox.addEventListener("drop", (e) => {
          e.preventDefault();
          colBox.classList.remove("drag-over");
          if (disabled) return;
          const itemId = e.dataTransfer.getData("text/plain");
          if (itemId) {
            placementMap[itemId] = col.id;
            onPickChange(null);
            onChangeWhole({ ...placementMap });
          }
        });

        colBox.addEventListener("click", () => {
          if (disabled) return;
          if (activePick && activePick.kind === "card") {
            placementMap[activePick.id] = col.id;
            onPickChange(null);
            onChangeWhole({ ...placementMap });
          } else {
            onPickChange(isArmedCol ? null : { kind: "col", id: col.id });
          }
        });

        const header = document.createElement("div");
        header.className = "sort-col-header";
        header.innerHTML = `<span>${col.label}</span><span>${isArmedCol ? "✓" : ""}</span>`;
        colBox.appendChild(header);

        const colCards = document.createElement("div");
        colCards.className = "sort-col-cards";
        (ex.items || [])
          .filter((it) => placementMap[it.id] === col.id)
          .forEach((it) => colCards.appendChild(buildTile(it)));
        colBox.appendChild(colCards);
        colsWrap.appendChild(colBox);
      });

      wrap.appendChild(colsWrap);
      return wrap;
    }
  };

  function renderExerciseBody(ctx) {
    const renderer = ExerciseEngines[ctx.ex.type];
    if (!renderer) {
      const fallback = document.createElement("div");
      fallback.className = "item-block";
      fallback.textContent = `Tipo di esercizio non supportato: ${ctx.ex.type}`;
      return fallback;
    }
    return renderer(ctx);
  }

  global.ExerciseEngines = ExerciseEngines;
  global.renderExerciseBody = renderExerciseBody;
})(window);
