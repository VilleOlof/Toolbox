import fs from 'fs';
import path from 'path';

function PrepareModuesLists(modules) {
    let moduleList = [], ignoreList = [];

    modules.forEach((module) => {
        const name = path.basename(module, ".svelte");

        if (name.endsWith(".disabled")) {
            const disabledName = name.replace(".svelte.disabled", "");
            ignoreList.push(disabledName); 
            return;
        }

        moduleList.push(name);
    });

    const moduleListJSON = JSON.stringify(moduleList);
    const ignoreListJSON = JSON.stringify(ignoreList);

    fs.writeFileSync('./module_list.json', moduleListJSON);
    fs.writeFileSync('./module_ignore.json', ignoreListJSON);
}

const modules = fs.readdirSync('./modules');
PrepareModuesLists(modules);