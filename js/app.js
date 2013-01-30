Ext.onReady(function(){
    var breadcrumbView = Ext.create('Ext.toolbar.BreadCrumbs', {
        renderTo: document.body,
        gtIconCls:'thread-greaterthan-icon',
        removeIconCls:'thread-remove-icon',
        crumbCls:'breadCrumb',

        width   : 700,

        onRemoveItem:function( btn ){
            //This is called when a user clicks on a crumb. The crumb is an Ext.button.Button, if you passed in
            //the optional param 2 to onItemAdded, it will be attached to this btn as _extraData
        }, 
        onRemoveSelection:function( aBtn ){
            //This is called when a user clicks the > button. The > removes all crumbs abover the > button
            //aBtn is an array of the buttons that were removed.
            if( aBtn instanceof Array ){
                for( var i=0,l=aBtn.length,itm=null; i<l; i++ ){
                }
            }
        }
    });

    Ext.create('Ext.toolbar.Toolbar', {
        renderTo: document.body,
        width   : 700,
        margin  : '5 0 0 0',
        items   : [
            {
                text   : 'Add a crumb',
                scope  : this,
                handler: function() {
                    var text = prompt('Please enter the text for your crumb. Use commas to list crumbs:');
                    text = text.split(',');
                    for( var i=0, l=text.length,itm=null; i<l; i++ ){
                        itm = text[i];
                        //This is how you add an item to the breadcrumb view
                        //Param 1 is some text to show the user
                        //Param 2 is an optional object to attach to the crumb.
                        breadcrumbView.onItemAdded(itm.trim(), {});
                    }
                }
            }
        ]
    });
});
