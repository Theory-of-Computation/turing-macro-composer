module.exports = {
    root: true,
    env: {
        browser: true,
        es2024: true,
        node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    plugins: ["react", "@typescript-eslint", "react-hooks"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic",
        "prettier"
    ],
    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off"
    },
    overrides: [{
        files: ["*.js", "*.cjs", "*.mjs"],
        rules: {
            "@typescript-eslint/dot-notation": "off"
        }
    }]
};