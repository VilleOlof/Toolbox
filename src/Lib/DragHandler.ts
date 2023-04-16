import { AppSettings } from "./AppSettings";
import { ModuleHandler } from "./ModuleHandler";

export namespace DragHandler {

    const MouseEventType = {
        Column: 'column',
        Module: 'module',
    } as const;
    type MouseEventType = typeof MouseEventType[keyof typeof MouseEventType];

    type ElementData = {
        element: HTMLElement | null,
        moveCallback: (e: MouseEvent) => void,
    }

    let ShowDragCorners: boolean = false;

    let ActiveDragType: MouseEventType | null = null;

    let ActiveColumn: ElementData = {
        element: null,
        moveCallback: (e: MouseEvent) => {e},
    };
    let ActiveModule: ElementData = {
        element: null,
        moveCallback: (e: MouseEvent) => {e},
    };

    const MouseMoveEvent = (event: MouseEvent) => {
        if (!ActiveDragType) return;

        switch (ActiveDragType) {
            case MouseEventType.Column:
                ActiveColumn.moveCallback(event);
                break;
            case MouseEventType.Module:
                ActiveModule.moveCallback(event);
                break;
        }
    }

    export function Init(): void {
        addEventListener('mouseup', (e) => {StopDrag(e)});

        UpdateAll();
        ForceAllDragCorners('none');
    }

    export function UpdateAll(): void {
        AddCornerDrags();
        AddCornerDragListeners();
        UpdateColumnsAndModulesEvent();

        if (ShowDragCorners) ForceAllDragCorners('block');
        else ForceAllDragCorners('none');
    }

    function AddCornerDrags(): void {
        let dragElement: HTMLDivElement = document.createElement('div');
        dragElement.classList.add('cornerDrag');

        const AllColumns = document.querySelectorAll('.column') as NodeListOf<HTMLElement>;
        AllColumns.forEach((column) => {
            if (column.querySelector('.cornerDrag')) return;
            column.appendChild(dragElement.cloneNode());
        });

        const AllModules = document.querySelectorAll('.module') as NodeListOf<HTMLElement>;
        AllModules.forEach((module) => {
            if (module.querySelector('.cornerDrag')) return;
            module.appendChild(dragElement.cloneNode());
        });
    }

    function StopDrag(event: MouseEvent): void {
        removeEventListener('mousemove', MouseMoveEvent);

        DeleteElementIfTrash(event);

        if (ActiveDragType === MouseEventType.Module) {
            StopDragModule(event);
            ModuleHandler.SaveLayout();
        }
        else if (ActiveDragType === MouseEventType.Column) {
            StopDragColumn(event);
            ModuleHandler.SaveLayout();
        }
    }

    function StopDragColumn(event: MouseEvent): void {
        if (!ActiveColumn?.element) return;

        ActiveColumn.element.style.top = '0px';
        ActiveColumn.element.style.left = '0px';

        ActiveColumn.element.style.pointerEvents = 'auto';

        const AllColumns = document.querySelectorAll('.column') as NodeListOf<HTMLElement>;
        const ColumnContainer = document.querySelector('#columnContainer') as HTMLElement;

        if (AllColumns.length <= 1) {
            ColumnContainer.appendChild(ActiveColumn.element);

            ActiveColumn.element = null;
            ActiveDragType = null;
        
            return;
        }

        const ColumnDistanceMid = Math.abs((AllColumns[1].getBoundingClientRect().left - AllColumns[0].getBoundingClientRect().right) / 2);

        AllColumns.forEach((column) => {
            if (!ActiveColumn?.element) return;
    
            const ColumnBounds = column.getBoundingClientRect();
            const middleX = ColumnBounds.left + (ColumnBounds.width / 2);

            const MirrorFlipped = AppSettings.GetSetting('MirrorFlipped', false);
            let InsertBefore = event.clientX >= (ColumnBounds.left - ColumnDistanceMid) && event.clientX <= middleX;
            let InsertAfter = event.clientX >= middleX && event.clientX <= (ColumnBounds.right + ColumnDistanceMid);

            if (MirrorFlipped) {
                [InsertBefore, InsertAfter] = [InsertAfter, InsertBefore];
            }
    
            if (InsertBefore) {
                ColumnContainer.insertBefore(ActiveColumn.element, column);
            }
            else if (InsertAfter) {
                if (column.nextSibling) {
                    ColumnContainer.insertBefore(ActiveColumn.element, column.nextSibling);
                }
                else {
                    ColumnContainer.appendChild(ActiveColumn.element);
                }
            }
        });
    
        ActiveColumn.element = null;
        ActiveDragType = null;
    }

