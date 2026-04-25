import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("info-text")
export class InfoText extends LitElement {
  @property({ type: String })
  text = "";
  @property({ type: Boolean })
  isError = false;

  static styles = css`
    :host { display: block; }
    div {
      font-family: var(--font-ui, Inter, system-ui, sans-serif);
      font-size: var(--size-meta, smaller);
      color: var(--color-neutral, #6B7280);
      margin-left: var(--space-indent, 14px);
      margin-top: 5px;
    }
    div.error { color: var(--color-danger, #EF4444); }
  `;

  render() {
    return html`<div class=${this.isError ? "error" : ""}>${this.text}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "info-text": InfoText;
  }
}
