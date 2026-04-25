import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("ft-separator")
export class Separator extends LitElement {
  static styles = css`
    :host { display: block; }
    hr { border: none; border-top: 1px solid var(--color-bg-divider, #e5e7eb); margin: 4px 0; }
  `;

  render() {
    return html`<hr />`;
  }
}
