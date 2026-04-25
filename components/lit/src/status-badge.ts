import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type BadgeVariant = "running" | "stopped" | "completed" | "disabled" | "unknown";

@customElement("status-badge")
export class StatusBadge extends LitElement {
  @property({ type: String })
  variant: BadgeVariant = "unknown";
  @property({ type: String })
  label = "";

  static styles = css`
    :host { display: inline-block; }
    span {
      display: inline-block;
      font-size: var(--size-xs, x-small);
      font-weight: bold;
      padding: 1px 6px;
      border-radius: 3px;
      color: #fff;
    }
    .running  { background: var(--color-success, #10B981); }
    .stopped  { background: var(--color-danger, #EF4444); }
    .completed { background: var(--color-neutral, #6B7280); }
    .disabled  { background: transparent; border: 1px solid var(--color-neutral, #6B7280); color: var(--color-neutral, #6B7280); }
    .unknown  { background: var(--color-neutral, #6B7280); }
  `;

  render() {
    const text = this.label || this.variant;
    return html`<span class=${this.variant}>${text}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "status-badge": StatusBadge;
  }
}
