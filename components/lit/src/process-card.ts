import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Action } from "./action-group.js";
import type { BadgeVariant } from "./status-badge.js";
import "./status-badge.js";
import "./metrics-row.js";
import "./info-text.js";
import "./tree-node.js";
import "./action-group.js";

@customElement("process-card")
export class ProcessCard extends LitElement {
  @property({ type: String })
  name = "";
  @property({ type: String })
  status: BadgeVariant = "unknown";
  @property({ type: Object })
  metrics?: { age?: number; cpu?: number; mem?: number };
  @property({ type: String })
  info?: string;
  @property({ type: Boolean })
  infoError = false;
  @property({ type: Array })
  actions: Action[] = [];
  @property({ type: Boolean })
  open = true;

  static styles = css`
    :host { display: block; margin-bottom: var(--space-item, 10px); }
    .card {
      border: 1px solid var(--color-bg-divider, #F3F4F6);
      background: var(--color-bg-card, #FFFFFF);
    }
    .running {
      border-left: 3px solid var(--color-success, #10B981);
      background: #F0FDF4;
    }
    .stopped {
      border-left: 3px solid var(--color-bg-divider, #F3F4F6);
    }
  `;

  render() {
    const cardCls = this.status === "running"
      ? "card running"
      : this.status === "stopped"
      ? "card stopped"
      : "card";
    return html`
      <div class=${cardCls}>
        <tree-node .label=${this.name} .badge=${this.status} ?open=${this.open}>
          ${
      this.metrics
        ? html`
            <metrics-row
              .status=${this.status}
              .age=${this.metrics.age}
              .cpu=${this.metrics.cpu}
              .mem=${this.metrics.mem}>
            </metrics-row>`
        : ""
    }
          ${
      this.info
        ? html`
            <info-text .text=${this.info} .isError=${this.infoError}></info-text>`
        : ""
    }
          <action-group .actions=${this.actions}></action-group>
        </tree-node>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "process-card": ProcessCard;
  }
}
