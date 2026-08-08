class BeforeAfterSlider extends HTMLElement {
  connectedCallback() {
    this.range = this.querySelector('[data-before-after-range]');
    this.frame = this.querySelector('[data-before-after-frame]');
    if (!this.range || !this.frame) return;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.range.addEventListener('input', () => this.setPosition(this.range.value));
    this.frame.addEventListener('pointerdown', this.onPointerDown);
    this.frame.addEventListener('pointermove', this.onPointerMove);
    this.frame.addEventListener('pointerup', this.onPointerUp);
    this.frame.addEventListener('pointercancel', this.onPointerUp);

    this.setPosition(this.range.value);
  }

  disconnectedCallback() {
    this.frame?.removeEventListener('pointerdown', this.onPointerDown);
    this.frame?.removeEventListener('pointermove', this.onPointerMove);
    this.frame?.removeEventListener('pointerup', this.onPointerUp);
    this.frame?.removeEventListener('pointercancel', this.onPointerUp);
  }

  positionFromEvent(event) {
    const bounds = this.frame.getBoundingClientRect();
    if (!bounds.width) return Number(this.range.value);

    let ratio = (event.clientX - bounds.left) / bounds.width;
    if (getComputedStyle(this.frame).direction === 'rtl') ratio = 1 - ratio;

    return Math.min(100, Math.max(0, Math.round(ratio * 100)));
  }

  onPointerDown(event) {
    // Taking over from the native range thumb means a drag anywhere on the image
    // moves the divider, not just a grab on the handle itself.
    event.preventDefault();
    this.dragging = true;
    this.frame.setPointerCapture(event.pointerId);
    this.range.focus();
    this.setPosition(this.positionFromEvent(event));
  }

  onPointerMove(event) {
    if (!this.dragging) return;
    this.setPosition(this.positionFromEvent(event));
  }

  onPointerUp(event) {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.frame.hasPointerCapture(event.pointerId)) {
      this.frame.releasePointerCapture(event.pointerId);
    }
  }

  setPosition(value) {
    const position = Math.min(100, Math.max(0, Number(value)));
    this.style.setProperty('--before-after-position', `${position}%`);
    this.range.value = position;
    this.range.setAttribute('aria-valuetext', `${position}%`);
  }
}

customElements.define('before-after-slider', BeforeAfterSlider);
