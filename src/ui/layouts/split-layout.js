// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 *
 * @module M.SwitchLayout
 * @type {*}
 * @extends M.Layout
 */
M.SplitLayout = M.SwitchLayout.extend({

    /**
     * The type of the Layout
     */
    _type: 'M.SplitLayout',

    /**
     * Bootstrap grid class for the left container
     * @type {String}
     */
    gridLeft: 'col-xs-4',

    /**
     * Bootstrap grid class for the right container
     * @type {String}
     */
    gridRight: 'col-xs-8',

    /**
     * The template of the Layout
     */
    template: '<div id="m-main" class="m-perspective"><div id="leftContainer"><div class="m-page m-page-1"><div data-childviews="left_page1"></div></div><div class="m-page m-page-2"><div data-childviews="left_page2"></div></div></div><div id="rightContainer"><div class="m-page m-page-1"><div data-childviews="content_page1" class="content-wrapper"></div></div><div class="m-page m-page-2"><div data-childviews="content_page2" class="content-wrapper"></div></div></div></div>',

    /**
     * The SwitchLayout has two container to display the content. This attribute determines which of those 2 is active at the moment
     */
    _currentPage: null,

    initialize: function() {
        M.View.prototype.initialize.apply(this, arguments);
    },

    enquireMatch: function() {
        this.$el.addClass('single').removeClass('full');
        this._getLeftContainer().attr('class', '');

        this.closeLeftContainer();
        this._getRightContainer().addClass(this.gridRight).addClass('col-xs-12');
    },

    enquireUnmatch: function() {
        this.$el.addClass('full').removeClass('single');
        this._getLeftContainer().attr('class', '');

        this._getLeftContainer().addClass(this.gridLeft);
        this._getRightContainer().addClass(this.gridRight);
    },


    /**
     * Map views to dom
     * @param settings
     * @returns {M.SplitLayout}
     */
    applyViews: function( settings, firstInit ) {

        var newContent = this._mapViews(this._currentContent, 'content', settings.content);
        var newLeft = this._mapViews(this._currentLeft, 'left', settings.left);

        this._startTransition(settings.left, settings.content);

        this._currentContent = newContent;
        this._currentLeft = newLeft;

        return this;
    },

    /**
     * Starts a transition if the given page is currently not visible.
     *
     * @param leftView
     * @param contentView
     * @private
     */
    _startTransition: function( leftView, contentView ) {

        var currentContentView = this.getChildView(this._currentContent);
        var currentLeftView = this.getChildView(this._currentLeft);

        if( currentContentView && currentContentView !== contentView ) {
            this.rightTransition.startTransition();
        }

        if( currentLeftView && currentLeftView !== leftView ) {
            this.leftTransition.startTransition();
        }
    },

    /**
     * This method is responsible to add the view in the layout template.
     *
     * @param current {String}
     * @param dataChildViewName {String}
     * @param view {M.View}
     * @returns {String}
     * @private
     */
    _mapViews: function( current, dataChildViewName, view ) {

        var nameA = dataChildViewName + '_page1';
        var nameB = dataChildViewName + '_page2';

        if( this.getChildView(current) === view || !view ) {
            if( !view ) {
                // The given view is null so clear the dom
                this.$el.find('[data-childviews="' + nameA + '"]').html('');
                this.$el.find('[data-childviews="' + nameB + '"]').html('');
            }
            return current;
        }

        if( current === null || current === undefined || current === nameB ) {
            current = nameA;
        } else if( current === nameA ) {
            current = nameB;
        }

        if( view && !this.childViews[current] ) {
            this.setChildView(current, view);
        } else if( view && this.childViews[current] !== view ) {
            this.setChildView(current, view);
        }

        if( !this._firstRender && view ) {
            //clear the dom before inserting the view
            this.$el.find('[data-childviews="' + current + '"]').html('');
            //insert the view
            this.$el.find('[data-childviews="' + current + '"]').html(view.render().$el);
        }

        M.Layout.prototype.applyViews.apply(this, arguments);

        return current;
    },

    /**
     * Initialize the Transitions on first render then call the prototype
     * @private
     */
    _postRender: function() {

        // Add grid classes
        this._getLeftContainer().addClass(this.gridLeft);
        this._getRightContainer().addClass(this.gridRight);

        if( this._firstRender ) {
            // Init transitions
            this.rightTransition = M.PageTransitions.design().init(this._getRightContainer());
            this.leftTransition = M.PageTransitions.design().init(this._getLeftContainer());
            enquire.register('(max-width: 767px)', {
                match: _.bind(this.enquireMatch, this),
                unmatch: _.bind(this.enquireUnmatch, this),
            });
        }

        // Call super
        M.Layout.prototype._postRender.apply(this, arguments);

        return this;
    },

    /**
     * Returns an jQuery element which represents the left container
     *
     * @returns {*|Mixed}
     * @private
     */
    _getLeftContainer: function() {
        return this.$el.find('#leftContainer');
    },

    /**
     * Returns an jQuery element which represents the right container
     *
     * @returns {*|Mixed}
     * @private
     */
    _getRightContainer: function() {
        return this.$el.find('#rightContainer');
    },

    isAnimating: function() {
        return this.rightTransition.isAnimating() || this.leftTransition.isAnimating();
    },

    toggleLeftContainer: function() {
        this._getLeftContainer().toggleClass('close');
    },

    openLeftContainer: function() {
        this._getLeftContainer().removeClass('close');
    },

    closeLeftContainer: function() {

        if( this.$el.hasClass('single') ) {
            this._getLeftContainer().addClass('close');

        }
    }
});