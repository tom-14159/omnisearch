"use strict";
var today = new Date();
var order;
var Omni;
(function (Omni) {
    var Order = /** @class */ (function () {
        function Order() {
            this.state = [];
            this.num = [];
            this.created = [];
            this.stocked = [];
        }
        Order.prototype.explain = function () {
            var html = "<ul>";
            if (this.state.length > 0) {
                html += "<li>Stav<ul>";
                for (var _i = 0, _a = this.state; _i < _a.length; _i++) {
                    var state = _a[_i];
                    html += "<li>" + state + "</li>";
                }
                html += "</ul></li>";
            }
            if (this.num.length > 0) {
                html += "<li>Číslo<ul>";
                for (var _b = 0, _c = this.num; _b < _c.length; _b++) {
                    var num = _c[_b];
                    html += "<li>" + num.print() + "</li>";
                }
                html += "</ul></li>";
            }
            if (this.team) {
                html += "<li>Pro tým '" + this.team + "'</li>";
            }
            if (this.created.length > 0) {
                html += "<li>Vytvořená<ul>";
                for (var _d = 0, _e = this.created; _d < _e.length; _d++) {
                    var date = _e[_d];
                    html += "<li>" + date.print() + "</li>";
                }
                html += "</ul></li>";
            }
            if (this.stocked.length > 0) {
                html += "<li>Doručená<ul>";
                for (var _f = 0, _g = this.stocked; _f < _g.length; _f++) {
                    var date = _g[_f];
                    html += "<li>" + date.print() + "</li>";
                }
                html += "</ul></li>";
            }
            if (this.created_by) {
                html += "<li>Vytvořil '" + this.created_by + "'</li>";
            }
            html += "</ul>";
            return html;
        };
        return Order;
    }());
    Omni.Order = Order;
    var Interval = /** @class */ (function () {
        function Interval(val1, val2) {
            this.val1 = val1;
            this.val2 = val2;
        }
        ;
        Interval.prototype.print = function (fmt) {
            if (this.val1 && !this.val2) {
                return "větší než " + this.val1;
            }
            else if (!this.val1 && this.val2) {
                return "menší než " + this.val2;
            }
            else if (this.val1 && this.val2) {
                if (this.val1 == this.val2) {
                    return this.val1 + "";
                }
                else {
                    return "mezi " + this.val1 +
                        " a " + this.val2;
                }
            }
            else {
                return "0";
            }
        };
        return Interval;
    }());
    Omni.Interval = Interval;
    var DateInterval = /** @class */ (function () {
        function DateInterval(date1, date2) {
            this.date1 = date1;
            this.date2 = date2;
            this.reference = new Omni.Date();
        }
        ;
        DateInterval.prototype.print = function (fmt) {
            if (this.date1 && !this.date2) {
                return "po " + this.date1.print(fmt);
            }
            else if (!this.date1 && this.date2) {
                return "před " + this.date2.print(fmt);
            }
            else if (this.date1 && this.date2) {
                var order = cmpDate(this.date1, this.date2);
                if (order == 0) {
                    return this.date1.print(fmt);
                }
                else {
                    return "mezi " + this.date1.print(fmt) +
                        " a " + this.date2.print(fmt);
                }
            }
            else {
                return this.reference.print(fmt);
            }
        };
        return DateInterval;
    }());
    Omni.DateInterval = DateInterval;
    var Date = /** @class */ (function () {
        function Date(dd, mm, yyyy) {
            if (!dd || !mm) {
                // Nezadán den nebo měsíc, vytvoříme dnešné datum
                dd = today.getDate();
                mm = today.getMonth() + 1;
            }
            if (!yyyy) {
                yyyy = today.getFullYear();
            }
            if (yyyy < 100) {
                yyyy += 2000;
            }
            this.dd = dd;
            this.mm = mm;
            this.yyyy = yyyy;
        }
        Date.prototype.print = function (fmt) {
            var dd = this.dd + "";
            if (this.dd < 10) {
                dd = "0" + dd;
            }
            var mm = this.mm + "";
            if (this.mm < 10) {
                mm = "0" + mm;
            }
            if (fmt && fmt.toLowerCase() == "iso") {
                return this.yyyy + "-" + mm + "-" + dd;
            }
            else {
                return dd + "." + mm + "." + this.yyyy;
            }
        };
        return Date;
    }());
    Omni.Date = Date;
    function cmp(lval, rval) {
        if (lval < rval) {
            return -1;
        }
        else if (lval > rval) {
            return 1;
        }
        else {
            return 0;
        }
    }
    function cmpDate(lval, rval) {
        if (lval.yyyy != rval.yyyy) {
            return cmp(lval.yyyy, rval.yyyy);
        }
        else if (lval.mm != rval.mm) {
            return cmp(lval.mm, rval.mm);
        }
        else {
            return cmp(lval.dd, rval.dd);
        }
    }
    Omni.cmpDate = cmpDate;
})(Omni || (Omni = {}));
