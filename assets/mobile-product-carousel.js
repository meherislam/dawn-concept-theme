class MobileProductCarousel extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-carousel-track]');
    if (!this.track) return;

    this.prevButton = this.querySelector('[data-carousel-prev]');
    this.nextButton = this.querySelector('[data-carousel-next]');

    this.onScroll = this.onScroll.bind(this);
    this.track.addEventListener('scroll', this.onScroll, { passive: true });

    this.prevButton?.addEventListener('click', () => this.scrollByPage(-1));
    this.nextButton?.addEventListener('click', () => this.scrollByPage(1));

    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => this.updateButtons());
      this.resizeObserver.observe(this.track);
    }

    this.updateButtons();
  }

  disconnectedCallback() {
    this.track?.removeEventListener('scroll', this.onScroll);
    this.resizeObserver?.disconnect();
    if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame);
  }

  onScroll() {
    if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = requestAnimationFrame(() => this.updateButtons());
  }

  // scrollLeft runs negative in RTL, so normalise to a left-to-right value.
  get normalizedScrollLeft() {
    return Math.abs(this.track.scrollLeft);
  }

  get maxScroll() {
    return this.track.scrollWidth - this.track.clientWidth;
  }

  scrollByPage(direction) {
    const slide = this.track.querySelector('[data-carousel-slide]');
    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    const step = slide ? slide.getBoundingClientRect().width + gap : this.track.clientWidth;
    const isRtl = getComputedStyle(this.track).direction === 'rtl';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.track.scrollBy({
      left: step * direction * (isRtl ? -1 : 1),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }

  updateButtons() {
    if (!this.prevButton || !this.nextButton) return;

    const position = this.normalizedScrollLeft;
    // Sub-pixel rounding means the end of the track rarely matches exactly.
    const atStart = position <= 1;
    const atEnd = position >= this.maxScroll - 1;

    this.prevButton.disabled = atStart;
    this.nextButton.disabled = atEnd;
  }
}

customElements.define('mobile-product-carousel', MobileProductCarousel);
