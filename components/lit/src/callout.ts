import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ft-callout")
export class Callout extends LitElement {
  @property({ type: String })
  message: string = "";
  @property({ type: String })
  variant: "info" | "success" | "warning" | "error" = "info";

  static styles = css`
    :host { display: block; }
    .wrap { padding: 10px 14px; border-radius: 6px; font-size: 13px; border: 1px solid; }
    .info    { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
    .success { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
    .warning { background: #fffbeb; border-color: #fde68a; color: #92400e; }
    .error   { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
  `;

  render() {
    return html`<div class="wrap ${this.variant}">${this.message}</div>`;
  }
}
