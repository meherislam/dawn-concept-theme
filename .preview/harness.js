/*
 * Local preview harness only — not part of the theme.
 *
 * Fills in the two things Liquid would normally supply: imagery (Shopify's
 * placeholder_svg_tag / image_tag) and the product cards inside the carousel.
 * Runs before the theme scripts so the carousel measures a populated track.
 */

(function () {
  const PALETTE = ['#B5643C', '#8C7A66', '#3F4A42', '#7A5C48', '#5B6670', '#A8886B'];

  /** Inline SVG data URI — keeps the harness fully offline. */
  function placeholder(label, color, w, h) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
      <rect width="${w}" height="${h}" fill="${color}"/>
      <text x="50%" y="50%" fill="rgba(255,255,255,.85)" font-family="sans-serif"
        font-size="${Math.round(Math.min(w, h) / 10)}" text-anchor="middle"
        dominant-baseline="middle">${label}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`;
  }

  const IMAGES = {
    promo: placeholder('promo', '#8C7A66', 800, 1000),
    hero: placeholder('hotspot image', '#6E6154', 1600, 900),
    before: placeholder('BEFORE', '#8C7A66', 1600, 900),
    after: placeholder('AFTER', '#3F4A42', 1600, 900),
    card1: placeholder('1', '#B5643C', 200, 200),
    card2: placeholder('2', '#8C7A66', 200, 200),
    card3: placeholder('3', '#3F4A42', 200, 200),
    card4: placeholder('4', '#5B6670', 200, 200),
  };

  document.querySelectorAll('[data-pv-img]').forEach((img) => {
    img.src = IMAGES[img.dataset.pvImg];
  });

  // Dawn's icon-arrow.svg, inlined so the harness needs no fetch.
  document.querySelectorAll('[data-pv-icon="arrow"]').forEach((span) => {
    span.innerHTML =
      '<svg viewBox="0 0 14 10" fill="none" aria-hidden="true" focusable="false">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z" fill="currentColor"></path>' +
      '</svg>';
  });

  // Stand-in slides for the carousel.
  const PRODUCTS = [
    ['Merino crew', '$128.00'],
    ['Wide-leg trouser', '$185.00'],
    ['Leather loafer', '$240.00'],
    ['Canvas tote', '$95.00'],
    ['Wool overshirt', '$210.00'],
    ['Ribbed beanie', '$45.00'],
    ['Linen shirt', '$140.00'],
    ['Suede belt', '$88.00'],
  ];

  const track = document.querySelector('#CarouselTrack-preview');
  if (track) {
    track.innerHTML = PRODUCTS.map(([title, price], index) => {
      const image = placeholder(String(index + 1), PALETTE[index % PALETTE.length], 400, 500);
      return `<li class="concept-carousel__slide" data-carousel-slide>
          <a class="pv-card" href="#">
            <img class="pv-card__media" src="${image}" alt="" />
            <span class="pv-card__title">${title}</span>
            <span class="pv-card__price">${price}</span>
          </a>
        </li>`;
    }).join('');
  }

  // Toolbar.
  const width = document.querySelector('#pv-width');
  const report = () => {
    width.textContent = `${window.innerWidth}px viewport`;
  };
  report();
  window.addEventListener('resize', report);

  document.querySelector('#pv-rtl').addEventListener('change', (event) => {
    document.documentElement.setAttribute('dir', event.target.checked ? 'rtl' : 'ltr');
  });

  // Match on .gradient, not .color-scheme-1 — the latter stops matching after
  // the first toggle and the switch would only work one way.
  document.querySelector('#pv-scheme').addEventListener('change', (event) => {
    document.querySelectorAll('[data-pv-scheme] .gradient').forEach((element) => {
      element.classList.toggle('color-scheme-1', !event.target.checked);
      element.classList.toggle('color-scheme-2', event.target.checked);
    });
  });

  document.querySelector('#pv-outline').addEventListener('change', (event) => {
    document.body.classList.toggle('pv-outline', event.target.checked);
  });
})();
