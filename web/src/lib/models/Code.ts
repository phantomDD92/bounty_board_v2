import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Code interface for TypeScript
export interface ICode extends Document {
  title: string;
  description: string;
  snippets: [{
    language: string;
    code: string;
  }];
  createdAt: Date;
  updatedAt: Date;
}

export const Language = {
  ADA: 'ada',
  ASPNET: 'aspnet',
  BASH: 'bash',
  C: 'c',
  CPP: 'cpp',
  CSHARP: 'csharp',
  CSS: 'css',
  DART: 'dart',
  DOCKER: 'docker',
  GO: 'go',
  JAVA: 'java',
  JAVASCRIPT: 'javascript',
  KOTLIN: 'kotlin',
  LUA: 'lua',
  MATLAB: 'matlab',
  OBJECTIVEC: 'objectivec',
  PASCAL: 'pascal',
  PERL: 'perl',
  PHP: 'php',
  PYTHON: 'python',
  RUBY: 'ruby',
  RUST: 'rust',
  SOLIDITY: 'solidity',
  SQL: 'sql',
  TYPESCRIPT: 'typescript',
  YAML: 'yaml',
};

// Create the Mongoose schema for Code
const CodeSchema: Schema<ICode> = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    snippets: [{
      language: {
        type: String,
        enum: Object.values(Language),
        default: Language.JAVASCRIPT
      },
      code: { type: String },
    }],
  },
  {
    timestamps: true
  }
);

// Export the model to prevent recompiling issues
const Code: Model<ICode> = mongoose.models?.Code || mongoose.model<ICode>('Code', CodeSchema);

export default Code;
