import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ft-text")
export class Text extends LitElement {
  @property({ type: String })
  value: string = "";
  @property({ type: Boolean })
  muted: boolean = false;
  @property({ type: String })
  size: "sm" | "base" | "lg" = "base";

  static styles = css`:host { display: block; }`;

  render() {
    const fs = this.size === "sm" ? "12px" : this.size === "lg" ? "18px" : "14px";
    const color = this.muted ? "color:var(--color-neutral,#6b7280);" : "";
    return html`<p style="margin:0;font-size:${fs};${color}">${this.value}</p>`;
  }
}
