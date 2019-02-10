{
  order = new Omni.Order();
}

query
  = val:team (wspace query)* { order.team = val; }
  / naskladneno_lit wspace naskladneno_seznam
  / (vytvoreno_lit wspace)? vytvoreno_seznam
  / (cislo_lit wspace)? val:interval (wspace query)* { order.num.push(val); }
  / vytvoril (wspace query)*
  / ("ve"i? wspace "stav"i "u"? wspace)? val:stav (wspace query)* { order.state.push(val); }
  / val:garbage? (wspace query)* { return undefined; }
  / wspace

stav
  = ("koncept"i "y"i / "nov"i [aáeé]i) { return "koncept"; }
  / ("odesila"i / "odesílá"i) (wspace "se"i)? { return "odesílá se"; }
  / ("odeslan" [aáeé]i / "v heliosu"i) { return "odeslaná"; }
  / ("castecne naskladnen"i / "částečně naskladněn"i / "castecn"i / "částečn"i) [aáeé]i {
      return "částečně naskladněná";
    }
  / ("naskladnen"i / "naskladněn"i / "uzavren"i / "uzavřen"i / "dorucen"i / "doručen"i) [aáeé]i {
      return "uzavřená";
    }

naskladneno_lit
  = ("došl"i / "dosl"i / "dorazil"i / "naskladnen"i / "naskladněn"i / "dorucen"i / "doručen"i) [oaáeé]i

naskladneno_seznam
  = val:datum_interval (or_wspace naskladneno_seznam)* { order.stocked.push(val); }

vytvoreno_lit
  = ("vytvoren"i / "vytvořen"i / "vlozen"i / "vložen"i / "odeslan"i / "odeslán"i ) [oaáeé]i

vytvoreno_seznam
  = val:datum_interval (or_wspace vytvoreno_seznam)* { order.created.push(val); }

vytvoril
  = "moj"i [ae]i { order.created_by = "me" }
  / vytvorit_lit wspace "j"i? "sem"i (wspace ("ja"i / "já"i))? { order.created_by = "me" }
  / vytvorit_lit wspace jmeno:hodnota_str (wspace/".") prijmeni:hodnota_str {
      order.created_by = jmeno + " " + prijmeni
    }

vytvorit_lit
  = ("vytvoril"i / "vytvořil"i / "vlozil"i / "vložil"i / "zadal"i) "a"i?

team
  = team_lit wspace val:hodnota_str { return val; }
  / "pro"i wspace val:hodnota_str { return val; }

team_lit
  = ("pro"i wspace)? ("team"i / "tým"i / "tym"i) [uůy]i?

interval
  = lval:cislo wspace? ("-" / "az"i / "až"i) wspace? rval:cislo {
      return new Omni.Interval(lval, rval);
    }
  / "od" wspace lval:cislo wspace "do" wspace rval:cislo { return new Omni.Interval(lval, rval); }
  / "mezi" wspace lval:cislo wspace "a" wspace rval:cislo { return new Omni.Interval(lval, rval); }
  / ("od"i wspace / ">" "="? / ("je"i wspace)? (("vetsi"i/"větší"i) wspace) (("nez"i / "než"i) wspace)?) wspace? val:cislo { return new Omni.Interval(val); }
  / ("do" wspace / "<" "="? / (("je"i wspace)? (("mensi"i/"menší"i) wspace) (("nez"i / "než"i) wspace)?)) wspace? val:cislo { return new Omni.Interval(undefined, val); }
  / val:cislo { return new Omni.Interval(val, val); }

cislo
 = (cislo_lit wspace?)? "#"? wspace? val:hodnota { return val }

cislo_lit
 = ("s"i wspace)? ("cislem"i / "číslem"i)
 / ("s"i wspace)? ("cislami"i / "číslami"i)
 / ("cislo"i / "číslo"i)
 / ("c"i / "č"i / "no"i) "."?

hodnota
  = val:([0-9]+) { return parseInt(val.join("")); }

hodnota_str
  = val:([^ .,;@]+) { return val.join(""); }

datum_interval
  = lval:datum wspace "-" wspace rval:datum { return new Omni.DateInterval(lval, rval); }
  / "od"i "e"i? wspace lval:datum wspace "do"i wspace rval:datum {
      return new Omni.DateInterval(lval, rval);
    }
  / "mezi"i wspace lval:datum wspace ("a"i / "-") wspace rval:datum {
      return new Omni.DateInterval(lval, rval);
    }
  / ("pred"i / "před"i / "do"i / "<" "="?) wspace val:datum {
      return new Omni.DateInterval(undefined,val);
    }
  / ("po"i / "od"i / ">" "="?) wspace val:datum {
      return new Omni.DateInterval(val);
    }
  / val:datum {
      return new Omni.DateInterval(val, val);
    }

datum
  = ("dnes"i / "dneska"i / "dneška"i) { return new Omni.Date() }
  / dd:([0-9][0-9]?) "." wspace* mm:([0-9][0-9]?) "." yyyy:[0-9]+ {
      return new Omni.Date(parseInt(dd.join("")), parseInt(mm.join("")), parseInt(yyyy.join("")));
    }
  / dd:([0-9][0-9]?) "." wspace* mm:([0-9][0-9]?) "." {
      return new Omni.Date(parseInt(dd.join("")), parseInt(mm.join("")));
    }

wspace
  = [ \n\t,;]+

or_wspace
  = " "+ "nebo"i " "+ / wspace

garbage
  = val:([^ \n\t,;]+) { return val.join("") }
