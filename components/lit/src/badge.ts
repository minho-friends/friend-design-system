import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const colorMap: Record<string, string> = {
  default: "#6b7280",
  success: "#16a34a",
  warning: "#ca8a04",
  error: "#dc2626",
  info: "#2563eb",
};

@customElement("ft-badge")
export class Badge extends LitElement {
  @property({ type: String })
  label: string = "";
  @property({ type: String })
  variant: "default" | "success" | "warning" | "error" | "info" = "default";

  static styles = css`:host { display: inline-block; }`;

  render() {
    const bg = colorMap[this.variant] ?? colorMap.default;
    return html`
      <span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:12px;font-weight:500;color:#fff;background:${bg};">
        ${this.label}
      </span>
    `;
  }
}
