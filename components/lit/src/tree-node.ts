import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { BadgeVariant } from "./status-badge.js";
import "./status-badge.js";

@customElement("tree-node")
export class TreeNode extends LitElement {
  @property({ type: String })
  label = "";
  @property({ type: Boolean })
  open = false;
  @property({ type: Number })
  indent = 0;
  @property({ type: String })
  badge?: BadgeVariant;

  static styles = css`
    :host { display: block; }
    details { margin-left: calc(var(--space-indent, 14px) * var(--_lvl, 0)); }
    summary { cursor: pointer; }
    summary status-badge { margin-left: 4px; }
  `;

  private _onToggle(e: Event) {
    this.open = (e.target as HTMLDetailsElement).open;
    this.dispatchEvent(new CustomEvent("toggle", { detail: this.open, bubbles: true, composed: true }));
  }

  render() {
    this.style.setProperty("--_lvl", String(this.indent));
    return html`
      <details ?open=${this.open} @toggle=${this._onToggle}>
        <summary>
          ${this.label}
          ${this.badge ? html`<status-badge .variant=${this.badge}></status-badge>` : ""}
          <slot name="badge"></slot>
        </summary>
        <slot></slot>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tree-node": TreeNode;
  }
}
