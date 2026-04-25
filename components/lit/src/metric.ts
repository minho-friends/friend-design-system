import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ft-metric")
export class Metric extends LitElement {
  @property({ type: String })
  label: string = "";
  @property()
  value: string | number = "";
  @property({ type: String })
  unit?: string;
  @property({ type: String })
  trend?: "up" | "down" | "stable";

  static styles = css`
    :host { display: block; }
    .wrap { display: flex; flex-direction: column; gap: 2px; }
    .lbl { font-size: 12px; color: var(--color-neutral, #6b7280); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
    .val { font-size: 22px; font-weight: 700; line-height: 1.2; }
    .unit { font-size: 13px; margin-left: 3px; font-weight: 400; }
    .trend { font-size: 11px; }
    .up   { color: #16a34a; }
    .down { color: #dc2626; }
    .stable { color: var(--color-neutral, #6b7280); }
  `;

  render() {
    const trendIcon = this.trend === "up" ? "↑" : this.trend === "down" ? "↓" : "→";
    return html`
      <div class="wrap">
        <span class="lbl">${this.label}</span>
        <span class="val">
          ${this.value}${this.unit ? html`<span class="unit">${this.unit}</span>` : ""}
        </span>
        ${this.trend ? html`<span class="trend ${this.trend}">${trendIcon} ${this.trend}</span>` : ""}
      </div>
    `;
  }
}
