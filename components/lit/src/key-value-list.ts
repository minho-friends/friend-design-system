import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface KeyValueItem {
  key: string;
  value: string;
  onAction?: () => void;
  actionLabel?: string;
}

@customElement("key-value-list")
export class KeyValueList extends LitElement {
  @property({ type: Array })
  items: KeyValueItem[] = [];

  static styles = css`
    :host { display: block; }
    dl { margin: 0 0 0 var(--space-indent, 14px); }
    div { margin-bottom: 2px; }
    dt { display: inline; font-weight: normal; }
    dd { display: inline; margin: 0; }
    dd::before { content: ": "; }
    button {
      font-size: var(--size-xs, x-small);
      color: var(--color-danger, #EF4444);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 2px;
      margin-left: 4px;
    }
    button:disabled { opacity: 0.4; cursor: default; }
  `;

  render() {
    return html`
      <dl>
        ${
      this.items.map(item =>
        html`
          <div>
            <dt>${item.key}</dt>
            <dd>${item.value}${
          item.onAction
            ? html`
              <button @click=${item.onAction}>${item.actionLabel ?? "−"}</button>
            `
            : ""
        }</dd>
          </div>
        `
      )
    }
      </dl>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "key-value-list": KeyValueList;
  }
}
