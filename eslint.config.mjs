const js = require ("@eslint/js");

module.exports = [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2020, // Utiliser ECMAScript 2020 pour les fonctionnalités modernes
      sourceType: "script", // Précise que le code est en CommonJS
      globals: {
        require: "readonly", // Permet d'utiliser `require` sans erreur
        module: "readonly",  // Permet d'utiliser `module.exports`
        process: "readonly", // Permet d'utiliser `process` pour Node.js
      },
    },
    rules: {
      "no-unused-vars": "warn", // Signale les variables inutilisées comme avertissements
      "no-undef": "warn",       // Signale les variables non définies comme avertissements
      "no-console": "off",
    },
  },
];