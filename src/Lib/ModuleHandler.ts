import modules from '../../module_list.json'
import moduleIgnores from '../../module_ignore.json'

import { DataStore } from '../Stores/DataStore';

export namespace ModuleHandler {

    export let ColumnContainer: HTMLDivElement = undefined;

    export let RegisteredModules: {[key: string]: ModuleData} = {};
    export let ModuleImports: {[key: string]: Function} = GetModuleImports();

    let _DataStore: DataStore;
    let _FirstLoad: boolean = true;

    export enum ComponentSize {
        Small = "Small",
        Large = "Large"
    }

    export type ModuleData = {
        name: string,
        size: ComponentSize
    }

    export function Init(ColumnContainerDiv: HTMLDivElement): HTMLDivElement {
        if (!_DataStore) _DataStore = new DataStore("ModuleHandler");

        if (_FirstLoad) {
            let savedContainer = LoadContent();
            if (savedContainer) {
                ColumnContainerDiv.innerHTML = savedContainer;

                ColumnContainer = ColumnContainerDiv;

                return ColumnContainerDiv;
            }
            _FirstLoad = false;
        }

        if (!ColumnContainer) {
            ColumnContainer = ColumnContainerDiv;
        }
        else {
            //copy the old children from ColumnContainer to ColumnContainerDiv
            while (ColumnContainer.firstChild) {
                ColumnContainerDiv.appendChild(ColumnContainer.firstChild);
            }
            ColumnContainer = ColumnContainerDiv;
        }

        return ColumnContainer;
    }

    //TODO
    //Saves the entire ColumnContainer HTML including modules HTML
    //Wont save empty columns

    //Doesnt feel like the best way. Since we could just save the module names/IDs and their sizes
    //and then load them in the correct columns
    function SaveContainer(): void {
        _DataStore.Set("ColumnContainer", ColumnContainer.innerHTML);
        _DataStore.Set("RegisteredModules", RegisteredModules);
    }

    function LoadContent(): string | undefined {
        let savedModules = _DataStore.Get<{[key: string]: ModuleData}>("RegisteredModules");
        if (savedModules) RegisteredModules = savedModules;

        let savedContainer = _DataStore.Get<string>("ColumnContainer");
        if (savedContainer) {
            return savedContainer;
        }

        return undefined;
    }

    export function RegisterModule(moduleName: string, componentSize: ComponentSize): void {
        console.log("Registering module: " + moduleName);
        RegisteredModules[moduleName] = {
            name: moduleName,
            size: componentSize
        };

        //move the module to the correct column
        let moduleDiv = document.getElementById(moduleName);
        if (moduleDiv) {
            let column = GetFirstColumn(componentSize);
            if (column) {
                column.appendChild(moduleDiv);
            }
            else {
                column = AddColumn(componentSize);
                column.appendChild(moduleDiv);
            }
        }

        SaveContainer();
    }

    function GetModuleImports(): {[key: string]: Function} {
        let moduleImports: {[key: string]: Function} = {};

        modules.forEach(module => {
            if (moduleIgnores.includes(module)) return;
            moduleImports[module] = (async function() {
                return (await import(/* @vite-ignore*/ `../../modules/${module}.svelte`)).default
            });
        });

        return moduleImports;
    }

    export async function AddModuleInColumn(moduleName: string, ColumnDiv: HTMLElement): Promise<void> {
        let moduleImport = ModuleImports[moduleName];
        if (moduleImport === undefined) return;
        if (Object.keys(RegisteredModules).includes(moduleName)) return;

        let module = await moduleImport();

        new module({
            target: ColumnDiv,
            props: {}
        });

        if (!Object.keys(RegisteredModules).includes(moduleName)) {
            document.body.removeChild(document.body.lastChild);
        }
    }

    export function AddColumn(componentSize: ComponentSize): HTMLDivElement {
        let ColumnDiv = document.createElement("div");
        ColumnDiv.classList.add("column");
        ColumnDiv.classList.add("is-" + ComponentSize[componentSize].toLowerCase()); // "is-small" | "is-large"
        ColumnContainer.appendChild(ColumnDiv);

        return ColumnDiv;
    }

    export function GetFirstColumn(size: ComponentSize): HTMLDivElement {
        let columns = ColumnContainer.getElementsByClassName("column");
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i] as HTMLDivElement;
            if (column.classList.contains("is-" + ComponentSize[size].toLowerCase())) {
                return column;
            }
        }
        return undefined;
    }
}