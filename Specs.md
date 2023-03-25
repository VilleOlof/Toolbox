
# Toolbox Specs

## Inhouse Module Standards

A set of standards for modules to follow.  
In terms of formatting, Data & Setting handling, and more.  

## Module View

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
