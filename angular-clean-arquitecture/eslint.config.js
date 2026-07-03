// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

// ── Patrones de fronteras de Clean Architecture ──────────────────────────────
// OJO (flat config): si dos bloques configuran la MISMA regla para un archivo,
// el último la REEMPLAZA (no se fusionan). Por eso cada zona (feature+capa)
// recibe UN solo bloque con la lista completa de sus restricciones.

const NO_DATA = {
  group: ['**/data/**', '@features/*/data/**'],
  message: 'Esta capa no puede importar de data (regla de dependencias).',
};
const NO_PRESENTATION = {
  group: ['**/presentation/**', '@features/*/presentation/**'],
  message: 'domain no puede importar de presentation (regla de dependencias).',
};
const NO_HTTP = {
  group: ['@angular/common/http'],
  message: 'domain no conoce HTTP: eso es responsabilidad de data.',
};
const NO_ROUTER = {
  group: ['@angular/router'],
  message: 'domain no conoce el router: eso es responsabilidad de presentation.',
};
/** @param {string} feature */
const noOtherFeature = (feature) => ({
  group: [`@features/${feature}/**`, `**/features/${feature}/**`],
  message: `No puede importar de ${feature}: las features están desacopladas (solo el composition root las conoce todas).`,
});
const NO_FEATURES = {
  group: ['@features/**', '**/features/**'],
  message: 'core/shared no pueden importar de features: usa tokens de inversión (ver auth-hooks.token.ts).',
};

/**
 * @param {object[]} patterns
 * @returns {import('eslint').Linter.RulesRecord}
 */
const restrict = (patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },

  // ── Fronteras de Clean Architecture ─────────────────────────────────────────
  // La regla de dependencias apunta hacia adentro: presentation → domain ← data.
  // Bloques DISJUNTOS por feature+capa (ver nota arriba sobre reemplazo de reglas).

  // domain: TS puro. No conoce data, presentation, HTTP, Router ni otras features.
  // (Se permite @angular/core por inject/InjectionToken — trade-off documentado.)
  {
    files: ['src/app/features/auth/domain/**/*.ts'],
    rules: restrict([NO_DATA, NO_PRESENTATION, NO_HTTP, NO_ROUTER, noOtherFeature('products')]),
  },
  {
    files: ['src/app/features/products/domain/**/*.ts'],
    rules: restrict([NO_DATA, NO_PRESENTATION, NO_HTTP, NO_ROUTER, noOtherFeature('auth')]),
  },

  // presentation: no conoce DTOs ni implementaciones (habla con domain) ni otras features.
  {
    files: ['src/app/features/auth/presentation/**/*.ts'],
    rules: restrict([NO_DATA, noOtherFeature('products')]),
  },
  {
    files: ['src/app/features/products/presentation/**/*.ts'],
    rules: restrict([NO_DATA, noOtherFeature('auth')]),
  },

  // data y archivos raíz del feature (p. ej. *.routes.ts): solo aislamiento entre features.
  {
    files: ['src/app/features/auth/data/**/*.ts', 'src/app/features/auth/*.ts'],
    rules: restrict([noOtherFeature('products')]),
  },
  {
    files: ['src/app/features/products/data/**/*.ts', 'src/app/features/products/*.ts'],
    rules: restrict([noOtherFeature('auth')]),
  },

  // core y shared son transversales: nunca dependen de una feature.
  {
    files: ['src/app/core/**/*.ts', 'src/app/shared/**/*.ts'],
    rules: restrict([NO_FEATURES]),
  },
]);
