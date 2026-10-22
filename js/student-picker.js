/**
 * student-picker.js
 * Reusable autocomplete student picker — component "(1)" in requirements.
 * Works globally with window.db and window.i18n
 */

(function (root) {
  let allStudents = [];

  function loadStudents(forceRefresh = false) {
    if (!forceRefresh && allStudents.length > 0) return Promise.resolve(allStudents);
    allStudents = root.db ? root.db.getStudents() : [];
    return Promise.resolve(allStudents);
  }

  function resetStudentCache() {
    allStudents = [];
  }

  function createStudentPicker(container, options = {}) {
    const {
      multiSelect = false,
      onChange,
      placeholder = null,
      defaultAll = false,
    } = options;

    const t = root.i18n ? root.i18n.t : (k => k);

    return loadStudents(true).then(() => {
      const selected = new Set();

      if (defaultAll && multiSelect) {
        allStudents.forEach(s => selected.add(s.id));
      }

      function getPlaceholder() {
        return placeholder || t('pickerPlaceholder');
      }

      function renderPickerUI() {
        container.innerHTML = `
          <div class="picker-wrapper">
            <div class="picker-input-row">
              <input type="text" class="form-control picker-input"
                     placeholder="${getPlaceholder()}" autocomplete="off">
              ${multiSelect ? `
                <button type="button" class="btn btn-sm btn-secondary picker-select-all">${t('pickerSelectAll')}</button>
                <button type="button" class="btn btn-sm btn-secondary picker-clear-all">${t('pickerDeselectAll')}</button>
              ` : ''}
            </div>
            <div class="picker-dropdown hidden" role="listbox"></div>
            ${multiSelect ? '<div class="picker-selected-tags"></div>' : ''}
          </div>
        `;

        bindEvents();
        renderTags();
      }

      function getSelected() {
        return allStudents.filter(s => selected.has(s.id));
      }

      function notify() {
        if (typeof onChange === 'function') onChange(getSelected());
      }

      function renderTags() {
        const tagsContainer = container.querySelector('.picker-selected-tags');
        if (!tagsContainer) return;
        const current = getSelected();
        tagsContainer.innerHTML = current.map(s => `
          <span class="picker-tag" data-id="${s.id}">
            ${s.ho_ten}
            <button type="button" class="picker-tag-remove" data-id="${s.id}" aria-label="Xoá">&times;</button>
          </span>
        `).join('');

        tagsContainer.querySelectorAll('.picker-tag-remove').forEach(btn => {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            selected.delete(btn.dataset.id);
            renderTags();
            const input = container.querySelector('.picker-input');
            renderDropdown(input ? input.value : '');
            notify();
          });
        });
      }

      function renderDropdown(query) {
        const dropdown = container.querySelector('.picker-dropdown');
        if (!dropdown) return;

        const q = query.toLowerCase().trim();
        let filtered = allStudents;
        if (q) {
          filtered = allStudents.filter(s =>
            s.ho_ten.toLowerCase().includes(q) ||
            s.ma_hs.toLowerCase().includes(q) ||
            String(s.to_so).includes(q) ||
            `tổ ${s.to_so}`.toLowerCase().includes(q)
          );
        }

        if (!q && !multiSelect) {
          dropdown.classList.add('hidden');
          return;
        }

        dropdown.classList.remove('hidden');

        if (!filtered.length) {
          dropdown.innerHTML = `<div class="picker-item picker-no-result">${t('pickerNoResult')}</div>`;
          return;
        }

        dropdown.innerHTML = filtered.map(s => {
          const isSel = selected.has(s.id);
          return `
            <div class="picker-item ${isSel ? 'selected' : ''}" data-id="${s.id}" role="option" aria-selected="${isSel}">
              <span class="picker-item-name">${s.ho_ten}</span>
              <span class="picker-item-meta">${s.ma_hs} · Tổ ${s.to_so}</span>
              ${multiSelect && isSel ? '<span class="picker-item-check" aria-hidden="true">✓</span>' : ''}
            </div>
          `;
        }).join('');

        dropdown.querySelectorAll('.picker-item[data-id]').forEach(item => {
          item.addEventListener('click', () => {
            const id = item.dataset.id;
            const input = container.querySelector('.picker-input');
            if (multiSelect) {
              if (selected.has(id)) selected.delete(id);
              else selected.add(id);
              renderTags();
              renderDropdown(input.value);
            } else {
              selected.clear();
              selected.add(id);
              const s = allStudents.find(x => x.id === id);
              if (input) input.value = s ? s.ho_ten : '';
              dropdown.classList.add('hidden');
            }
            notify();
          });
        });
      }

      function bindEvents() {
        const input = container.querySelector('.picker-input');
        const dropdown = container.querySelector('.picker-dropdown');

        input?.addEventListener('input', () => renderDropdown(input.value));
        input?.addEventListener('focus', () => renderDropdown(input.value));

        container.querySelector('.picker-select-all')?.addEventListener('click', () => {
          allStudents.forEach(s => selected.add(s.id));
          renderTags();
          renderDropdown(input.value);
          notify();
        });

        container.querySelector('.picker-clear-all')?.addEventListener('click', () => {
          selected.clear();
          renderTags();
          renderDropdown(input.value);
          notify();
        });

        document.addEventListener('click', e => {
          if (!container.contains(e.target)) {
            dropdown?.classList.add('hidden');
          }
        });
      }

      renderPickerUI();

      if (root.i18n && typeof root.i18n.onLangChange === 'function') {
        root.i18n.onLangChange(() => {
          renderPickerUI();
        });
      }

      return {
        getSelected,
        setSelected(ids) {
          selected.clear();
          ids.forEach(id => selected.add(id));
          renderTags();
          const input = container.querySelector('.picker-input');
          if (input && !multiSelect) {
            const s = allStudents.find(x => selected.has(x.id));
            input.value = s ? s.ho_ten : '';
          }
        },
        clear() {
          selected.clear();
          const input = container.querySelector('.picker-input');
          if (input) input.value = '';
          renderTags();
          const dropdown = container.querySelector('.picker-dropdown');
          dropdown?.classList.add('hidden');
          notify();
        },
      };
    });
  }

  root.studentPicker = {
    loadStudents,
    resetStudentCache,
    createStudentPicker
  };
})(typeof window !== 'undefined' ? window : this);
