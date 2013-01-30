ExtjsBreadCrumbs
================
Author: Steve Cirelli

My quick and dirty attempt to make an Extjs bread crumb extension. 

Tested with Extjs 4.1.0

Here it is running on jsfiddle.net
   http://jsfiddle.net/scirelli/V9sMs/7/embedded/result/

Note: This is tailored to have functinoality that I wanted on a project I'm working on. So I don't think it functions like breadcrumbs on Amazon, for example. 
      Clicking on a crumb removes that crumb from the list. Clicking on a > removed everything above that > including the >.
      If you wanted to make it so that clicking a crumb remvoves the crumb and everything above it then replace the event handler for a crumb with that of the >

File explanation:

    /index.html is a quick example of how to use breadcrumbs.
    /js/app.js  is a quick example of how to use breadcrumbs. 

    /js/ux/breadCrumbs.js main code

    /css/breadcrumbs.css default css

    /img/*.*  default icons

How to use the example:
    Click 'Add a crumb'
    You get a popup, enter some text or a comma seperated list
    Press Enter
    See crumbs
