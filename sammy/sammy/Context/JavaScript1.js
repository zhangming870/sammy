/// <reference path="C:\Users\mingzhang\Source\Repos\sammy\sammy\sammy\Scripts/sammy-0.7.5.js" />
/// <reference path="C:\Users\mingzhang\Source\Repos\sammy\sammy\sammy\Scripts/jquery-2.1.4.js" />

$(function () {
    // extends the app at '#main' with function.
    // create a new app if first time!
    var app = Sammy('#main', function () {
        this.get('#/', function (context) {
            alert(context.verb);
        });
        this.get('#/products/:id', function (context) {
            alert(context.params.id);
        });
    });
    app.run('#/');
});