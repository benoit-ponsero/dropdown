!function ($) {

    "use strict";

    var DropDown = function (element, options) {
        this.options = options
        this.$element = $(element)
    }

    DropDown.prototype = {
        constructor: DropDown
        , init : function (){

            var tag = (this.options.tag == 'dd' || this.options.type == 'dropdown-tree')
                        ? 'dd' : 'ul';

            var tpl = '<div class="btn-group">';
            if (this.options.split){
                tpl += '<button class="btn">Action</button><button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
            } else {
                tpl += '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#"></a>'
            }
            tpl += '<'+tag+' class="dropdown-menu"></'+tag+'></div>'
            
            this.$btn = $(tpl);
            this.$btn.insertAfter(this.$element)

            this.$label = this.$btn.find(".btn:first");
            this.$root  = this.$btn.find(tag);

            if (this.options.position =='right'){
                this.$root.addClass("pull-right")
            }
            if (this.options.type == 'dropdown-tree'){
                
                var o = this.$element.find("option:not([data-parent])");
                this.fillDropdownTree(this.$element, o, this.$root);

            } else {
                this.fillDropdown();
            }

            if(this.options.split && typeof this.options.btnClick == 'function'){
                var self = this;
                this.$label.on('click', function (){
                    self.options.btnClick($(this).data('option'))
                })
            }

            this.$element
                .on('change', this, this.change)
                .trigger('change')
                .hide();
        }
        , fillDropdown : function (){
            var self = this;
            this.$element.find("option").each(function (){
                var $li = $("<li><a href=\"#\">"+$(this).text()+"</a></li>");
                $li.on('click', self, self.click)
                $li.data('option', $(this));
                self.$root.append($li);
            })
        }
        , fillDropdownTree : function (select, nodes, target){
            var self = this;

            nodes.each(function (){
                var o  = $(this)
                var val = o.val(), text = o.text();

                var dl = $('<dl><a href="#">'+text+'</a></dl>');
                target.append(dl);

                dl.find("a")
                    .data('option', o)
                    .on('click', self, self.click)

                var childs = select.find("[data-parent=" + o.val()+"]");
                if (childs.length > 0){
                    var dd = $("<dd/>");
                    dl.append(dd);
                    self.fillDropdownTree(select, childs, dd)
                }
            })
        }
        , click : function (e){
            var self = e.data;
            var option = $(this).data('option');

            option.parent().val(option.val());
            self.$element.trigger('change');
        }
        , change : function (e){
            var self = e.data;
            
            var selected = self.$element.find("option:selected");
            if (selected.length == 0){
                 selected = self.$element.find("option:first")
            }
            var label = selected.text()
            if (!self.options.split){
                label += ' <span class="caret"></span>'
            }
            self.$label
                .html(label)
                .data('option', selected)
        }
    }

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('dropdown')
                , options = $.extend({}, $.fn.dropdown.defaults, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('dropdown', (data = new DropDown(this, options)))
            if (typeof option == 'string') data[option]()
            else {data.init()}
        })
    }

    $.fn.dropdown.defaults = {
        type: 'dropdown' // dropdown | dropdown-tree
        , position: 'left' // left | right
        , split: false
        , btnClick: null
    }

    $.fn.dropdown.Constructor = DropDown

    /* DROPDOWN DATA-API
     * ============== */

    $(function () {

        $('select[data-toggle="dropdown"]').each(function(){
            var $this = $(this)
            var _opts = {}
            if ($this.data('opts')!=null){
                try {
                    eval('_opts='+$this.data('opts'))
                } catch(e){
                    if (window.console && window.console.log){
                        window.console.log(e.message)
                    }
                }
            }
            $this.dropdown(_opts);
        })
    })
}(jQuery);