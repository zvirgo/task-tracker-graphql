// client/codegen.ts
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'graphql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;