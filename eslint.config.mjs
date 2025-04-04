import globals from "globals";
import path from "node:path";
import {
    fileURLToPath
} from "node:url";
import js from "@eslint/js";
import {
    FlatCompat
} from "@eslint/eslintrc";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...Object.fromEntries(Object.entries(globals.commonjs).map(([key]) => [key, "off"])),
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
            NodeJS: true,
        },

        ecmaVersion: 2018,
        sourceType: "module",
    },
    env: {
        node: true,
        jest: true,
    },
    plugins: ["jest"],
    extends: ["eslint:recommended", "plugin:jest/recommended"],

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,

            FunctionDeclaration: {
                body: 1,
                parameters: 2,
            },
        }],

        "linebreak-style": ["error", "unix"],

        quotes: ["error", "single", {
            allowTemplateLiterals: true,
        }],

        semi: ["error", "always"],

        "no-unused-vars": ["error", {
            vars: "all",
            args: "after-used",
            ignoreRestSiblings: false,
        }],

        "no-var": ["error"],
    },
}, {
    files: ["{ts,tsx,js,jsx}"],
}];