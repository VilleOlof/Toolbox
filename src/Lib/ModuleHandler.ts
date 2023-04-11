import modules from '../../module_list.json'
import moduleIgnores from '../../module_ignore.json'

import { DataStore } from '../Stores/DataStore';
import { DragHandler } from './DragHandler';

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

    export type ColumnData = {
        size: ComponentSize,
        modules: string[],
        ID: string
    }

    export async function Init(ColumnContainerDiv: HTMLDivElement): Promise<HTMLDivElement> {
        if (!_DataStore) _DataStore = new DataStore("ModuleHandler");

        if (_FirstLoad) {

            if (!ColumnContainer) {
                ColumnContainer = ColumnContainerDiv;
            }
            
            await LoadLayout();
            DragHandler.Init();

            _FirstLoad = false;
            return ColumnContainerDiv;
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

    export function SaveLayout(): void {
        _DataStore.Set("RegisteredModules", RegisteredModules);

        let columns: ColumnData[] = [];

        let columnDivs = ColumnContainer.querySelectorAll(".column");
        columnDivs.forEach(columnDiv => {
            let size = columnDiv.classList.contains("is-large") ? ComponentSize.Large : ComponentSize.Small;
            let modules: string[] = [];

            let moduleDivs = columnDiv.childNodes as NodeListOf<HTMLDivElement>;
            moduleDivs.forEach(moduleDiv => {
                if (!moduleDiv.classList.contains("module")) return;
                modules.push(moduleDiv.id);
            });

            columns.push({
                size: size,
                modules: modules,
                ID: columnDiv.id
            });
        });

        _DataStore.Set("Columns", columns);

        UpdateNavEntries();
    }

    async function LoadLayout(): Promise<string> | undefined {
        let savedColumns = _DataStore.Get<ColumnData[]>("Columns");
        if (!savedColumns) return undefined;

        for (let column of savedColumns) {
            let columnDiv = AddColumn(column.size, column.ID);

            for (let moduleName of column.modules) {

                let moduleImport = ModuleImports[moduleName];
                if (moduleImport === undefined) return;
                let module = await moduleImport();

                new module({
                    target: columnDiv,
                    props: {}
                });

                RegisteredModules[moduleName] = {
                    name: moduleName,
                    size: column.size
                };
            }
        }

        return ColumnContainer.innerHTML;
    }

    export function RegisterModule(moduleName: string, componentSize: ComponentSize): void {
        console.log("Registering module: " + moduleName);
        RegisteredModules[moduleName] = {
            name: moduleName,
            size: componentSize
        };

        UpdateNavEntries();

        let moduleDiv = document.getElementById(moduleName);
        moduleDiv.classList.add("module");

        if (!_FirstLoad) {

            //move the module to the correct column
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

            SaveLayout();
            DragHandler.UpdateAll();
        }
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

        //TODO: fix this
        // if (Object.keys(RegisteredModules).includes(moduleName)) {
        //     //check if the module has already been registered and how many times
        //     let count = 0;
        //     for (let key in RegisteredModules) {
        //         const onlyName = RegisteredModules[key].name.split("_")[0];
        //         console.log(onlyName, moduleName);
        //         if (onlyName === moduleName) count++;
        //     }
        //     if (count > 0) moduleName += "_" + count;
        //     console.log("Module already registered, adding suffix: " + moduleName);
        // }

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

    export function AddColumn(componentSize: ComponentSize, IDOverwrite?: string): HTMLDivElement {
        let ColumnDiv = document.createElement("div");
        ColumnDiv.classList.add("column");
        ColumnDiv.classList.add("is-" + ComponentSize[componentSize].toLowerCase()); // "is-small" | "is-large"
        ColumnDiv.id = IDOverwrite ?? require('crypto').randomBytes(16).toString('hex');
        ColumnContainer.appendChild(ColumnDiv);

        if (!_FirstLoad) {
            DragHandler.UpdateAll();
            DragHandler.ForceAllDragCorners('block');
            SaveLayout();
        }

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

    export function UpdateNavEntries(): void {
        const moduleEntries = document.querySelector("#moduleEntries").childNodes as NodeListOf<HTMLLIElement>;
        moduleEntries.forEach(entry => {
            const moduleName = entry.textContent.replace("+ ", "").trim();
            if (Object.keys(RegisteredModules).includes(moduleName)) {
                entry.classList.add("is-active");
            }
            else {
                entry.classList.remove("is-active");
            }
        });
    }
}