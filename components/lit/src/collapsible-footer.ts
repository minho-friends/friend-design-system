import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./key-value-list.js";

export interface FooterSection {
  title: string;
  items: { key: string; value: string }[];
}

@customElement("collapsible-footer")
export class CollapsibleFooter extends LitElement {
  @property({ type: Array })
  sections: FooterSection[] = [];
  @property({ type: Boolean, reflect: true })
  sticky = false;

  static styles = css`
    :host { display: block; }
    :host([sticky]) footer {
      position: sticky;
      bottom: 0;
      background: var(--color-bg-page, #F9FAFB);
      border-top: 1px solid var(--color-bg-divider, #F3F4F6);
    }
    hr {
      margin-top: var(--space-section, 20px);
      border: none;
      border-top: 1px solid var(--color-bg-divider, #F3F4F6);
    }
    details {
      color: var(--color-neutral, #6B7280);
      font-size: var(--size-meta, smaller);
    }
    summary { cursor: pointer; }
    h3 {
      font-size: var(--size-meta, smaller);
      font-weight: bold;
      margin: 6px 0 2px var(--space-indent, 14px);
    }
  `;

  render() {
    return html`
      <footer>
        ${this.sticky ? "" : html`<hr>`}
        <details>
          <summary>info</summary>
          ${
      this.sections.map(s =>
        html`
            <h3>${s.title}</h3>
            <key-value-list .items=${s.items}></key-value-list>
          `
      )
    }
        </details>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "collapsible-footer": CollapsibleFooter;
  }
}
