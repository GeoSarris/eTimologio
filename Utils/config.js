
import fs  from 'fs';
import path  from 'path';

function getConfig() {
    const configPath = path.resolve('./Resources/config.json');
    const rawData = fs.readFileSync(configPath);
    const config = JSON.parse(rawData);
    return config;
}

export { getConfig };