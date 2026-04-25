import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("metrics-row")
export class MetricsRow extends LitElement {
  @property({ type: String })
  status?: string;
  @property({ type: Number })
  age?: number;
  @property({ type: Number })
  cpu?: number;
  @property({ type: Number })
  mem?: number;

  static styles = css`
    :host { display: block; }
    span {
      font-family: var(--font-mono, monospace);
      font-size: var(--size-meta, smaller);
      color: var(--color-neutral, #6B7280);
      margin-left: var(--space-indent, 14px);
      margin-top: 5px;
      display: block;
    }
  `;

  render() {
    const parts: string[] = [];
    if (this.status !== undefined) parts.push(`status: ${this.status}`);
    if (this.age !== undefined) parts.push(`age: ${this.age}s`);
    if (this.cpu !== undefined) parts.push(`cpu: ${this.cpu}%`);
    if (this.mem !== undefined) parts.push(`mem: ${this.mem}MB`);
    return html`<span>${parts.join(" | ")}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "metrics-row": MetricsRow;
  }
}
