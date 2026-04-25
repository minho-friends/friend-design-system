import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./tree-node.js";
import "./key-value-list.js";
import type { KeyValueItem } from "./key-value-list.js";

export interface TunnelEntryItem {
  hostname: string;
  service: string;
}

@customElement("tunnel-entry")
export class TunnelEntry extends LitElement {
  @property({ type: String })
  name = "";
  @property({ type: String })
  meta?: string;
  @property({ type: Array })
  entries: TunnelEntryItem[] = [];
  @property({ type: Boolean })
  readonly = false;
  @property({ attribute: false })
  onAdd?: () => void;
  @property({ attribute: false })
  onRemove?: (hostname: string) => void;

  static styles = css`
    :host { display: block; margin-bottom: var(--space-item, 10px); }
    .footer { margin-left: var(--space-indent, 14px); margin-top: 4px; }
    button {
      font-size: var(--size-sm, small);
      background: none;
      border: none;
      cursor: pointer;
      padding: 1px 4px;
    }
    button:disabled { opacity: 0.4; cursor: default; }
  `;

  render() {
    const label = this.meta ? `${this.name} ${this.meta}` : this.name;
    const items: KeyValueItem[] = this.entries.map(e => ({
      key: e.hostname,
      value: e.service,
      actionLabel: "−",
      onAction: this.readonly ? undefined : () => this.onRemove?.(e.hostname),
    }));

    return html`
      <tree-node label=${label} .open=${false}>
        <key-value-list .items=${items}></key-value-list>
        <div class="footer">
          <button ?disabled=${this.readonly} @click=${() => this.onAdd?.()}>+ add</button>
        </div>
      </tree-node>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tunnel-entry": TunnelEntry;
  }
}
