define(function() {
    function Symbols(svg) {
        this.def = svg.append('defs');
    };

    function ika(baseUrl) {
        return {width: 50, height: 50, src: baseUrl + '/ika.png'}
    }
    function awabi(baseUrl) {
        return {width: 50, height: 50, src: baseUrl + '/awabi.png'}
    }
    function sazae(baseUrl) {
        return {width: 50, height: 50, src: baseUrl + '/sazae.png'}
    }

    Symbols.prototype.add = function(a, b) {
            return a + b;
        }
        //デフォルトシンボルの登録
    Symbols.prototype.storeSym = function(name, flow, baseUrl) {
        var sym = {};
        switch (name) {
            case 'ika':
                sym = ika(baseUrl);
                break;
            case 'awabi':
                sym = awabi(baseUrl);
                break;
            case 'sazae':
                sym = sazae(baseUrl);
                break;
        }
        if (flow) {
            this.storeSymbolFlow(sym)
        } else {
            this.storeSymbol(sym)
        }
    };
    //デフォルトシンボルの登録
    Symbols.prototype.storeAllSym = function(flow, baseUrl) {
        var syms = [{
            name: 'ika',
            d: ika(baseUrl)
        }, {
            name: 'awabi',
            d: awabi(baseUrl)
        }, {
            name: 'sazae',
            d: sazae(baseUrl)
        }];
        for (var i = syms.length - 1; i >= 0; i--) {
            syms[i]
            if (flow) {
                this.storeSymbolFlow(syms[i].d, syms[i].name)
            } else {
                this.storeSymbol(syms[i].d, syms[i].name)
            }

        };
    };


    //シンボルの登録
    Symbols.prototype.storeSymbol = function(sym, id) {
        var id = (!id) ? 'symbol' : id;
        return this.def.append('image')
            .attr("id", id)
            .attr('xlink:href', sym.src)
            .attr('width', sym.width)
            .attr('height', sym.height)
            .attr('transform', 'translate(-25,-25)')
            .attr('opacity', "0.7")
    };

    //利用
    Symbols.prototype.appendSymbol = function(sel, id) {
        var id = (!id) ? 'symbol' : id;
        return sel.append('use')
            .attr({
                // 'xmlns:xlink': "http://www.w3.org/1999/xlink",
                'xlink:href': '../../../../../../frame.html#' + id
            });
    };

    return Symbols;
});
