# High

* test on real sites & iterate
	* seems like most sites are broken, menus hideen, etc. also worried about performance. maybe need to consider alternate solutions, like improving Just Read extension
	* disable stylebot rules before testing

* automated test suite w/ lots of examples? maybe not necessary if logic is simple
* readme - explain why, because distracting/annoying. get out of the way so i can focus on content
* rename everything - "no fixed elements" or something descriptive

* make compat w/ chrome
* publish in both directories
* start using, iterate when find bugs


# Medium

* add option to use 'static' vs 'relative' vs 'absolute' on the current site
* document/credit that icon came from https://material.io/tools/icons/?icon=not_interested&style=baseline
* maybe make exception for things like `<a href="#top">top</a>`, also medium.com div.metabar ?

* look into performance
	* maybe faster to change stylesheets instead of individual elements. may help w/ bugs too? would still need to check each element for inline styles though?
		* https://stackoverflow.com/a/566445/450127
	*  need to debounce mutation observer callback
	* how to measure performance in general? does it create a noticable impact on large pages? or pages that change frequently?
	* or other performance issues?

# Low

* Change `matches` in `manifest.json` to only match HTTP and HTTPS pages, not web sockets, etc
* better icon, maybe just showing paragraphs of text, without menus and crap in the way
