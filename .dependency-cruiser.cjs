/** Import boundaries for the modules-of-slices layout (HD-11). */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "slices-isolated",
      comment: "A slice imports nothing from another slice of its module.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/slices/([^/]+)/" },
      to: {
        path: "^src/modules/$1/slices/",
        pathNot: "^src/modules/$1/slices/$2/",
      },
    },
    {
      name: "cross-module-index-only",
      comment: "A module reaches another module only through its index.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/" },
      to: { path: "^src/modules/(?!$1/)[^/]+/(?!index\\.ts$)" },
    },
    {
      name: "app-and-shared-index-only",
      comment: "app/ and shared/ reach a module only through its index.",
      severity: "error",
      from: { path: "^src/(app|shared)/" },
      to: { path: "^src/modules/[^/]+/(?!index\\.ts$)" },
    },
    {
      name: "shared-is-leaf",
      comment: "The shared kernel imports nothing from app/ or modules/.",
      severity: "error",
      from: { path: "^src/shared/" },
      to: { path: "^src/(app|modules)/" },
    },
    {
      name: "modules-do-not-import-app",
      comment: "The composition root is the top; nothing imports it.",
      severity: "error",
      from: { path: "^src/modules/" },
      to: { path: "^src/app/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
  },
};
