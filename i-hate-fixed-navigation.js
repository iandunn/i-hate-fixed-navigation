//window.addEventListener( 'load', function() {
// maybe go back to calling init() on window.load instead of executing immediately? but then user sees fixed/static layout and a flash of changes a second later

( function() {
	'use strict';

	const app = window.IHateFixedNavigation = {
		/**
		 * Initialize the core functionality.
		 */
		init: function () {
			app.repositionOriginalElements();
			window.addEventListener( 'load', ( event ) => {
				app.observeDOMChanges( null );
			} );
		},

		/**
		 * Re-position elements that existed when the DOM initially loaded.
		 */
		repositionOriginalElements: function() {
			document.querySelectorAll( 'body *' ).forEach( function ( node ) {
				const position = window.getComputedStyle( node ).getPropertyValue( 'position' );

				if ( ! app.shouldRePosition( position ) ) {
					return;
				}

				app.setStaticPositioning( node );
			} );
		},

		/**
		 * Watch the DOM for changes that may need to be overriden.
		 *
		 * Some sites will add fixed/sticky elements after the DOM has loaded, or will re-position
		 * static/relative/absolute elements to be fixed/static.
		 *
		 * @param {MutationObserver} observer
		 */
		observeDOMChanges: function( observer = null ) {
			if ( ! observer ) {
				observer = new MutationObserver( app.repositionDynamicElements );
			}

			const config = {
				attributes       : true,
				//attributesFilter : [ 'style', 'class' ],
				// todo enabling this makes some of medium.com elements get missed? results inconsitent, might need to restart firefox. would be nice for performance, though?
				childList        : true,
				subtree          : true
			};

			observer.observe( document.body, config );
		},

		/**
		 * Re-position elements that were added or modified after the DOM was initially loaded.
		 *
		 * This is a callback for MutationObserver.
		 *
		 * @param {Array}            mutationsList
		 * @param {MutationObserver} observer
		 */
		repositionDynamicElements: function( mutationsList, observer ) {
			mutationsList.forEach( ( mutation ) => {


				// why medium.com's meter bar still showing up?
				// i think some earlier iteration of the code fixed it. probably some change to this callback, or the initial config
				// maybe the conflict, like it only
				//if ( mutation.target.classList.includes( 'postMeterBar' ) ) {
					console.log( mutation );
				//}

				switch ( mutation.type ) {
					// A new node was added.
					case 'childList':
						mutation.addedNodes.forEach( ( node ) => {
							if ( ! app.shouldRePosition( node.style.position ) ) {
								return;
							}

							app.setStaticPositioning( node )
						} );
						break;
						// todo test doesn't break if addedNodes is empty (because nodes were removed)

					// An existing node was modified.
					case 'attributes':
						//console.log( mutation.target );

						if ( ! app.shouldRePosition( mutation.target.style.position ) ) {
							break;
						}

						// todo if don't disconnect, then have problems w/ some sites. if do disconnect, then have problems w/ others? maybe better to leave it connected and let it handle the extra calls
						//observer.disconnect();
						app.setStaticPositioning( mutation.target );
						//app.observeDOMChanges( observer );
						break;
				}
			} );
		},

		/**
		 * Ignore elements that aren't fixed/static.
		 *
		 * This is very short, but it makes the logic DRY, and makes the calling code shorter and more readable.
		 *
		 * @param {string} position
		 */
		shouldRePosition : function( position ) {
			/*
			 * Search for a substring instead of an equality comparison, because the value might contains flags
			 * like `!important`.
			 */
			return position.includes( 'fixed' ) || position.includes( 'sticky' );
		},

		/**
		 * Force static positioning on the given element.
		 *
		 * The `!important` flag can't be set via `style.position`, it must be done via `style.cssText`. We can't override
		 * `cssText`, though, because it may contain unrelated styles that should be left in tact. We also can't
		 * assume the value exists in`cssText` and only do a replace, since it could have been set via a
		 * stylesheet. Both steps are required.
		 *
		 * @param {HTMLElement} node
		 */
		setStaticPositioning: function( node ) {
			node.style.position = 'static';
			node.style.cssText  = node.style.cssText.replace( 'static;', 'static !important;' );

			// todo maybe 'relative' should be the default, so that left/right/top/bottom still apply?
			// static seems better for the manual test, though. see what happens when test real sites
		}
	};

	app.init();
} )();
