import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface Action {
  type: "start" | "stop" | "add" | "remove" | string;
  label?: string;
  disabled?: boolean;
  onClick: () => void;
}

const SYMBOLS: Record<string, string> = {
  start: "▶",
  stop: "■",
  add: "+",
  remove: "−",
};

@customElement("action-group")
export class ActionGroup extends LitElement {
  @property({ type: Array })
  actions: Action[] = [];

  static styles = css`
    :host { display: inline-flex; gap: var(--space-btn, 5px); }
    button {
      font-size: var(--size-sm, small);
      cursor: pointer;
      padding: 1px 6px;
      border: none;
      border-radius: 0;
    }
    button:disabled { opacity: 0.4; cursor: default; }
    .start  { background: var(--color-action, #2563EB); color: #fff; }
    .stop   { background: var(--color-danger, #EF4444); color: #fff; }
    .add    { background: none; border: 1px solid var(--color-bg-divider, #F3F4F6); color: inherit; }
    .remove { background: none; border: 1px solid var(--color-bg-divider, #F3F4F6); color: inherit; }
    .other  { background: none; border: 1px solid currentColor; color: inherit; }
  `;

  private _cls(type: string) {
    return ["start", "stop", "add", "remove"].includes(type) ? type : "other";
  }

  render() {
    return html`${
      this.actions.map(a =>
        html`
      <button
        class=${this._cls(a.type)}
        ?disabled=${!!a.disabled}
        @click=${a.onClick}>
        ${SYMBOLS[a.type] ?? ""} ${a.label ?? a.type}
      </button>
    `
      )
    }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "action-group": ActionGroup;
  }
}