    function StopDragModule(event: MouseEvent): void {
        if (!ActiveModule?.element) return;

        ActiveModule.element.style.top = '0px';
        ActiveModule.element.style.left = '0px';

        ActiveModule.element.style.pointerEvents = '';

        const parentColumn = document.querySelector('.column-active') as HTMLElement;
        if (!parentColumn) {
            ActiveModule.element = null;
            ActiveDragType = null;
            return;
        }

        const ActiveColumnSize = parentColumn.classList.contains('is-small') ? "is-small" : "is-large";
        const ModuleColumnSize = (ActiveModule.element.parentElement as HTMLElement).classList.contains('is-small') ? "is-small" : "is-large";
        if (ActiveColumnSize != ModuleColumnSize) return;

        const AllColumnModules = parentColumn.querySelectorAll('.module') as NodeListOf<HTMLElement>;

        if (AllColumnModules.length <= 1) {
            parentColumn.appendChild(ActiveModule.element);

            ActiveModule.element = null;
            ActiveDragType = null;
        
            return;
        }

        const ModuleDistanceMid = (AllColumnModules[1].getBoundingClientRect().top - AllColumnModules[0].getBoundingClientRect().bottom) / 2;

        AllColumnModules.forEach((module) => {
            if (!ActiveModule?.element) return;

            const ModuleBounds = module.getBoundingClientRect();
            const middleY = ModuleBounds.top + (ModuleBounds.height / 2);

            if (event.clientY >= (ModuleBounds.top - ModuleDistanceMid) && event.clientY <= middleY) {
                parentColumn.insertBefore(ActiveModule.element, module);
            }
            else if (event.clientY >= middleY && event.clientY <= (ModuleBounds.bottom + ModuleDistanceMid)) {
                if (module.nextSibling) {
                    parentColumn.insertBefore(ActiveModule.element, module.nextSibling);
                }
                else {
                    parentColumn.appendChild(ActiveModule.element);
                }
            }
        });

        ActiveModule.element = null;
        ActiveDragType = null;
    }

    function StartDrag(event: MouseEvent,  Type: MouseEventType): void {
        event.preventDefault();

        ActiveDragType = Type;

        addEventListener('mousemove', (e) => MouseMoveEvent(e));

        const YOffset = event.clientY;
        const XOffset = event.clientX;

        if (Type === MouseEventType.Column) {
            ActiveColumn.moveCallback = (e: MouseEvent) => {
                CornerDragMove(e, Type, YOffset, XOffset);
            }

            ActiveColumn.element = document.querySelector('.column-active') as HTMLElement;
            ActiveColumn.element.style.userSelect = 'none';
        }
        else {
            ActiveModule.moveCallback = (e: MouseEvent) => {
                CornerDragMove(e, Type, YOffset, XOffset);
            }

            ActiveModule.element = document.querySelector('.module-active') as HTMLElement;
            ActiveModule.element.style.userSelect = 'none';
        }

        ModuleHandler.SaveLayout();
    }

    function CornerDragMove(event: MouseEvent, Type: MouseEventType, YOffset: number, XOffset: number): void {
        if (Type === MouseEventType.Column) {
            if (!ActiveColumn?.element) return;

            ActiveColumn.element.style.top = `${event.clientY - YOffset}px`;
            ActiveColumn.element.style.left = `${event.clientX - XOffset}px`;

            ActiveColumn.element.style.pointerEvents = 'none';
        }
        else if (Type === MouseEventType.Module) {
            if (!ActiveModule?.element) return;

            ActiveModule.element.style.top = `${event.clientY - YOffset}px`;
            ActiveModule.element.style.left = `${event.clientX - XOffset}px`;

            ActiveModule.element.style.pointerEvents = 'none';
        }
    }

