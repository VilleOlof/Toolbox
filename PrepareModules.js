import fs from 'fs';
import path from 'path';
const modules = fs.readdirSync('./modules');

let moduleList = [];

modules.forEach((module) => {
    const name = path.basename(module, ".svelte");
    moduleList.push(name);
});

const JSONString = JSON.stringify(moduleList);

fs.writeFileSync('./module_list.json', JSONString);