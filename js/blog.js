// assets/js/blog.js
// Fetch blog JSON and populate blog page fields
document.addEventListener('DOMContentLoaded', async function() {
  // Try multiple candidate endpoints because relative/absolute path differs when
  // opening the file via file:// vs running a local server.
  const candidates = [
    '/api/blogs/a.json',
    'api/blogs/a.json',
    './api/blogs/a.json',
    'assets/api/blogs/a.json',
    './assets/api/blogs/a.json'
  ];

  // (no on-page status element; keep debugging output in the console only)

  async function tryFetch(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  console.info('Loaded blog JSON from', url);
  return json;
    } catch (err) {
      console.debug('fetch failed for', url, err);
      return null;
    }
  }

  let data = null;
  for (const c of candidates) {
    data = await tryFetch(c);
    if (data) break;
  }

  if (!data) {
    console.warn('All fetch attempts failed. Check that /api/blogs/a.json is being served by your server.');
    return;
  }

  // Populate page fields with data
  const heroH1 = document.querySelector('.blog-hero .hero-text h1');
  if (heroH1 && data.headline) heroH1.textContent = data.headline;

  // Inject category/tags as hidden metadata on the hero H1 (kept for accessibility/SEO)
  function injectHiddenMeta(el, categories, tags) {
    if (!el) return;
    // attach as data attributes for easy selection later if needed
    if (categories) el.setAttribute('data-categories', Array.isArray(categories) ? categories.join(',') : String(categories));
    if (tags) el.setAttribute('data-tags', Array.isArray(tags) ? tags.join(',') : String(tags));

    // remove any previous hidden meta nodes we added earlier
    const prev = el.querySelectorAll('.hidden-meta');
    prev.forEach(n => n.remove());

    // create a visually-hidden container holding category and tag text
    const container = document.createElement('span');
    container.className = 'hidden-meta visually-hidden';
    const parts = [];
    if (categories && categories.length) parts.push('Categories: ' + categories.join(', '));
    if (tags && tags.length) parts.push('Tags: ' + tags.join(', '));
    if (parts.length === 0) return;
    container.textContent = parts.join('. ');
    el.appendChild(container);
  }

  // populate hero lead from 'headline-support' if available
  const heroLead = document.querySelector('.blog-hero .hero-text .lead');
  if (heroLead && data['headline-support']) heroLead.textContent = data['headline-support'];

  let contentH2 = document.querySelector('.content-text h2');
  // If titles are provided per-paragraph (object), remove the outer H2 to avoid duplication.
  if (contentH2) {
    if (typeof data.title === 'string') {
      contentH2.textContent = data.title;
    } else if (typeof data.title === 'object' && data.title !== null) {
      // remove static outer title that may be present in the markup
      contentH2.remove();
      contentH2 = null;
    }
  }

  // Inject category/tags into hero (and into article H2 only if it still exists)
  injectHiddenMeta(heroH1, data.category || data.categories || [], data.tags || []);
  if (contentH2) injectHiddenMeta(contentH2, data.category || data.categories || [], data.tags || []);

  // Prepare a function that will build a formatted <time> node for a given date string.
  // Supports either a single date string (data.date) or an object with per-paragraph dates
  // like data.date['Paragraph 1'] / data.date['Paragraph 2'].
  function makePostTimeNode(dateStr) {
    const timeEl = document.createElement('time');
    timeEl.className = 'post-date';
    if (!dateStr) return timeEl;
    timeEl.setAttribute('datetime', dateStr);
    const d = new Date(dateStr);
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    timeEl.textContent = isNaN(d) ? dateStr : d.toLocaleDateString(undefined, opts);
    return timeEl;
  }

  // Build templates for Paragraph 1 and Paragraph 2 dates (if provided). Fall back
  // to the global data.date when paragraph-specific date is missing.
  let dateP1 = null;
  let dateP2 = null;
  if (data.date && typeof data.date === 'object') {
    dateP1 = makePostTimeNode(data.date['Paragraph 1'] || data.date['paragraph 1'] || data.date['paragraph1'] || data.date[0] || null);
    dateP2 = makePostTimeNode(data.date['Paragraph 2'] || data.date['paragraph 2'] || data.date['paragraph2'] || null);
  } else if (data.date) {
    // single date provided — use for both paragraphs
    dateP1 = makePostTimeNode(data.date);
    dateP2 = makePostTimeNode(data.date);
  }

  if (data.img) {
    const contentImage = document.querySelector('.content-image img');
    if (contentImage) contentImage.src = data.img;
  }

  // Populate main article content from JSON 'content' field
  if (data.content) {
    const contentContainer = document.querySelector('.content-text');
    if (contentContainer) {
      // Remove existing paragraph(s) so we replace with JSON content
      const existingP = contentContainer.querySelectorAll('p');
      existingP.forEach(p => p.remove());

      // Basic sanitize/escape function for text content
      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      // Handle new object-shaped content (Paragraph 1 / Paragraph 2) or fallback to string
      if (typeof data.content === 'string') {
        // backward compatible: split into paragraphs
        const paragraphs = data.content.split(/\n\n|\r\n\r\n/).map(s => s.trim()).filter(Boolean);
        if (paragraphs.length === 0) paragraphs.push(data.content);
        paragraphs.forEach(text => {
          const p = document.createElement('p');
          p.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
          contentContainer.insertBefore(p, contentContainer.querySelector('.read-more-btn'));
        });
      } else if (typeof data.content === 'object' && data.content !== null) {
        // Map Paragraph 1 into the current article content
        const p1 = data.content['Paragraph 1'] || data.content['paragraph 1'] || data.content['paragraph1'] || data.content[0] || '';
        if (p1) {
          // insert section title (h3) if available
          let title1 = '';
          if (typeof data.title === 'object' && data.title !== null) {
            title1 = data.title['Paragraph 1'] || data.title['paragraph 1'] || data.title['paragraph1'] || '';
          } else if (typeof data.title === 'string') {
            title1 = data.title;
          }
          if (title1) {
            const h3 = document.createElement('h3');
            h3.className = 'section-title';
            h3.textContent = title1;
            contentContainer.appendChild(h3);
          }
          const p = document.createElement('p');
          p.innerHTML = escapeHtml(p1).replace(/\n/g, '<br>');
          contentContainer.appendChild(p);
          // remove only the original static .post-date that may be present as a direct
          // child of contentContainer (so we don't accidentally remove freshly-inserted ones)
          try {
            const staticDate = contentContainer.querySelector(':scope > .post-date');
            if (staticDate) staticDate.remove();
          } catch (e) {
            // older browsers may not support :scope in querySelector - fallback
            const firstDate = contentContainer.querySelector('.post-date');
            if (firstDate) firstDate.remove();
          }
          // insert paragraph-specific date immediately after the paragraph element
          if (dateP1) p.insertAdjacentElement('afterend', dateP1.cloneNode(true));
        }

        // Set content image for Paragraph 1 if present
        let img1 = null;
        if (data.img && typeof data.img === 'object') {
          img1 = data.img['Paragraph 1'] || data.img['paragraph 1'] || data.img['paragraph1'] || null;
        } else if (typeof data.img === 'string') {
          img1 = data.img;
        }
        if (img1) {
          const contentImage = document.querySelector('.content-image img');
          if (contentImage) contentImage.src = img1;
        }

        // Create a new section for Paragraph 2 (if present)
        const p2 = data.content['Paragraph 2'] || data.content['paragraph 2'] || data.content['paragraph2'] || null;
        if (p2) {
          // remove existing extra-post if present (idempotent)
          const prevExtra = document.querySelector('.extra-post');
          if (prevExtra) prevExtra.remove();

          const extraSection = document.createElement('section');
          extraSection.className = 'extra-post container';

          const grid = document.createElement('div');
          // use an image-left modifier so CSS can make the left column a fixed image width
          grid.className = 'content-grid image-left';

          const textDiv = document.createElement('div');
          textDiv.className = 'content-text';
          // paragraph 2 title
          let title2 = '';
          if (typeof data.title === 'object' && data.title !== null) {
            title2 = data.title['Paragraph 2'] || data.title['paragraph 2'] || data.title['paragraph2'] || '';
          }
          if (title2) {
            const h3 = document.createElement('h3');
            h3.className = 'section-title';
            h3.textContent = title2;
            textDiv.appendChild(h3);
          }
          const p = document.createElement('p');
          p.innerHTML = escapeHtml(p2).replace(/\n/g, '<br>');
          textDiv.appendChild(p);
          // remove any previous post-date nodes inside this textDiv (idempotent)
          const prevDates2 = textDiv.querySelectorAll('.post-date');
          prevDates2.forEach(n => n.remove());
          // insert the paragraph-specific date immediately after the paragraph
          if (dateP2) p.insertAdjacentElement('afterend', dateP2.cloneNode(true));

          const imgDiv = document.createElement('div');
          imgDiv.className = 'content-image';
          const imgEl = document.createElement('img');
          imgEl.alt = '';
          let img2 = null;
          if (data.img && typeof data.img === 'object') {
            img2 = data.img['Paragraph 2'] || data.img['paragraph 2'] || data.img['paragraph2'] || null;
          }
          if (img2) imgEl.src = img2;
          imgDiv.appendChild(imgEl);

          // assemble and insert (image first for even paragraph: left on desktop)
          grid.appendChild(imgDiv);
          grid.appendChild(textDiv);
          extraSection.appendChild(grid);

          const blogContent = document.querySelector('.blog-content');
          if (blogContent && blogContent.parentNode) {
            blogContent.parentNode.insertBefore(extraSection, blogContent.nextSibling);
          } else {
            document.querySelector('main').appendChild(extraSection);
          }
        }
      }

      // (No global cleanup here - dates are inserted per-paragraph above.)

      // remove any author block left in the content area
      const prevAuthor = contentContainer.querySelector('.post-author');
      if (prevAuthor) prevAuthor.remove();
    }
  }

  // Render author in the hero's bottom-right (.hero-author). Create if missing.
  if (data.author) {
    const heroInner = document.querySelector('.blog-hero .hero-inner');
    if (heroInner) {
      let heroAuthor = heroInner.querySelector('.hero-author');
      if (!heroAuthor) {
        heroAuthor = document.createElement('div');
        heroAuthor.className = 'hero-author';
        heroInner.appendChild(heroAuthor);
      }
      heroAuthor.textContent = `By ${data.author}`;
    }
  }
});
