// ESLint flat config (v9+).
//
// Scope: only standalone .js files under assets/js/. Inline <script> blocks
// inside index.html and every projects/**/*.html lab are intentionally NOT
// linted here — those labs are meant to be dropped in as single self-contained
// files generated from docs/prompt-templates.md, and running ESLint (with
// autofix) over generator output risks altering logic in files we can't
// easily diff against source-of-truth. Prettier still formats HTML files
// (including their inline scripts) — see .prettierrc.
import globals from 'globals';

export default [
    {
        files: ['assets/js/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script', // plain <script> tags, not ES modules
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            eqeqeq: 'warn',
        },
    },
    {
        ignores: ['node_modules/', 'projects/**', '**/*.html'],
    },
];
