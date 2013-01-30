Ext.onReady(function(){
    var breadcrumbView = Ext.create('Ext.toolbar.BreadCrumbs', {
        renderTo: document.body,
        gtIconCls:'thread-greaterthan-icon',
        removeIconCls:'thread-remove-icon',
        crumbCls:'breadCrumb',

        width   : 700,
        onRemoveItem:function( btn ){
        }, 
        onRemoveSelection:function( aBtn ){
            if( aBtn instanceof Array ){
                for( var i=0,l=aBtn.length,itm=null; i<l; i++ ){
                }
            }
        }
    });

    var addedItems = [];

    Ext.create('Ext.toolbar.Toolbar', {
        renderTo: document.body,
        width   : 700,
        margin  : '5 0 0 0',
        items   : [
            {
                text   : 'Add a crumb',
                scope  : this,
                handler: function() {
                    var text = prompt('Please enter the text for your crumb:');
                    text = text.split(',');
                    for( var i=0, l=text.length,itm=null; i<l; i++ ){
                        itm = text[i];
                        addedItems.push( breadcrumbView.onItemAdded(itm.trim()) );
                    }
                }
            }
        ]
    });
});
