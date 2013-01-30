/** ********************************
 * Author: Steve Cirelli
 * Date: 1/30/2013
 * Version: 1.0
 * *********************************/
Ext.define('Ext.toolbar.BreadCrumbs', {
    extend:'Ext.toolbar.Toolbar', 
    alias: 'widget.breadcrumbs',//creates an xtype 
    frame:false,
    border:false,
    minHeight:25,

    //---User can override these---
    gtIconCls:'thread-greaterthan-icon',
    removeIconCls:'thread-remove-icon',
    crumbCls:'breadCrumb',
    leftBookend: { 
        text:'...',
        //cls:this.crumbCls, //'breadCrumb'
        iconCls:''
    },
    oRightBookend:{
        text:'...',
        //cls:this.crumbCls, //'breadCrumb'
        iconCls:''
    }, 
    rightBookend:null,
    //----------------------------
    rightFiller:{
        xtype:'tbfill',
        _type:'filler'
    },

    defaults:{
        xtype:'button',
        listeners:{
            click:function(){
                var p    = this.findParentByType('breadcrumbs'),
                    type = this._type;
                switch( type ){
                    case 'btn':
                        p.onItemRemoved( this );
                    break;
                    case 'gt':
                        p.onItemSelectionRemoved( this );
                    break;
                };
            }
        }
    },

    MODES:{
        NONE:0,
        LEFT_BOOKEND:1,
        RIGHT_BOOKEND:2,
        BOTH_BOOKENDS:3
    },
    oMode:null,
    aModes:[],

    getMode:function( nMode ){
        switch(nMode){
            case this.MODES.LEFT_BOOKEND:
                return this.aModes[nMode];
            case this.MODES.RIGHT_BOOKEND:
                return this.aModes[nMode];
            case this.MODES.BOTH_BOOKENDS:
                return this.aModes[nMode];
            case this.MODES.NONE:
            default:
                return this.aModes[this.MODES.NONE];
        }
    },
    setMode:function( nMode ){
        switch(nMode){
            case this.MODES.LEFT_BOOKEND:
                this.oMode = this.aModes[nMode];
                console.log('Changed mode to: LEFT_BOOKEND');
                break;
            case this.MODES.RIGHT_BOOKEND:
                this.oMode = this.aModes[nMode];
                console.log('Changed mode to: RIGHT_BOOKEND');
                break;
            case this.MODES.BOTH_BOOKENDS:
                this.oMode = this.aModes[nMode];
                console.log('Changed mode to: BOTH_BOOKENDS');
                break;
            case this.MODES.NONE:
            default:
                this.oMode = this.aModes[this.MODES.NONE];
                console.log('Changed mode to: NO_BOOKENDS');
        }
    },

    /*********************************************************************************
     * Called after a button has been removed. Users can override these or the Ext 
     * one, remove().
     * @param:
     * @return:
     * @throws:
     * @Public
     * ******************************************************************************/
    onRemoveItem:function( btn ){}, 
    onRemoveSelection:function( aBtn ){},

    /*********************************************************************************
     * User can call this to do any initialization they want. For when you're not using
     * Ext.extend on this class.
     * ******************************************************************************/
    __init:function(){},

    /*********************************************************************************
     * Remove just one item from the list
     * @param: btn - The Button to remove
     * @return:
     * @throws:
     * @Private
     * ******************************************************************************/
    visuallyRemoveItem:function( btn ){
        if( !btn || btn instanceof Ext.button.Button === false ) return [];
        var aRtn = new Array(),
            prevBtn = btn.previousSibling();
        if( prevBtn._type == 'gt' || prevBtn._type == 'btn' ){
            aRtn.push(prevBtn);
            this.remove(prevBtn);
        }else if( prevBtn == null || prevBtn._type == 'bookend' ){
            prevBtn = btn.nextSibling();
            if( prevBtn && prevBtn._type == 'gt' ){
                aRtn.push(prevBtn);
                this.remove(prevBtn);
            }
        }
        this.remove(btn);        
        aRtn.push(btn);

        this.onRemoveItem( btn );

        return aRtn;
    },

    /*********************************************************************************
     * Recursively remove items up to the begining of the list.
     * @param: btn - The button that is inbetween items to start remvoing from.
     * @return:
     * @throws:
     * @Private
     * ******************************************************************************/
    visuallyRemoveSection:function( btn, aBtns ){
        if( !btn || (btn.xtype != 'button' && btn.xtype != 'tbfill' ) ) return;
        this.visuallyRemoveSection(btn.nextSibling(), aBtns);
        if( btn.xtype == 'tbfill' ) 
            btn = this.remove(btn);
        else{
            aBtns.push(btn);
            btn = this.remove(btn);
        }
        return btn;
    },
    //@Private
    removeSection:function( btn ){
        var aBtns = new Array();
        if( btn && btn._type == 'gt' ){
            this.visuallyRemoveSection( btn, aBtns );
            this.onRemoveSelection( aBtns );
        }
        return aBtns;
    },

    /*********************************************************************************
     * This is the only method a user should have to call.
     * @param: sBtnText   - string: The buttons text
     * @param: oExtraData - object: Extra data to attach to the button if needed. (optional)
     * @return:
     * @throws:
     * @Private
     * ******************************************************************************/
    visuallyAddItem:function( sBtnText, oExtraData ){
        var aItems = this.items.items,
            addedItems = [];
        if( aItems.length <= 1 ){//List is "empty", adding the first item. The first Item is actually the hidden '...' button
            addedItems = this.add(
                {
                    iconCls:this.removeIconCls,//'thread-remove-icon',
                    _type:'btn',
                    _extraData:oExtraData,
                    text: sBtnText,
                    cls:this.crumbCls //'breadCrumb'
                }
            );
        }else{
            addedItems = this.add(
                {
                    iconCls:this.gtIconCls, //'thread-greaterthan-icon',
                    _type:'gt',
                    width:16,
                    height:16
                },
                {
                    iconCls:this.removeIconCls,//'thread-remove-icon',
                    _type:'btn',
                    _extraData:oExtraData,
                    text: sBtnText,
                    cls:this.crumbCls //'breadCrumb'
                }
            );
        }
        return addedItems;
    },

    /** ********************************
     * @Desc: Calcualtes the width for the bread crumb buttons, excluding the bookends
     * @param: toolbar - Ext.toolbar.Toolbar:
     * @param: bVisibleOnly - boolean: Calc width for visible buttons only
     * @return: undefined
     * @throws: 
     * @Private
     * *********************************/
    getCrumbsWidth:function( toolbar, bVisibleOnly ){
        if( toolbar instanceof Ext.toolbar.Toolbar === false ) return 0;
        var btns = toolbar.items.items,
            sum  = 0,
            nExtraWidth = 2;//Account for padding, border, and margins. I think getWidth doesn't include this
        
        for( var i=0, l=btns.length,itm=null; i<l; i++ ){
            itm = btns[i];
            switch( itm._type ){
                case 'btn':
                case 'gt' :
                    if( !bVisibleOnly  ){
                        sum += btns[i].getWidth() + nExtraWidth;
                    }else if( bVisibleOnly && !itm.hidden ){
                        sum += btns[i].getWidth() + nExtraWidth;
                    }
                break;
            }
        }
        return sum;
    },

    areCrumbsOutofBounds:function(){
        var nTbWidth       = this.getWidth(),
            nLBookEndWidth = this.leftBookend._width,
            nRBookendWidth = this.rightBookend._width,
            tmp            = nLBookEndWidth + nRBookendWidth,
            nCrumbsWidth   = this.getCrumbsWidth( this, true );

        nTbWidth -= tmp; 
        return nCrumbsWidth > nTbWidth;
    },

    getCrumbsLengthDifference:function(){
        var nTbWidth       = this.getWidth(),
            nLBookEndWidth = this.leftBookend._width,
            nRBookendWidth = this.rightBookend._width,
            tmp            = nLBookEndWidth + nRBookendWidth,
            nCrumbsWidth   = this.getCrumbsWidth( this, true );

        nTbWidth -= tmp; 
        return nTbWidth - nCrumbsWidth;
    },

    //@Private
    leftBookendEatCrumb:function(){
        var lbe = this.leftBookend,
            itm = this.leftBookend.nextSibling(),
            aEaten = new Array();
        //expecting the first itm to always be a btn and not a gt
        while( itm.hidden ){
            itm = itm.nextSibling();
        }
        if( itm && itm._type != 'bookend' ){
            aEaten.push(itm);
            itm.hide();
            itm = itm.nextSibling();
            if( itm && itm._type != 'bookend'){
                itm.hide();
                aEaten.push(itm);
            }
        }
        return aEaten;
    },
    //@Private
    leftBookendPukeCrumb:function(){
        var lbe = this.leftBookend,
            itm = this.leftBookend.nextSibling(),
            aRtn = new Array();
        //expecting the first itm to always be a btn and not a gt
        while( itm.hidden ){
            itm = itm.nextSibling();
        }
        itm = itm.previousSibling();
        if( itm && itm._type != 'bookend' ){
            itm.show();
            aRtn.push(itm);
            itm = itm.previousSibling();
            if( itm && itm._type != 'bookend'){
                itm.show();
                aRtn.push(itm);
            }
        }
        return aRtn;
    },
    isLeftBookendStarving:function(){
        var itm = this.leftBookend.nextSibling();
        if( itm && itm._type && itm._type != 'breadcrumb' )
            return !itm.hidden; 
        return true;
    },

    //@Private
    rightBookendEatCrumb:function(){
        var rbe = this.rightBookend,
            itm = this.rightBookend.previousSibling(),
            aEaten = new Array();

        if( itm.xtype == 'tbfill' ) itm = itm.previousSibling();
        //expecting the first itm to always be a btn and not a gt
        while( itm.hidden ){
            itm = itm.previousSibling();
        }
        if( itm && itm._type != 'bookend' ){
            aEaten.push(itm)
            itm.hide();
            itm = itm.previousSibling();
            if( itm && itm._type != 'bookend'){
                itm.hide();
                aEaten.push(itm);
            }
        }
        return aEaten;
    },
    //@Private
    rightBookendPukeCrumb:function(){
        var lbe = this.rightBookend,
            itm = this.rightBookend.previousSibling(),
            aRtn = new Array();

        if( itm.xtype == 'tbfill' ) itm = itm.previousSibling();
        //expecting the first itm to always be a btn and not a gt
        while( itm.hidden ){
            itm = itm.previousSibling();
        }
        itm = itm.nextSibling();
        if( itm && itm._type != 'bookend' ){
            itm.show();
            aRtn.push(itm);
            itm = itm.nextSibling();
            if( itm && itm._type != 'bookend'){
                itm.show();
                aRtn.push(itm);
            }
        }
        return aRtn;
    },
    isRightBookendStarving:function(){
        var itm = this.rightBookend.previousSibling();
        if( itm ){//this would be the tbfiller
            itm = itm.previousSibling();
            if( itm && itm._type && itm._type != 'breadcrumb' )//this should be a button
                return !itm.hidden; 
        }
        return true;
    },

    /***************************************************************************
     * @Private
     * Note: Ext calls this when first item added and last item removed
     * ******************************************************************************/
    _onResize:function( ths, width, height, oldWidth, oldHeight, eOpts ){
        var me = this;
        if( this.nTimerID ){
            clearTimeout(this.id);
        }
        this.nTimerID = setTimeout(function(){
            me.oMode.onResize( ths, width, height, oldWidth, oldHeight, eOpts ); 
        },500);
    },

    /***************************************************************************
     * @Private
     * ******************************************************************************/
    onItemAdded:function( sBtnText, oExtraData ){
        this.oMode.onItemAdded( sBtnText, oExtraData ); 
    },
    
    //@Private
    onItemRemoved:function( btn ){
        this.oMode.onItemRemoved( btn ); 
    },
    //@Private
    onItemSelectionRemoved:function( btn ){
        this.oMode.onItemSelectionRemoved( btn ); 
    },
    //@Private
    onLeftBookendClick:function( btn ){
        this.oMode.onLeftBookendClick(btn);
    },
    //@Private
    onRightBookendClick:function( btn ){
        this.oMode.onRightBookendClick(btn);
    },

    initComponent:function(){
        this.callParent(arguments);
        this.addListener( 'resize',      this._onResize, this );
        //this.addListener( 'add',         this.onItemAdded, this );//Happens before the component is displayed visually and before it has a width
        //this.addListener( 'remove',      this.onItemRemoved, this );
        //this.addListener( 'afterlayout', this.onAfterLayout, this );

        this.aModes.push(
            new conan.NoBookendMode(this),
            new conan.LeftBookendMode(this),
            new conan.RightBookendMode(this),
            new conan.BothBookendMode(this)
        );
        this.setMode(this.MODES.NONE);

        var oBookend = {
                _type:'bookend',
                hidden:true,
                _width:0
            },
            oLBookend = this._extend( { 
                itemId:'breadcrumb_leftbookend',
                listeners:{
                    click:function( ths, e, eOpts ){
                        var p    = this.findParentByType('breadcrumbs'),
                            type = this._type;
                        switch( type ){
                            case 'bookend':
                                p.onLeftBookendClick( this );
                            break;
                        };
                    },
                    render:function( ths, eOpts ){
                        this._width = ths.getWidth();
                    }
                }
            }, oBookend ),
            oRBookend = this._extend( { 
                itemId:'breadcrumb_rightbookend',
                listeners:{
                    click:function( ths, e, eOpts ){
                        var p    = this.findParentByType('breadcrumbs'),
                            type = this._type;
                        switch( type ){
                            case 'bookend':
                                p.onRightBookendClick( this );
                            break;
                        };
                    },
                    render:function( ths, eOpts ){
                        this._width = ths.getWidth();
                    }
                }
            }, oBookend );

        this.leftBookend  = Ext.create('Ext.Button', this._extend(this.leftBookend,  oLBookend)),
        this.oRightBookend = this._extend(this.oRightBookend, oRBookend);
        this.rightBookend = Ext.create('Ext.Button', this.oRightBookend);
        this.add( this.leftBookend );
        this.__init();
    },

    //Helper function
    _extend:function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }
});

