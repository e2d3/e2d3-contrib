define(function() {
    function jThirdPost() {
    }
    jThirdPost.prototype.jThird = function() {
        var jThird = {
            postMessage: function(value, mode) {
                if (mode === "parent") {
                    value = JSON.stringify(value) + ",jThird=child";
                    parent.parent.postMessage(value, "*");
                } else {
                    value = JSON.stringify(value) + ",jThird=parent";
                    for (var i = 0; i < window.frames.length; i++) {
                        window.frames[i].postMessage(value, "*");
                    }
                }
            },
            _handlers: {},
            addHandler: function(type, fn) {
                var arr = jThird._handlers[type] = jThird._handlers[type] || [];
                arr.indexOf(fn) === -1 && arr.push(fn);
            },
            removeHandler: function(type, fn) {
                var arr = jThird._handlers[type] = jThird._handlers[type] || [];
                var idx = arr.indexOf(fn);
                idx !== -1 && arr.splice(idx, 1);
            }
        };
        window.parent && parent.addEventListener("message", function(e) {
            if (/,jThird=parent$/.test(e.data)) {
                var data = JSON.parse(e.data.replace(/,jThird=parent$/, ""));
                jThird._handlers["message"] && jThird._handlers["message"].forEach(function(fn) {
                    fn(data);
                });
            }
        });
        window.addEventListener("message", function(e) {
            if (/,jThird=child$/.test(e.data)) {
                var data = JSON.parse(e.data.replace(/,jThird=child$/, ""));
                jThird._handlers["message"] && jThird._handlers["message"].forEach(function(fn) {
                    fn(data);
                });
            }
        });
        return jThird;
    }

    return jThirdPost;
});