    function AddCornerDragListeners(): void {
        const ColumnCornerDrags = document.querySelectorAll('.column > .cornerDrag') as NodeListOf<HTMLElement>;

        ColumnCornerDrags.forEach((cornerDrag) => {
            cornerDrag.addEventListener('mousedown', (e) => {StartDrag(e, MouseEventType.Column)});
        });

        const ModuleCornerDrags = document.querySelectorAll('.module > .cornerDrag') as NodeListOf<HTMLElement>;

        ModuleCornerDrags.forEach((cornerDrag) => {
            cornerDrag.addEventListener('mousedown', (e) => {StartDrag(e, MouseEventType.Module)});
        });
    }

    function UpdateColumnsAndModulesEvent(): void {

        const columns = document.querySelectorAll('.column') as NodeListOf<HTMLElement>;
        columns.forEach((column) => {
            column.addEventListener('mouseenter', () => {HandleActiveClass(column, MouseEventType.Column, true)});
            column.addEventListener('mouseleave', () => {HandleActiveClass(column, MouseEventType.Column, false)});
        });

        const modules = document.querySelectorAll('.module') as NodeListOf<HTMLElement>;
        modules.forEach((module) => {
            module.addEventListener('mouseenter', () => {HandleActiveClass(module, MouseEventType.Module, true)});
            module.addEventListener('mouseleave', () => {HandleActiveClass(module, MouseEventType.Module, false)});
        });
    }

    function HandleActiveClass(element: HTMLElement, type: MouseEventType, add: boolean): void {
        if (add) element.classList.add(`${type}-active`);
        else element.classList.remove(`${type}-active`);
    }

    export function ToggleDragCorners(toggleTrash: boolean = true): void {
        ShowDragCorners = !ShowDragCorners;

        const dragCorners = document.querySelectorAll('.cornerDrag') as NodeListOf<HTMLElement>;
        dragCorners.forEach((corner) => {
            if (ShowDragCorners) corner.style.display = 'block';
            else corner.style.display = 'none';
        });

        if (toggleTrash) ToggleTrash();
    }

    export function ForceAllDragCorners(display: 'block' | 'none'): void {
        if (!ShowDragCorners) return;
        const dragCorners = document.querySelectorAll('.cornerDrag') as NodeListOf<HTMLElement>;
        dragCorners.forEach((corner) => {
            corner.style.display = display;
        });
    }

    export function ToggleTrash(): void {
        const trash = document.querySelector('#trashArea') as HTMLElement;

        if (ShowDragCorners) trash.style.display = 'block';
        else trash.style.display = 'none';
    }

    function DeleteElementIfTrash(e: MouseEvent): boolean {
        const trashElement = document.querySelector('#trashArea') as HTMLElement;
        const trashBounds: DOMRect = trashElement.getBoundingClientRect();

        // If the drag corners are not shown, return false
        // Aka (Edit Mode)
        if (!ShowDragCorners) return false;

        // If the mouse is outside the trash area
        if (e.clientX >= trashBounds.left && e.clientX <= trashBounds.right && e.clientY >= trashBounds.top && e.clientY <= trashBounds.bottom) {
            ActiveDragType = null;
            
            if (ActiveModule?.element) {
                delete ModuleHandler.RegisteredModules[ActiveModule.element.id];
                
                ActiveModule.element.remove();
                ActiveModule.element = null;
            }
            else if (ActiveColumn?.element) {
                const modules = ActiveColumn.element.querySelectorAll('.module') as NodeListOf<HTMLElement>;

                modules.forEach((module) => {
                    delete ModuleHandler.RegisteredModules[module.id];
                });

                ActiveColumn.element.remove();
                ActiveColumn.element = null;
            }

            ModuleHandler.SaveLayout();
            ModuleHandler.UpdateNavEntries();

            return true;
        }
        return false;
    }
}