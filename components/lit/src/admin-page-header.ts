import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface HeaderAction {
  label: string;
  onClick: () => void;
}

@customElement("admin-page-header")
export class AdminPageHeader extends LitElement {
  @property({ type: String })
  title = "";
  @property({ type: Array })
  actions: HeaderAction[] = [];
  @property({ type: String })
  stats?: string;
  @property({ type: Boolean, reflect: true })
  sticky = false;

  static styles = css`
    :host { display: block; }
    :host([sticky]) header {
      position: sticky;
      top: 0;
      background: var(--color-bg-page, #F9FAFB);
      border-bottom: 1px solid var(--color-bg-divider, #F3F4F6);
    }
    header { display: flex; align-items: baseline; gap: 0; flex-wrap: wrap; }
    h1 {
      font-family: var(--font-ui, Inter, system-ui, sans-serif);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 var(--space-title, 3px) 0;
      display: inline;
    }
    button {
      font-size: var(--size-xs, x-small);
      margin-left: var(--space-btn, 5px);
      background: none;
      border: 1px solid currentColor;
      cursor: pointer;
      padding: 1px 4px;
      border-radius: 0;
    }
    .stats {
      font-family: var(--font-mono, monospace);
      font-size: var(--size-meta, smaller);
      color: var(--color-neutral, #6B7280);
      margin-left: auto;
    }
    hr {
      margin-top: var(--space-section, 20px);
      border: none;
      border-top: 1px solid var(--color-bg-divider, #F3F4F6);
    }
  `;

  render() {
    return html`
      <header>
        <h1>${this.title}</h1>
        ${
      this.actions.map(a =>
        html`
          <button @click=${a.onClick}>${a.label}</button>
        `
      )
    }
        ${this.stats ? html`<span class="stats">${this.stats}</span>` : ""}
      </header>
      ${this.sticky ? "" : html`<hr>`}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "admin-page-header": AdminPageHeader;
  }
}
