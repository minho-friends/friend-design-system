import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const gapMap: Record<string, string> = { sm: "4px", md: "12px", lg: "24px", xl: "32px" };

@customElement("ft-stack")
export class Stack extends LitElement {
  @property({ type: String })
  direction: "vertical" | "horizontal" = "vertical";
  @property({ type: String })
  gap: string = "md";
  @property({ type: String })
  align?: string;

  static styles = css`:host { display: block; }`;

  render() {
    const g = gapMap[this.gap] ?? this.gap ?? "12px";
    const dir = this.direction === "horizontal" ? "row" : "column";
    const align = this.align ? `align-items:${this.align};` : "";
    return html`<div style="display:flex;flex-direction:${dir};gap:${g};${align}"><slot></slot></div>`;
  }
}
