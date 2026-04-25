import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ft-heading")
export class Heading extends LitElement {
  @property({ type: String })
  value: string = "";
  @property({ type: Number })
  level: 1 | 2 | 3 | 4 | 5 | 6 = 2;

  static styles = css`
    :host { display: block; }
    h1,h2 { font-weight: 700; }
    h3,h4,h5,h6 { font-weight: 600; }
    h1,h2,h3,h4,h5,h6 { margin: 0 0 8px; }
  `;

  render() {
    const v = this.value;
    switch (this.level) {
      case 1:
        return html`<h1>${v}</h1>`;
      case 3:
        return html`<h3>${v}</h3>`;
      case 4:
        return html`<h4>${v}</h4>`;
      case 5:
        return html`<h5>${v}</h5>`;
      case 6:
        return html`<h6>${v}</h6>`;
      default:
        return html`<h2>${v}</h2>`;
    }
  }
}
