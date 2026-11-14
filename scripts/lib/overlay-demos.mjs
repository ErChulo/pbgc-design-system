// Static HTML for the overlay and feedback components in the single-file reference page.
// The markup is the same contract the React components render; src/behaviors/index.js supplies the behavior.
const infoIcon = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

const dialog = (id, title, mods, body, footer) => `
  <dialog id="${id}" class="pbgc-dialog${mods}" aria-labelledby="${id}-t" data-pbgc-dialog>
    <div class="pbgc-dialog__panel">
      <header class="pbgc-dialog__header">
        <h2 id="${id}-t" class="pbgc-dialog__title">${title}</h2>
        <button type="button" class="pbgc-dialog__close" data-pbgc-close><span aria-hidden="true">&times;</span><span class="pbgc-sr-only">Close dialog</span></button>
      </header>
      <div class="pbgc-dialog__body">${body}</div>
      <footer class="pbgc-dialog__footer">${footer}</footer>
    </div>
  </dialog>`;

export const overlayDemos = `
    <h3 style="margin-top:2rem">Dialog and drawer</h3>
    <div class="ref-demo" id="demo-dialog">
      <div class="ref-row">
        <button type="button" class="pbgc-button pbgc-button--primary" data-pbgc-open="dlg-sample">Open dialog</button>
        <button type="button" class="pbgc-button pbgc-button--secondary" data-pbgc-open="dlg-drawer">Open drawer</button>
      </div>
      ${dialog('dlg-sample', 'Sample dialog', '', '<p>This is sample dialog content. Focus is trapped here until the dialog closes, then returns to the button that opened it.</p>',
        '<button type="button" class="pbgc-button pbgc-button--secondary" data-pbgc-close>Cancel</button><button type="button" class="pbgc-button pbgc-button--primary" data-pbgc-close>Save</button>')}
      ${dialog('dlg-drawer', 'Sample drawer', ' pbgc-dialog--drawer', '<p>A drawer is the same element docked to the side.</p>',
        '<button type="button" class="pbgc-button pbgc-button--primary" data-pbgc-close>Done</button>')}
    </div>

    <h3 style="margin-top:2rem">Spinner, progress bar, skeleton</h3>
    <div class="ref-demo" id="demo-loading">
      <span class="pbgc-spinner-wrap pbgc-spinner-wrap--md" role="status"><span class="pbgc-spinner" aria-hidden="true"></span><span class="pbgc-spinner__label">Loading plan data</span></span>
      <div class="pbgc-progress"><label for="pg1" class="pbgc-progress__label">Importing sample rows</label><div class="pbgc-progress__row"><progress id="pg1" class="pbgc-progress__bar" max="100" value="42"></progress><span class="pbgc-progress__value">42%</span></div></div>
      <div class="pbgc-progress"><label for="pg2" class="pbgc-progress__label">Working on it</label><div class="pbgc-progress__row"><progress id="pg2" class="pbgc-progress__bar" max="100"></progress></div></div>
      <div class="pbgc-skeleton" role="status"><span class="pbgc-sr-only">Loading summary</span><span class="pbgc-skeleton__line" aria-hidden="true"></span><span class="pbgc-skeleton__line" aria-hidden="true"></span><span class="pbgc-skeleton__line" aria-hidden="true"></span></div>
    </div>

    <h3 style="margin-top:2rem">Action menu</h3>
    <div class="ref-demo" id="demo-menu" style="min-height:14rem">
      <div class="pbgc-menu" data-pbgc-menu>
        <button type="button" id="m1-btn" class="pbgc-button pbgc-button--secondary pbgc-menu__trigger" aria-haspopup="menu" aria-expanded="false" aria-controls="m1-list">Actions<span class="pbgc-menu__caret" aria-hidden="true"></span></button>
        <div id="m1-list" class="pbgc-menu__list" role="menu" aria-labelledby="m1-btn" popover="manual">
          <button type="button" role="menuitem" tabindex="-1" data-value="view" class="pbgc-menu__item">View details</button>
          <button type="button" role="menuitem" tabindex="-1" data-value="download" class="pbgc-menu__item">Download copy</button>
          <button type="button" role="menuitem" tabindex="-1" data-value="archive" class="pbgc-menu__item" aria-disabled="true">Archive</button>
          <button type="button" role="menuitem" tabindex="-1" data-value="delete" class="pbgc-menu__item pbgc-menu__item--danger">Delete</button>
        </div>
      </div>
    </div>

    <h3 style="margin-top:2rem">Tooltip and toggletip</h3>
    <div class="ref-demo" id="demo-tooltip" style="padding-top:4rem">
      <div class="ref-row">
        <span class="pbgc-tooltip-host" data-pbgc-tooltip>
          <button type="button" class="pbgc-button pbgc-button--secondary" aria-describedby="tip1">Save draft</button>
          <span id="tip1" role="tooltip" class="pbgc-tooltip" popover="manual">Saves your changes without submitting.</span>
        </span>
        <span id="demo-toggletip">Sample maximum guarantee
          <span class="pbgc-toggletip" data-pbgc-toggletip>
            <button type="button" class="pbgc-toggletip__button" aria-expanded="false" aria-controls="tg1">${infoIcon}<span class="pbgc-sr-only">More information: sample maximum guarantee</span></button>
            <div id="tg1" class="pbgc-toggletip__panel" popover="manual"><p>Sample help text. A toggletip can hold a short paragraph and a <a href="#demo-toggletip">link</a>.</p></div>
          </span>
        </span>
      </div>
    </div>

    <h3 style="margin-top:2rem">File picker</h3>
    <div class="ref-demo" id="demo-filepicker">
      <div class="pbgc-filepicker" data-pbgc-filepicker data-max-size-mb="5">
        <label for="fp1" class="pbgc-filepicker__label">Sample data files</label>
        <p id="fp1-hint" class="pbgc-filepicker__hint">CSV or XLSX, up to 5 MB each. Files stay on your computer.</p>
        <div class="pbgc-filepicker__zone">
          <input id="fp1" class="pbgc-filepicker__input" type="file" accept=".csv,.xlsx" multiple aria-describedby="fp1-hint">
          <span class="pbgc-filepicker__prompt" aria-hidden="true">Drag files here, or</span>
          <span class="pbgc-button pbgc-button--secondary" aria-hidden="true">Choose files</span>
        </div>
        <div class="pbgc-filepicker__errors" data-fp-errors></div>
        <ul class="pbgc-filepicker__list" data-fp-list aria-label="Selected files" hidden></ul>
        <p class="pbgc-sr-only" role="status" data-fp-status></p>
      </div>
    </div>

    <h3 style="margin-top:2rem">Carousel</h3>
    <div class="ref-demo" id="demo-carousel">
      <section class="pbgc-carousel" data-pbgc-carousel aria-roledescription="carousel" aria-label="Sample items">
        <div class="pbgc-carousel__track" tabindex="0" role="group" aria-label="Sample items, slides">
          <div class="pbgc-carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3"><h4>Sample slide 1</h4><p>Sample content for slide one. There is no autoplay; people move between slides themselves.</p></div>
          <div class="pbgc-carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3"><h4>Sample slide 2</h4><p>Sample content for slide two.</p></div>
          <div class="pbgc-carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3"><h4>Sample slide 3</h4><p>Sample content for slide three.</p></div>
        </div>
        <div class="pbgc-carousel__controls">
          <button type="button" class="pbgc-button pbgc-button--secondary" data-carousel-prev aria-disabled="true">Previous</button>
          <p class="pbgc-carousel__status" role="status" data-carousel-status>Slide 1 of 3</p>
          <button type="button" class="pbgc-button pbgc-button--secondary" data-carousel-next>Next</button>
        </div>
      </section>
    </div>

    <h3 style="margin-top:2rem">Toast</h3>
    <div class="ref-demo" id="demo-toast">
      <div class="ref-row">
        <button type="button" class="pbgc-button pbgc-button--primary" data-toast="info">Info</button>
        <button type="button" class="pbgc-button pbgc-button--primary" data-toast="success">Success</button>
        <button type="button" class="pbgc-button pbgc-button--primary" data-toast="warning">Warning</button>
        <button type="button" class="pbgc-button pbgc-button--danger" data-toast="error">Error</button>
        <button type="button" class="pbgc-button pbgc-button--secondary" data-toast="clear">Clear all</button>
      </div>
      <p class="pbgc-small pbgc-muted">Info and success dismiss themselves after 10 seconds (hover or focus pauses them). Warning and error stay until dismissed.</p>
    </div>
`;

export const overlayDemoScript = `
  document.querySelectorAll('[data-toast]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-toast');
      if (v === 'clear') { PBGC.toast.clear(); return; }
      var title = { info: 'Sample report ready', success: 'Sample changes saved', warning: 'Sample warning', error: 'Sample error' }[v];
      PBGC.toast.show({ variant: v, title: title, message: v === 'info' ? 'This sample disappears after 10 seconds.' : '' });
    });
  });
  PBGC.init();
`;
