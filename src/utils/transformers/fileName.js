/**
 * CustomShiki transformer that adds file name labels to code blocks.
 *
 * This transformer looks for the `file="filename"` meta attribute in code blocks
 * and creates a styled label showing the filename — a mono filename bar on
 * bg-elevated with a hairline border, matching the Marginalia code-block treatment.
 *
 * @param {Object} options - Configuration options for the transformer
 * @param {string} [options.style="v2"] - The styling variant to use
 *   - `"v1"`: Tab-style, positioned at top-left, flush with the block
 *   - `"v2"`: Badge-style with border, positioned at top-left with offset
 */
export const transformerFileName = ({ style = "v2" } = {}) => ({
  pre(node) {
    // Add CSS custom property to the node
    const fileNameOffset = style === "v1" ? "0.75rem" : "-0.75rem";
    node.properties.style =
      (node.properties.style || "") + `--file-name-offset: ${fileNameOffset};`;

    const raw = this.options.meta?.__raw?.split(" ");

    if (!raw) return;

    const metaMap = new Map();

    for (const item of raw) {
      const [key, value] = item.split("=");
      if (!key || !value) continue;
      metaMap.set(key, value.replace(/["'`]/g, ""));
    }

    const file = metaMap.get("file");

    if (!file) return;

    // Add additional margin to code block
    this.addClassToHast(node, "mt-8");

    // Add file name to code block
    node.children.push({
      type: "element",
      tagName: "span",
      properties: {
        class: [
          "font-meta absolute px-3 py-1.5 text-xs leading-4 tracking-wide text-text-muted uppercase",
          style === "v1"
            ? "left-0 -top-7 border border-b-0 border-border-subtle bg-bg-elevated"
            : "left-2 top-(--file-name-offset) border border-border-subtle bg-bg-elevated",
        ],
      },
      children: [
        {
          type: "text",
          value: file,
        },
      ],
    });
  },
});
