import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("search-filter-bar")
export class SearchFilterBar extends LitElement {
  @property({ type: String })
  placeholder = "Filter...";

  static styles = css`
    :host { display: inline-block; }
    input {
      font-family: var(--font-ui, Inter, system-ui, sans-serif);
      font-size: var(--size-sm, small);
      border: 1px solid var(--color-bg-divider, #F3F4F6);
      border-radius: 0;
      padding: 2px 6px;
      outline: none;
      background: var(--color-bg-card, #FFFFFF);
    }
    input:focus { border-color: var(--color-action, #2563EB); }
  `;

  private _onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent("filter", { detail: value, bubbles: true, composed: true }));
  }

  render() {
    return html`<input type="text" placeholder=${this.placeholder} @input=${this._onInput}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "search-filter-bar": SearchFilterBar;
  }
}
