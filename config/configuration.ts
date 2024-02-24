import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

//TODO：环境变量获取不到
const YAML_CONFIG_FILENAME =
  process.env.NODE_ENV === 'production'
    ? 'config.prod.yaml'
    : 'config.dev.yaml';
console.log('config:', process.env.NODE_ENV);
console.log('config:', process.env);
export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
