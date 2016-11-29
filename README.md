Wikidata Search Provider Extension for GNOME Shell

With this extension you are able to directly search data items from
[Wikidata] (http://www.wikidata.org).


HOWTO
===
Install
====
* ```git clone https://github.com/tobias47n9e/WikidataSearchProvider ~/.local/share/gnome-shell/extensions/WikidataSearchProvider@tobias47n9e```
* Hit ```<Alt> + F2``` and type ```r``` and hit ```<Enter>``` (or use a shell extension reloader)
* Enable the extension in ```gnome-tweak-tool```

Use
====
* To search for "GNOME" open the overview and type ```wd GNOME```
(You need to prefix all of your search with ```wd```.)
* To search for "kitob" in Uzbek type ```wd-uz kitob```
(```uz``` is the language code for Uzbek. You can use any other code such as
 ```ru```, ```ko```, etc. If you omit the language code, the default language
 of English will be used.)


TODO
===
* Allow editing or adding new items
* To search for the translation of "book" in Uzbek open the overview and
type ```wd-en-uz book``` (NOT IMPLEMENTED YET)
* Language specific keyword. For example, ```вд``` triggers search in Russian.
