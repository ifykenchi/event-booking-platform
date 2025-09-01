import { defineConfig } from 'cypress';
import { devServer } from '@cypress/webpack-dev-server';
import { AngularWebpackPlugin } from '@ngtools/webpack';
// import { defineElement } from '@angular/elements';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      webpackConfig: { stats: 'errors-only' }, // see issue https://github.com/cypress-io/cypress/issues/26456
      // options: {
      //   projectConfig: {
      //     root: '',
      //     sourceRoot: 'src',
      //     buildOptions: {
      //       outputPath: 'dist',
      //       index: 'src/index.html',
      //       main: 'src/main.ts',
      //       polyfills: 'src/polyfills.ts',
      //       tsConfig: 'tsconfig.json',
      //       assets: ['src/favicon.ico', 'src/assets'],
      //       styles: ['src/styles.css'],
      //       scripts: [],
      //     },
      //   },
      // },
    },
    specPattern: '**/*.cy.ts',
  },
});
