/// <reference path="C:\Users\mzhang\Source\Repos\sammy\sammy\sammy\Scripts/jquery-2.1.4.js" />
/// <reference path="C:\Users\mzhang\Source\Repos\sammy\sammy\sammy\Scripts/sammy-0.7.5.js" />
(function ($) {

    var app = $.sammy('#main', function () {

        this.use('Template');
        this.use('Session');

        this.get('#/', function (context) {
            /*need to clear the content area before loading the partials*/
            context.app.swap('');
            $.ajax({
                url: 'items.json',
                dataType: 'json',
                success: function (items) {
                    $.each(items, function (i, item) {
                        context.log(item.title, '-', item.artist);
                    });
                }
            });

            /*using load function*/
            this.load('items.json')
                .then(function (items) {
                    $.each(items, function (i, item) {
                        context.render('/templates/item.template', {id: i, item: item }).appendTo(context.$element());
                    });
                });
        });

        this.get('#/item/:id', function (context) {
            this.item = this.items[this.params['id']];
            if (!this.item) { return this.notFound(); }
            /*we use partial() which internally calls render and then swaps our the content of the entire app element.*/
            this.partial('/templates/item_detail.template');
        });

        var cart = {};

        this.post('#/cart', function (context) {
            var item_id = this.params['item_id'];
            if (!cart[item_id]) {
                // this item is not yet in our cart
                // initialize its quantity with 0
                cart[item_id] = 0;
            }
            cart[item_id] += parseInt(this.params['quantity'], 10);
            this.log("The current cart: ", cart);
        });

        this.around(function (callback) {
            /*EventContext which is a shared context between the filters and the route*/
            var context = this;
            this.load('items.json')
                .then(function (items) {
                    context.items = items;
                })
                .then(callback);
        });
    });

    $(function () {
        app.run('#/');
    });


})(jQuery);

