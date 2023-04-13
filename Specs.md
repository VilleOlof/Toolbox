
--- ResolveFunctions måste ha timeline i början (check)

--- _JSONSavePath i DataStore är dubbel i win10 men bara går ut 1 gång i win11?

--- electron always on top fungerar knas i win11

---Clear all columns in settings page
-- move reset to settings

open module folder i settings





# Toolbox Specs

## Resources  

[Simple Icons](https://simpleicons.org/)  
[Google Icons](https://fonts.google.com/icons)

## Inhouse Module Standards

A set of standards for modules to follow.  
In terms of formatting, Data & Setting handling, and more.  

## Module View

// this doesnt really work since when the program
// is compiled, the path always points to index.html
// when doing it in a svelte dynamically loaded component.
// maybe use a function that returns the module name
// with the name also being the argument but add an extra number
// incase the module name is the same as another module.
// would allow for easy copy and paste of the modules

Module Component ID is the file name of the module.  

Draggable Module.  
Hover on the module corner (triangle?) to drag the module.  

1 Column = (1080 / 3) 360px  
Margin Round each side;  

When placing a module in a column.  
it should create a row div the size of the maxiumum height of a module.  

When creating a new column, there should be two sizes  
Small & Large.  

Module dropdown, drag module name to column.  

When dragging a module to the + (module button) it should show a trash icon to delete the module from the view.  

Small  

```mk
----
|  |
|  |
|  |
----
```

Large  (Small x4)

```mk
----------------
|              |
|              |
|              |
----------------
```

Small Heights:
1:1
1:2
1:4

Large Heights:
1:1
1:2

event listeners only on column (mouseEnter, mouseLeave).  
arrows to switch modules vertically  

Module assets: (images, scripts)
modules/assets/moduleID/...
