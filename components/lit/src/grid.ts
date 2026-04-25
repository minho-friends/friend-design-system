import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const gapMap: Record<string, string> = { sm: "4px", md: "12px", lg: "24px", xl: "32px" };

@customElement("ft-grid")
export class Grid extends LitElement {
  @property({ type: Number })
  columns: number = 2;
  @property({ type: String })
  gap: string = "md";

  static styles = css`:host { display: block; }`;

  render() {
    const g = gapMap[this.gap] ?? this.gap ?? "12px";
    return html`<div style="display:grid;grid-template-columns:repeat(${this.columns},1fr);gap:${g};"><slot></slot></div>`;
  }
}
