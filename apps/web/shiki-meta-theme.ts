/**
 * Shiki theme matching react.dev dark syntax tokens
 * (src/styles/sandpack.css → html.dark .sp-wrapper).
 */
export const reactDocsDark = {
  name: "react-docs-dark",
  type: "dark" as const,
  fg: "#ffffff",
  bg: "#16181d",
  colors: {
    "editor.background": "#16181d",
    "editor.foreground": "#ffffff",
  },
  settings: [
    {
      scope: [
        "comment",
        "punctuation.definition.comment",
        "string.comment",
      ],
      settings: { foreground: "#757575", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.other",
        "storage",
        "storage.type",
        "storage.modifier",
        "variable.language",
      ],
      settings: { foreground: "#77b7d7" },
    },
    {
      scope: [
        "entity.name.tag",
        "support.class.component",
        "punctuation.definition.tag",
      ],
      settings: { foreground: "#dfab5c" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "meta.delimiter",
      ],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "entity.name.function.member",
        "meta.function-call",
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "support.type",
      ],
      settings: { foreground: "#86d9ca" },
    },
    {
      scope: [
        "variable.other.property",
        "variable.other.object.property",
        "support.type.property-name",
        "meta.object-literal.key",
        "entity.other.attribute-name",
      ],
      settings: { foreground: "#77b7d7" },
    },
    {
      scope: [
        "constant",
        "constant.numeric",
        "constant.language",
        "constant.character",
        "support.constant",
      ],
      settings: { foreground: "#c64640" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "string.regexp",
        "punctuation.definition.string",
      ],
      settings: { foreground: "#977cdc" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.parameter",
        "meta.definition.variable",
      ],
      settings: { foreground: "#ffffff" },
    },
  ],
}
