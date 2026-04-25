import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ft-card")
export class Card extends LitElement {
  @property({ type: String })
  title: string = "";
  @property({ type: String })
  subtitle: string = "";

  static styles = css`
    :host { display: block; }
    .card {
      border: 1px solid var(--color-bg-divider, #e5e7eb);
      border-radius: 8px;
      padding: 16px;
      background: var(--color-bg-card, #fff);
    }
    .title { margin: 0 0 4px; font-size: 14px; font-weight: 600; }
    .subtitle { margin: 0 0 12px; font-size: 12px; color: var(--color-neutral, #6b7280); }
  `;

  render() {
    return html`
      <div class="card">
        ${this.title ? html`<h3 class="title">${this.title}</h3>` : ""}
        ${this.subtitle ? html`<p class="subtitle">${this.subtitle}</p>` : ""}
        <slot></slot>
      </div>
    `;
  }
}
