(function($) {
    let $els = [];
    let arkCount = 0;

    class Ark {
        constructor($el, props){
            console.log(props);
            this.html = props.html;
            this._data = props.data;
            this.render = this.render.bind(this);
            this.$el = $el;
            this.render(this.html, this.data);
        }
        ark(props){
            console.log('props: ' + props);
        }
        mod(data) {
            console.log('data: ' + data);
        }
        set data(_data){
            this._data = _data;
            this.render(this.html, this._data);
        }
        get data(){
            return this._data;
        }
        render(html, data){
            const _regex = /{{[\w\s:\|\.]+}}/g;
            const _bracketsRegex = /({{)|(}})/g;

            var name;
            var matches = html.match(_regex);
            var length = matches.length;
            var i;
            
            let match;

            for (i = 0; i < length; i++) {
                match = matches[i];
                name = match.replace(_bracketsRegex, '');

                if (data[name]) {
                    html = html.replace(match, data[name]);
                } else {
                    html = html.replace(match, '');
                }
            }
            this.$el.html(html);
        }
    }
    
    $.fn.ark = function(props) {
        console.log(this);
        let $el = this;
        let exists = false;
        $els.forEach((el) =>{
            if (this.is(el)) {
                console.log('it is there already');
                $el = el;
                exists = true;
            }
        });
        if (!exists){
            $els.push(this);
        }
        if ($.data($el, "arkObject")) {
            console.log('ark is already set. we need to modify it');
        } else {
            ark = new Ark($el, props);
            $els[`ark${arkCount}`] = ark;
            arkCount++;
            $.data($el, "arkObject", ark);
            // console.log($.data($(this), "arkObject"));
        }
        if (props.html) {

        }
        if (props.data) {

        }
    }

    $.arks = {};
    $.fn.mod = function(data) {
        console.log(this);
        let $el = this;
        let exists = false;
        $els.forEach((el) =>{
            if (this.is(el)) {
                console.log('it is there already');
                $el = el;
                exists = true;
            }
        });
        if (exists){
            let ark = $.data($el, "arkObject");
            let arkData = ark.data;
            let keys = Object.keys(data);
            keys.forEach((key)=>{
                arkData[key] = data[key];
            });
            ark.data = arkData;
            // ark.render(ark.html, arkData);
            console.log(ark);
            console.log(arkData);
        } else {
            console.error("There is no ark for that element");
            // $.data(this, "arkObject", {html: ''});
            console.log($.data(this, "arkObject"));
        }
    }
}(jQuery));

