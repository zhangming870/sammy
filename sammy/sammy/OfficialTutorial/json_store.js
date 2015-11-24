/// <reference path="C:\Users\mzhang\Source\Repos\sammy\sammy\sammy\Scripts/jquery-2.1.4.js" />
/// <reference path="C:\Users\mzhang\Source\Repos\sammy\sammy\sammy\Scripts/sammy-0.7.5.js" />
(function ($) {

    var notMainApp = $.sammy('#main', function () {
        this.get('#/testnotMain', function (context) {
            var testnotMain = 0;
        });
    });

    

    var app = $.sammy('#main', function () {

        this.use('Template');
        this.use('Session');

        this.get('/testMain', function (context) {
            var testMain = 0;
        });

        this.get('#/testMain', function (context) {
            var testMain = 0;
        });
        
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
        /*custom event*/
        /* this inside of a bind() is also an EventContext*/
        this.bind('update-cart', function () {
            var sum = 0;
            $.each(this.session('cart') || {}, function (id, quantity) {
                sum += quantity;
            });
            $('.cart-info')
                .find('.cart-items').text(sum).end()
                .animate({ paddingTop: '30px' })
                .animate({ paddingTop: '10px' });
        });

        this.post('#/cart', function (context) {
            var item_id = this.params['item_id'];
            // fetch the current cart
            /*either return the current value if set, or if not set, set the value to whatever is returned from the function/callback.*/
            var cart = this.session('cart', function () {
                return {};
            });
            if (!cart[item_id]) {
                // this item is not yet in our cart
                // initialize its quantity with 0
                cart[item_id] = 0;
            }
            cart[item_id] += parseInt(this.params['quantity'], 10);
            // store the cart
            this.session('cart', cart);
            this.log("The current cart: ", cart);
            this.trigger('update-cart');
        });

        this.bind('run', function () {
            // initialize the cart display
            this.trigger('update-cart');
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

        notMainApp.run();
    });


})(jQuery);

