(function($) {
    let $els = [];
    let arkCount = 0;

    class Data {
        constructor(ark, data) {
            let keys = Object.keys(data);
            this.data = data;
            this.ark = ark;
            this.accessor = this.accessor.bind(this);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                Object.defineProperty(this, key, {
                    get() {return data[key]},
                    set(value) {
                        let _data = ark.data;
                        _data[key] = value;
                        ark.data = _data;
                    }
                });
                // this[key] = this.accessor(key);
            }
            console.log(this);
        }
        accessor(key) {
            console.log(key);
            return (value) => {
                console.log('accessor called');
                if (value) {
                    console.log('value: ' + value);
                    this.data[key] = value;
                    let _data = ark.data;
                    _data[key] = value;
                    ark.data = _data;
                    // ark.data[key] = value;
                } else {
                    console.log('else' + value);
                    return this.data[key];
                }
            }
        }
    }
    class Ark {
        constructor($el, props, first){
            this.props = props;
            this.html = props.html;

            this._data = props.data;
            this.render = this.render.bind(this);
            this.processHTML = this.processHTML.bind(this);
            this.writeHTML = this.writeHTML.bind(this);
            this.processProps = this.processProps.bind(this);
            this.processArks = this.processArks.bind(this);
            this.dataReadOnly = this.dataReadOnly.bind(this);
            this.findFirstArk = this.findFirstArk.bind(this);

            this.$el = $el;
            this.arks = this.processArks(this._data);
            this.writeHTML(this.processHTML(this._data));
            if (first) {
                this.processProps(props);
            }
        }
        processProps(data) {
            let process = (ark) => {
                let data = ark.props;
                if (data.onClick) {
                    let handler = (event, action) => {
                        let _ark = this.findFirstArk(event.target);
                        console.log(event.target);
                        if (_ark.dataReadOnly().length) {
                            $(this.$el).children().each((i, child)=>{
                                
                                if (event.target.isSameNode(child)) {
                                    action(event, this.dataReadOnly()[i]);
                                } 

                            });
                        } else {
                            action(event, this.dataReadOnly());
                        }

                    }
                
                    let keys = Object.keys(data.onClick);
                    for (let i = 0; i < keys.length; i++) {
                        let selector = keys[i];
                        $(this.$el).on(`click`, selector, () => handler(event, data.onClick[selector]));
                    }
                }
            }
            if (this.arks.length) {
                for (let i = 0; i < this.arks.length; i++) {
                    let ark = this.arks[i];
                    process(ark);
                }
            } else {
                process(this);
            }
        }
        findFirstArk(element){
            let ark = null;
            if ($.data(element, "ark")) {
                ark = $.data(element, "ark");
            } else {
                if (element.parentNode) {
                    ark = this.findFirstArk(element.parentNode);
                }
            }
            return ark;
        }
        ark(props){
            // console.log('props: ' + props);
        }
        mod(data) {
            // console.log('data: ' + data);
        }
        dataReadOnly(){
            return this._data;
        }
        set data(_data){
            this._data = _data;
            console.log(_data.name);
            console.log('changed');
            this.writeHTML(this.processHTML(this._data));
        }
        get data(){
            console.log('accessing data');
            return this._data;
        }
        processArks(data) {
            // return [];
            let arks = [];
            if (this._data && this._data.length) {
                for (let i = 0; i < this._data.length; i++) {
                    // let props = Object.assign({}, this.props);
                    // props.data = this._data[i];
                    // let ark = new Ark(this.$el, props, false);
                    // arks.push(ark);
                }
            }
            return arks;
        }
        /* This will be refactored to return an Ark object */
        processHTML(data) {
            let html = '';
            let els = [];
            if (data && data.length) {
                for (let i = 0; i < data.length; i++) {
                    html += this.render(this.html, data[i]);
                }
            } else {
                html += this.render(this.html, data);
            }
            return html;
        }
        writeHTML(html){
            $(this.$el).html(html);
            // $(this.$el).html('').append(html);
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
            return html;
        }
    }
    
    $.fn.ark = function(props) {
        if (this.length) {
            for (let i = 0; i < this.length; i++) {
                initArk(this.get(i), i);
            }
            // this.each(($el) => initArk( $($el) )); 
        } else {
            // nothing selected
            console.log('nothing selected');
        }

        function initArk($el, index) {
            let exists = false;
            $els.forEach((el) =>{
                if ($el.isSameNode(el)) {
                    $el = el;
                    exists = true;
                }
                // if ($el.is(el)) {
                //     $el = el;
                //     exists = true;
                // }
            });
            if (!exists){
                $els.push($el);
            }
            if ($.data($el, "ark")) {
                console.log('ark is already set. we need to modify it');
            } else {
                ark = new Ark($el, props, true);
                $els[`ark${arkCount}`] = ark;
                arkCount++;
                $.data($el, "ark", ark);
            }
            if (props.html) {
    
            }
            if (props.data) {
    
            }
        }
    }

    $.arks = {};
    $.fn.mod = function(data) {

        if (this.length) {
            for (let i = 0; i < this.length; i++) {
                return modArk(this.get(i));
            }
        } else {
            return modArk(this);
        }

        function modArk($el) {

            let exists = false;
            $els.forEach((el) =>{
                if ($el.isSameNode(el)) {
                    $el = el;
                    exists = true;
                }
            });
            if (exists){
                let ark = $.data($el, "ark");
                let arkData = ark.data;
                if (data) {} else {
                    data = {};
                }
                let keys = Object.keys(data);
                keys.forEach((key)=>{
                    arkData[key] = data[key];
                });
                ark.data = arkData;
                let dataObj = new Data(ark, ark.data);
                return dataObj;
            } else {
                console.error("There is no ark for that element");
            }
        }
    }
}(jQuery));

