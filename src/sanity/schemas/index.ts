import { prompt } from './prompt';
import { sopPlaybook } from './sopPlaybook';

/**
 * Schema registry for the NEW, separate SyntaxHQ Studio.
 * Copy these files into your Studio's schemaTypes/ and export them the same way.
 */
export const schemaTypes = [prompt, sopPlaybook];