//By Crumb!!!! ...uhh Crom!! ...Bread Crumb?!?!
if( conan === undefined ) var conan = new Object();
;(function( conan ){
    conan.Mode = function(){
        this.onLeftBookendClick = function( btn ){};
        this.onRightBookendClick = function( btn ){};

        /** ********************************
         * @Desc: Called when a _type 'btn' is remvoed
         * @param:
         * @return: undefined
         * @throws: 
         * *********************************/
        this.onItemRemoved = function( oBtn ){};
        this.onItemSelectionRemoved = function( oBtn ){};
        this.onItemAdded   = function( sBtnText, oExtraData ){};
        this.onResize = function( ths, width, height, oldWidth, oldHeight, eOpts ){};
        this.setToolbar = function( oToolbar ){};
    };
    conan.AMode = function( ){
        this.setToolbar = function( oToolbar ){
            if( oToolbar instanceof Ext.toolbar.Toolbar ){
                this.oToolbar = oToolbar;
            }else{
                throw 'conan.AMode.setToolbar() only accepts intances of Ext.toolbar.Toolbar.';
            }
        };
        this.hideRightBookend = function(){
            this.oToolbar.rightBookend.hide();
            this.oToolbar.remove( this.oToolbar.rightBookend.previousSibling() );
            this.oToolbar.remove( this.oToolbar.rightBookend );
        };
        this.showRightBookend = function(){
            this.oToolbar.add( this.oToolbar.rightFiller );
            this.oToolbar.rightBookend = this.oToolbar.add( this.oToolbar.oRightBookend );
            this.oToolbar.rightBookend.show();
        };
        this.hideLeftBookend = function(){
            this.oToolbar.leftBookend.hide();
        };
        this.showLeftBookend = function(){
            this.oToolbar.leftBookend.show();
        };
    }
    conan.AMode.prototype = new conan.Mode();

    //NoBookendMode
    conan.NoBookendMode = function( oToolbar ){
        this.setToolbar( oToolbar );
        this.onItemAdded   = function( sBtnText, oExtraData ){
            if( sBtnText ){
                this.oToolbar.visuallyAddItem( sBtnText, oExtraData );
            }
            this.onResize();
        };
        this.onItemRemoved = function( oBtn ){
            this.oToolbar.visuallyRemoveItem( oBtn );
        }
        this.onItemSelectionRemoved = function( oBtn ){
            this.oToolbar.removeSection(oBtn);
        };
        this.onResize = function( ths, width, height, oldWidth, oldHeight, eOpts ){
            //check to see if it's out of bounds
            if( this.oToolbar.areCrumbsOutofBounds() ){ //nCrumbs are to big
                this.oToolbar.setMode( this.oToolbar.MODES.LEFT_BOOKEND );//We need a bookend
                this.showLeftBookend();
                this.oToolbar.oMode.onResize(); //leftBookendEatCrumb();
            }
        };
    }
    conan.NoBookendMode.prototype = new conan.AMode();

    conan.LeftBookendMode = function( oToolbar ){
        this.setToolbar( oToolbar );

        this.onItemAdded   = function( sBtnText, oExtraData ){
            if( sBtnText ){
                this.oToolbar.visuallyAddItem( sBtnText, oExtraData );
            }
            this.onResize();
        };
        this.onItemRemoved = function( oBtn ){
            var aItms = [];

            this.oToolbar.visuallyRemoveItem( oBtn );

            aItms = this.oToolbar.leftBookendPukeCrumb();
            if( aItms.length <= 0 || this.oToolbar.isLeftBookendStarving() ){
                this.hideLeftBookend();
                this.oToolbar.setMode( this.oToolbar.MODES.NONE );//No need for a bookend
            }
            this.oToolbar.oMode.onResize();//Puking is kind of like adding an item to the list, so we need to check to see if it makes the crumbs to long. It's better to check the length before you puke but since you can't get the width till the item is displayed we have to do it this way. In this case Ext makes us eat our own puke.
        };
        this.onItemSelectionRemoved = function( oBtn ){
            var aBtns = new Array();
            if( oBtn ){
                aBtns = this.oToolbar.removeSection(oBtn);
            }
            
            for( var i=0, l=aBtns.length,itm=null; i<l; i++ ){
                itm = aBtns[i];
                if( itm._type == 'btn' ){
                    //Do all the stuff onItemRemoved does. But send it undefined so there's nothing to remove
                    this.oToolbar.oMode.onItemRemoved();                    
                }
            }
        };
        this.onLeftBookendClick = function( oBtn ){
            var nRunAwayCheck = 0,
                nIveRunAway   = 30,//Make sure we don't get an infinite loop for some reason. Should change this to be a timer not a count
                aItms = null;
            this.oToolbar.setMode( this.oToolbar.MODES.BOTH_BOOKENDS );
            this.showRightBookend();
            aItms = this.oToolbar.leftBookendPukeCrumb();
            while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                this.oToolbar.rightBookendEatCrumb();
                nRunAwayCheck++;
            }
        };
        this.onResize = function( ths, width, height, oldWidth, oldHeight, eOpts ){
            var nRunAwayCheck = 0,
                nIveRunAway   = 30,//Make sure we don't get an infinite loop for some reason. Should change this to be a timer not a count
                aItms         = [true];
            if( this.oToolbar.areCrumbsOutofBounds() ){
                while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                    this.oToolbar.leftBookendEatCrumb();
                    nRunAwayCheck++;
                }
            }else{
                while( !this.oToolbar.areCrumbsOutofBounds() && aItms.length > 0 ){
                    aItms = this.oToolbar.leftBookendPukeCrumb();
                }
                if( this.oToolbar.areCrumbsOutofBounds() ){
                    this.oToolbar.leftBookendEatCrumb();
                }else if( aItms.length <= 0 ){
                    this.hideLeftBookend();
                    this.oToolbar.setMode( this.oToolbar.MODES.NONE );//No need for a bookend
                }
            }
        };
    }
    conan.LeftBookendMode.prototype = new conan.AMode();

    conan.BothBookendMode = function( oToolbar ){
        this.setToolbar( oToolbar );

        this.onLeftBookendClick = function( oBtn ){
            var nRunAwayCheck = 0,
                nIveRunAway   = 30,//Make sure we don't get an infinite loop for some reason. Should change this to be a timer not a count
                aItms = null;

            aItms = this.oToolbar.leftBookendPukeCrumb();
            //Causes and extra click, need to work around that.
            //No more left crumbs/nothing was puked change modes and hide leftbreadcrumb
            if( aItms.length <= 0 || this.oToolbar.isLeftBookendStarving() ){
                this.oToolbar.setMode( this.oToolbar.MODES.RIGHT_BOOKEND );
                this.hideLeftBookend();
            }

            while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                this.oToolbar.rightBookendEatCrumb();
                nRunAwayCheck++;
            }
        };
        this.onRightBookendClick = function( oBtn ){
            var nRunAwayCheck = 0,
                nIveRunAway   = 30,//Make sure we don't get an infinite loop for some reason. Should change this to be a timer not a count
                aItms = null;

            aItms = this.oToolbar.rightBookendPukeCrumb();
            if( aItms.length <= 0 || this.oToolbar.isRightBookendStarving() ){
                this.oToolbar.setMode( this.oToolbar.MODES.LEFT_BOOKEND );
                //remove right bookend and the spacer
                this.hideRightBookend();
            }

            while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                this.oToolbar.leftBookendEatCrumb();
                nRunAwayCheck++;
            }
        };
        //If the user tries to add an item while in this mode, all crumbs shift left then the item is added
        this.onItemAdded   = function( sBtnText, oExtraData ){
            if( sBtnText ){
                //Right bookend is very sick, it's going to puke all it's contents
                while( !this.oToolbar.isRightBookendStarving() ){
                    this.onRightBookendClick();
                }
                //Should be in left mode now
                this.oToolbar.oMode.onItemAdded( sBtnText, oExtraData );
            }
        };
        this.onItemRemoved = function( itm ){
            this.oToolbar.visuallyRemoveItem( itm );
            this.onRightBookendClick();
        };
        this.onItemSelectionRemoved = function( oBtn ){
            var aBtns = new Array();
            if( oBtn ){
                aBtns = this.oToolbar.removeSection(oBtn);
            }
            
            for( var i=0, l=aBtns.length,itm=null; i<l; i++ ){
                itm = aBtns[i];
                if( itm._type == 'btn' ){
                    //Do all the stuff onItemRemoved does. But send it undefined so there's nothing to remove
                    //There will be no right bookend or right items, so it will switch to left mode and call left modes onItemRemoved()
                    this.oToolbar.oMode.onItemRemoved();                    
                }
            }
        };
        this.onResize = function( ths, width, height, oldWidth, oldHeight, eOpts ){
            var dif = this.oToolbar.getCrumbsLengthDifference(),
                count = 0,
                bRightStarving = false,
                bLeftStarving  = false;
            //Did things get bigger?
            if( dif > 0 ){//toolbar is bigger than the bread crumbs
                while( (dif = this.oToolbar.getCrumbsLengthDifference()) > 0 &&
                       (!this.oToolbar.isLeftBookendStarving() || 
                       !this.oToolbar.isRightBookendStarving() )
                ){
                    if( count++ % 2 )//alternate puking to try and keep a balance
                        this.oToolbar.leftBookendPukeCrumb();
                    else
                        this.oToolbar.rightBookendPukeCrumb();
                }
                bLeftStarving  = this.oToolbar.isLeftBookendStarving(); 
                bRightStarving = this.oToolbar.isRightBookendStarving();
                //Set the mode
                if( bLeftStarving && bRightStarving ){
                    this.hideRightBookend();
                    this.hideLeftBookend();
                    this.oToolbar.setMode( this.oToolbar.MODES.NONE );//No need for a bookend
                }else if( bLeftStarving ){
                    this.hideLeftBookend();
                    this.oToolbar.setMode( this.oToolbar.MODES.RIGHT_BOOKEND);
                }else if( bRightStarving ){
                    this.hideRightBookend();
                    this.oToolbar.setMode( this.oToolbar.MODES.LEFT_BOOKEND);
                }else{
                    //mode does not change
                }

                if( dif < 0 ){//check to see if loop ended bc of distance. if it did the dif will be positive meaning we went to far
                    if(--count % 2){//remove the one we just added
                        this.oToolbar.leftBookendEatCrumb();
                    }else{
                        this.oToolbar.rightBookendEatCrumb();
                    }
                }
            }else if( dif < 0 ){//Page shrunk, toolbar is smaller than the breadcrumbs
                while( dif = this.oToolbar.getCrumbsLengthDifference() < 0 ){
                    if( count++ % 2 )//alternate eating to try and keep a balance
                        this.oToolbar.leftBookendEatCrumb();
                    else
                        this.oToolbar.rightBookendEatCrumb();
                }
            }
        };
    }
    conan.BothBookendMode.prototype = new conan.AMode();

    conan.RightBookendMode = function( oToolbar ){
        this.setToolbar( oToolbar );

        this.onRightBookendClick = function( oBtn ){
            var nRunAwayCheck = 0,
                nIveRunAway   = 30,//Make sure we don't get an infinite loop for some reason. Should change this to be a timer not a count
                aItms = null;

            aItms = this.oToolbar.rightBookendPukeCrumb();
            if( this.oToolbar.areCrumbsOutofBounds() ){
                this.showLeftBookend();
                while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                    this.oToolbar.leftBookendEatCrumb();
                    nRunAwayCheck++;
                }
                this.oToolbar.setMode( this.oToolbar.MODES.BOTH_BOOKENDS );
            }
        };
        //If the user tries to add an item while in this mode, all crumbs shift left then the item is added
        this.onItemAdded   = function( sBtnText, oExtraData ){
            if( sBtnText ){
                var aItms    = this.oToolbar.rightBookendPukeCrumb(),
                    nStart   = 0,
                    nElapsed = 0,
                    nMaxT    = 5000,
                    nRunAwayCheck = 0,
                    nIveRunAway   = 30;//Make sure we don't get an infinite loop for some reason. Should change this to be a timer not a count

                //Right bookend is very sick, it's going to puke all it's contents
                while( aItms.length >= 0 ){
                    aItms = this.oToolbar.rightBookendPukeCrumb();
                    while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                        this.oToolbar.leftBookendEatCrumb();
                        nRunAwayCheck++;
                    }
                    nRunAwayCheck = 0;
                }
                nRunAwayCheck = 0;
                this.oToolbar.visuallyAddItem( sBtnText, oExtraData );
                while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                    this.oToolbar.leftBookendEatCrumb();
                    nRunAwayCheck++;
                }
                this.oToolbar.setMode( this.oToolbar.MODES.LEFT_BOOKEND );
            }
        };
        this.onItemRemoved = function( itm ){
            this.oToolbar.visuallyRemoveItem( itm );
            this.onRightBookendClick();
        };
        this.onItemSelectionRemoved = function( oBtn ){
            var aBtns = new Array();
            if( oBtn ){
                aBtns = this.oToolbar.removeSection(oBtn);
            }
            this.oToolbar.setMode( this.oToolbar.MODES.NO_BOOKENDS );
        };
        this.onResize = function( ths, width, height, oldWidth, oldHeight, eOpts ){
            var nRunAwayCheck = 0,
                nIveRunAway   = 30,//Make sure we don't get an infinite loop for some reason. Should change this to be a timer not a count
                aItms         = [true];
            if( this.oToolbar.areCrumbsOutofBounds() ){
                while( this.oToolbar.areCrumbsOutofBounds() && nRunAwayCheck <= nIveRunAway ){
                    this.oToolbar.rightBookendEatCrumb();
                    nRunAwayCheck++;
                }
            }else{
                while( !this.oToolbar.areCrumbsOutofBounds() && aItms.length > 0 ){
                    aItms = this.oToolbar.rightBookendPukeCrumb();
                }
                if( this.oToolbar.areCrumbsOutofBounds() ){
                    this.oToolbar.rightBookendEatCrumb();
                }else if( aItms.length <= 0 ){
                    this.hideRightBookend();
                    this.oToolbar.setMode( this.oToolbar.MODES.NONE );//No need for a bookend
                }
            }
        };
    }
    conan.RightBookendMode.prototype = new conan.AMode();
})(conan);
