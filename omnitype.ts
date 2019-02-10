var today = new Date();
var order;

namespace Omni {
	export class Order {
		state:   Array<string> = [];
		num:     Array<Omni.Interval> = [];
		created: Array<Omni.DateInterval> = [];
		stocked: Array<Omni.DateInterval> = [];
		team?:   string;
		created_by?: string;

		explain() {
			var html = "<ul>";
			if (this.state.length > 0) {
				html += "<li>Stav<ul>";
				for (let state of this.state) {
					html += "<li>" + state + "</li>";
				}
				html += "</ul></li>";
			}
			if (this.num.length > 0) {
				html += "<li>Číslo<ul>";
				for (let num of this.num) {
					html += "<li>" + num.print() + "</li>";
				}
				html += "</ul></li>";
			}
			if (this.team) {
				html += "<li>Pro tým '" + this.team + "'</li>";
			}
			if (this.created.length > 0) {
				html += "<li>Vytvořená<ul>";
				for (let date of this.created) {
					html += "<li>" + date.print() + "</li>";
				}
				html += "</ul></li>";
			}
			if (this.stocked.length > 0) {
				html += "<li>Doručená<ul>";
				for (let date of this.stocked) {
					html += "<li>" + date.print() + "</li>";
				}
				html += "</ul></li>";
			}
			if (this.created_by) {
				html += "<li>Vytvořil '" + this.created_by + "'</li>";
			}
			html += "</ul>";

			return html;
		}
	}

	export class Interval {
		constructor(public val1?: number, public val2?:number) {};

		print(fmt?: string) {
			if (this.val1 && !this.val2) {
				return "větší než " + this.val1;
			} else if (!this.val1 && this.val2) {
				return "menší než " + this.val2;
			} else if (this.val1 && this.val2) {
				if (this.val1 == this.val2) {
					return this.val1 + "";
				} else {
					return "mezi " + this.val1 +
						" a " + this.val2;
				}
			} else {
				return "0";
			}
		}
	}

	export class DateInterval {
		reference = new Omni.Date();
		constructor(public date1?: Omni.Date, public date2?:Omni.Date) {};

		print(fmt?: string) {
			if (this.date1 && !this.date2) {
				return "po " + this.date1.print(fmt);
			} else if (!this.date1 && this.date2) {
				return "před " + this.date2.print(fmt);
			} else if (this.date1 && this.date2) {
				var order = cmpDate(this.date1, this.date2);
				if (order == 0) {
					return this.date1.print(fmt);
				} else {
					return "mezi " + this.date1.print(fmt) +
						" a " + this.date2.print(fmt);
				}
			} else {
				return this.reference.print(fmt);
			}
		}
	}

	export class Date {
		dd: number;
		mm: number;
		yyyy: number;

		constructor(dd?: number, mm?: number, yyyy?: number) {
			if (!dd || !mm) {
				// Nezadán den nebo měsíc, vytvoříme dnešné datum
				dd = today.getDate();
				mm = today.getMonth()+1;
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

		print(fmt?: string) {
			var dd = this.dd + "";
			if (this.dd < 10) {
				dd = "0" + dd;
			}

			var mm = this.mm + "";
			if (this.mm < 10) {
				mm = "0" + mm;
			}

			if (fmt && fmt.toLowerCase() == "iso") {
				return this.yyyy + "-" + mm + "-" + dd
			} else {
				return dd + "." + mm + "." + this.yyyy
			}
		}
	}

	function cmp(lval: number, rval: number): number {
		if (lval < rval) {
			return -1;
		} else if (lval > rval) {
			return 1;
		} else {
			return 0;
		}
	}

	export function cmpDate(lval: Omni.Date, rval: Omni.Date): number {
		if (lval.yyyy != rval.yyyy) {
			return cmp(lval.yyyy, rval.yyyy);
		} else if (lval.mm != rval.mm) {
			return cmp(lval.mm, rval.mm);
		} else {
			return cmp(lval.dd, rval.dd);
		}
	}
}

