const menuHTML = {
    createMenuTemplate: () => {
        const ids = {
            menuContainer : "menu",
            navigationPanel : "menu-navigation",
            menuItemsContainer : "menu-container",
        };
        const   menu            = `<div id='${ids.menuContainer}' class='main-container'></div>`,
                navigationPanel = `<div id='${ids.navigationPanel}'></div>`,
                menuContainer   = `<div id='${ids.menuItemsContainer}'></div>`;
        return {menu: menu, containers: [navigationPanel, menuContainer]};
    },
    
    createMenuLabels : () => {
        const classes = {
                codeInput:  'menu-code',
                nameInput:  'menu-name',
                priceInput: 'menu-price',
        };
        const   createNewButton = '<button class="new-order-button" onclick="newMenuItem()"><i class="fas fa-folder-plus"></i> Dodaj pozycję</button>',
                codeInput       = `<input type='text' class='${classes.codeInput}'  value='Kod'         readonly>`,
                nameInput       = `<input type='text' class='${classes.nameInput}'  value='Nazwa'       readonly>`,
                price0Input     = `<input type='text' class='${classes.priceInput}' value='Sztuka'      readonly>`,
                price1Input     = `<input type='text' class='${classes.priceInput}' value='Gaiwan'      readonly>`,
                price2Input     = `<input type='text' class='${classes.priceInput}' value='Opakowanie'  readonly>`,
                price3Input     = `<input type='text' class='${classes.priceInput}' value='Na wagę'     readonly>`;
        
        return [codeInput, nameInput, price0Input, price1Input, price2Input, price3Input, 
                            createNewButton];    
    },
    
    createMenuItemContainer: (itemId) => { return `<div id='${itemId}' class='menu-item'></div>`; },
    
    createMenuItem: (menuValues) => {
        const classes = {
            codeInput:      'menu-code',
            nameInput:      'menu-name',
            priceInput:     'menu-price',
            deleteButton:   'delete-button',
            updateButton:   'update-button',
            itemDiv:        'menu-item',
        };    
        const   deleteButton    = `<button class='${classes.deleteButton}' onclick="deleteMenuItem('${menuValues._id}')"><i class="fas fa-trash-alt"></i> Usuń</button>`,
                updateButton    = `<button class='${classes.updateButton}' onclick="updateMenuItem('${menuValues._id}')">Zapisz <i class="fas fa-pencil-alt"></i></button>`,
                codeInput       = `<input type='text'   class='${classes.codeInput}'                value='${menuValues.registerCode}'>`,
                nameInput       = `<input type='text'   class='${classes.nameInput}'                value='${menuValues.name}'>`,
                price0Input     = `<input type='text'   class='${classes.priceInput} menu-price0'   value='${menuValues.prices.default}'>`,
                price1Input     = `<input type='text'   class='${classes.priceInput} menu-price1'   value='${menuValues.prices.gaiwan}'>`,
                price2Input     = `<input type='text'   class='${classes.priceInput} menu-price2'   value='${menuValues.prices.package}'>`,
                price3Input     = `<input type='text'   class='${classes.priceInput} menu-price3'   value='${menuValues.prices.bulk}'>`;
                
        return [deleteButton, 
                codeInput, nameInput, price0Input, price1Input, price2Input, price3Input, 
                updateButton];
    },
};