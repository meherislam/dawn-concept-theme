class ImageHotspots extends HTMLElement {
  connectedCallback() {
    this.markers = Array.from(this.querySelectorAll('[data-hotspot-marker]'));

    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.markers.forEach((marker) => {
      marker.addEventListener('click', () => this.toggle(marker));
    });

    document.addEventListener('click', this.onDocumentClick);
    this.addEventListener('keyup', this.onKeyUp);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  get openMarker() {
    return this.markers.find((marker) => marker.getAttribute('aria-expanded') === 'true');
  }

  panelFor(marker) {
    return this.querySelector(`#${marker.getAttribute('aria-controls')}`);
  }

  open(marker) {
    this.closeAll();
    marker.setAttribute('aria-expanded', 'true');
    const panel = this.panelFor(marker);
    if (panel) panel.hidden = false;
  }

  close(marker) {
    marker.setAttribute('aria-expanded', 'false');
    const panel = this.panelFor(marker);
    if (panel) panel.hidden = true;
  }

  closeAll() {
    this.markers.forEach((marker) => this.close(marker));
  }

  toggle(marker) {
    if (marker.getAttribute('aria-expanded') === 'true') {
      this.close(marker);
    } else {
      this.open(marker);
    }
  }

  onDocumentClick(event) {
    if (this.contains(event.target)) return;
    this.closeAll();
  }

  onKeyUp(event) {
    if (event.key !== 'Escape') return;

    const marker = this.openMarker;
    if (!marker) return;

    this.close(marker);
    marker.focus();
  }
}

customElements.define('image-hotspots', ImageHotspots);
