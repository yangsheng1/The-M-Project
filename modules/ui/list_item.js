// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: �2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      03.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('../core/foundation/view.js');

/**
 * @class
 *
 * The root object for ListItemViews.
 *
 */
M.ListItemView = M.View.extend({

    type: 'M.ListItemView',

    render: function() {
        var html = '<li id="' + this.id + '">';
        html += this.renderChildViews();
        html += '</li>';
        return html;
    },

    renderUpdate: function() {
        
    },

    /**
     * Triggers render() on all children and returns their render result.
     */
    renderChildViews: function() {
        var arr = this.childViews[0].split(' ');
        var html = '';
        for(var i in arr) {
            html += this[arr[i]].render();
        }
        return html;
    }

});