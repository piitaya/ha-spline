import {
  getBabelInputPlugin,
  getBabelOutputPlugin,
} from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";
import ignore from "./rollup-plugins/rollup-ignore-plugin.js";

const IGNORED_FILES = [];

const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ["./dist"],
  host: "0.0.0.0",
  port: 4000,
  allowCrossOrigin: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};

const plugins = [
  ignore({
    files: IGNORED_FILES.map((file) => require.resolve(file)),
  }),
  typescript({
    declaration: false,
  }),
  nodeResolve(),
  json(),
  commonjs(),
  // Only include the babel plugin for production build
  ...(dev ? [
    serve(serveOptions)
  ] : [
    getBabelInputPlugin({
      babelHelpers: "bundled",
    }),
    getBabelOutputPlugin({
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
          },
        ],
      ],
    }),
    terser()
  ]),
];

export default [
  {
    input: "src/spline.ts",
    output: {
      dir: "dist",
      format: "es",
      inlineDynamicImports: true,
    },
    plugins,
    moduleContext: (id) => {
      const thisAsWindowForModules = [
        "node_modules/@formatjs/intl-utils/lib/src/diff.js",
        "node_modules/@formatjs/intl-utils/lib/src/resolve-locale.js",
      ];
      if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
        return "window";
      }
    },
  },
];
