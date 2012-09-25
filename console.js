/**
 * a simple console for ie
 *
 * just has `console.log(arg1, arg2, ...)`
 *
 * use the console.css in css folder to default display
 *
 * @author dengjij@gmail.com
 */

(function(window) {
    // comment following one line to enable it in chrome
    // and other browsers which has build-in console
    // if doing this, try to modify the global variable's name in the last
//    if (typeof window.console !== 'undefined') return;

    var _toStr = Object.prototype.toString;

    function isSpecial(o) {
        var undef;
        return o === undef || o === null;
    }

    function isBool(o) {
        return o === true || o === false;
    }

    function isString(o) {
        return _toStr.call(o) == '[object String]';
    }

    function isArray(o) {
        return _toStr.call(o) == '[object Array]';
    }

    function isObject(o) {
        return _toStr.call(o) == '[object Object]';
    }

    function isElement(o) {
        return o.nodeType && (o.nodeType == 1 || o.nodeType == 9);
    }

    function isFunction(o) {
        return _toStr.call(o) == '[object Function]';
    }

    function trim(str) {
        if (typeof String.prototype.trim === 'function') return str.trim();
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function addClass(ele, cls) {
        ele.className = trim(ele.className + ' ' + cls);
    }

    function removeClass(ele, cls) {
        var c = ' ' + ele.className + ' ';
        ele.className = trim(c.replace(' ' + cls + ' ' , ''));
    }

    // 说明：获取页面上选中的文字
    // 整理：http://www.CodeBit.cn
    function getSelectedText() {
        if (window.getSelection) {
            // This technique is the most likely to be standardized.
            // getSelection() returns a Selection object, which we do not document.
            return window.getSelection().toString();
        }
        else if (document.getSelection) {
            // This is an older, simpler technique that returns a string
            return document.getSelection();
        }
        else if (document.selection) {
            // This is the IE-specific technique.
            // We do not document the IE selection property or TextRange objects.
            return document.selection.createRange().text;
        }
    }

    var Event = {
        on: function(obj, type, fn) {
            var wrapFn = function(e) {
                var e = e || window.event;
                fn.call(obj, e);
            };

            if (obj.addEventListener) {
                obj.addEventListener(type, wrapFn, false);
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + type, wrapFn);
            }
        },
        stopBubble: function(e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                window.event.cancelBubble = true;
            }
        },
        preventDefault: function(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            else {
                window.event.returnValue = false;
            }
        }
    };


    /**
     * get an element's outerHTML
     * from:
     * http://stackoverflow.com/questions/1700870/how-do-i-do-outerhtml-in-firefox
     *
     * @param {Element} node the element to get outerHTML from.
     */
    function outerHTML(node) {
        // if IE, Chrome take the internal method otherwise build one
        return node.outerHTML || (
            function(n) {
                var div = document.createElement('div'), h;
                div.appendChild(n.cloneNode(true));
                h = div.innerHTML;
                div = null;
                return h;
            })(node);
    }

    /**
     * get mouse position relative to the document.
     *
     * x means distance to the left edage,
     * y means distance to the top edage
     */
    function mousePos(event) {
        e = event || window.event;
        doc = document.body || document.documentElement;
        return {
            'x' : e.pageX || e.clientX + doc.scrollLeft,
            'y' : e.pageY || e.clientY + doc.scrollTop
        };
    }

    /**
     * element's position relative to the document
     */
    function pageOffset(ele) {
        var doc = document.body || document.documentElement,
            pos = ele.getBoundingClientRect();

        return {
            x: pos.left + doc.scrollLeft,
            y: pos.top + doc.scrollTop
        };
    }

    /**
     * mouse position relative to the element
     */
    function mouseOffetToEle(ele, e) {
        var pos = mousePos(e);
        var offset = pageOffset(ele);

        return {
            x: pos.x - offset.x,
            y: pos.y - offset.y
        };
    }

    /**
     * create an element with given tagName and attributes and return it
     *
     * Notice: should use 'className' rather than 'class' because of ie limits.
     */
    function createEle(tag, attrs) {
        var ele = document.createElement(tag);
        for (k in attrs) {
            ele[k] = attrs[k];
        }
        return ele;
    }

    /**
     * The Console Class
     */
    var Console = function(cssPath) {
        this.hInnerPadding = 5 * 2;
        this.argSeperator = '    ';
        this.UI = {};
        this._init();
    };

    Console.prototype = {
        _init: function() {
            this._userDefined = true;
            this._initUI();
            this._bind();
        },
        _initUI: function() {
            var panel = createEle('div', {className: 'console-panel'}),
                panelInner = createEle('div', {className: 'console-panel-inner'}),
                panelLog = createEle('div', {className: 'console-log'}),
                panelInput = createEle('div', {
                                className: 'console-input',
                                contentEditable: true
                            }),
                topMove = createEle('div', {className: 'move topMove'}),
                rightMove = createEle('div', {className: 'move rightMove'}),
                bottomMove = createEle('div', {className: 'move bottomMove'}),
                leftMove = createEle('div', {className: 'move leftMove'});

            panelInner.appendChild(panelLog);
            panelInner.appendChild(panelInput);
            panel.appendChild(panelInner);
            panel.appendChild(topMove);
            panel.appendChild(rightMove);
            panel.appendChild(bottomMove);
            panel.appendChild(leftMove);
            document.getElementsByTagName('body')[0].appendChild(panel);

            // store elements in UI object
            this.UI = {
                panel: panel,
                panelInner: panelInner,
                panelLog: panelLog,
                panelInput: panelInput,
                topMove: topMove,
                rightMove: rightMove,
                bottomMove: bottomMove,
                leftMove: leftMove
            };
        },
        _bind: function() {
            var self = this,
                UI = self.UI;

            self.mousePos = {};
            self.mouseOffset = {};
            self.mover = null;

            Event.on(UI.panel, 'click', function(e) {
                if (!getSelectedText()) {
                    UI.panelInput.focus();
                }
            });

            Event.on(UI.panelInput, 'keypress', function(e) {
                var code = e.keyCode;
                if (code == 10 || code == 13) {
                    self._exec((UI.panelInput.textContent || UI.panelInput.innerText));
                    UI.panelInput.innerHTML = '';
                    Event.preventDefault(e);
                    UI.panelInner.scrollTop += 999999;
                    UI.panelInput.focus();
                }
            });

            Event.on(UI.topMove, 'mousedown', function(e) {
                self.mover = this;
                addClass(UI.panel, 'moving');
                self.mouseOffset = mouseOffetToEle(UI.panel, e);
            });

            Event.on(UI.rightMove, 'mousedown', function(e) {
                self.mover = this;
                addClass(UI.panel, 'moving');
                self.mousePos = mousePos(e);
            });

            Event.on(UI.bottomMove, 'mousedown', function(e) {
                self.mover = this;
                addClass(UI.panel, 'moving');
                self.mousePos = mousePos(e);
            });

            Event.on(UI.leftMove, 'mousedown', function(e) {
                self.mover = this;
                addClass(UI.panel, 'moving');
                self.mousePos = mousePos(e);
                self.mouseOffset = mouseOffetToEle(UI.panel, e);
            });

            Event.on(document, 'mouseup', function(e) {
                if (self.mover) {
                    removeClass(UI.panel, 'moving');
                    self.mover = null;
                }
            });

            Event.on(document, 'mousemove', function(e) {
                switch (self.mover) {
                    case UI.topMove:
                        self._move(e);
                        break;
                    case UI.rightMove:
                        self._resizeH(e, 'right');
                        break;
                    case UI.leftMove:
                        self._resizeH(e, 'left');
                        break;
                    case UI.bottomMove:
                        self._resizeV(e);
                        break;
                }
            });
        },
        _move: function(e) {
            var UI = this.UI,
                pos = mousePos(e),
                style = UI.panel.style;

            style.bottom = 'auto';
            style.top = pos.y - this.mouseOffset.y + 'px';
            style.left = pos.x - this.mouseOffset.x + 'px';
        },
        _resizeH: function(e, dir) {
            var UI = this.UI,
                pos = mousePos(e),
                mp = this.mousePos,
                offsetX = dir == 'right' ? pos.x - mp.x : mp.x - pos.x,
                w = UI.panel.offsetWidth;

            mp = this.mousePos = pos;

            if (w <= 100 && offsetX < 0) return;

            var wpx = w + offsetX + 'px';

            UI.panelInner.style.width = UI.panelInner.offsetWidth - this.hInnerPadding + offsetX + 'px';
            UI.panel.style.width = wpx;
            UI.topMove.style.width = wpx;
            UI.bottomMove.style.width = wpx;

            if (dir == 'left') {
                UI.panel.style.left = pos.x - this.mouseOffset.x + 'px';
            }
        },
        _resizeV: function(e) {
            var pos = mousePos(e),
                offsetY = pos.y - this.mousePos.y,
                UI = this.UI,
                h = UI.panel.offsetHeight;

            this.mousePos = pos;

            if (h <= 50 && offsetY < 0) return;

            var hpx = h + offsetY + 'px';

            UI.panelInner.style.height = UI.panelInner.offsetHeight + offsetY + 'px';
            UI.panel.style.height = hpx;
            UI.leftMove.style.height = hpx;
            UI.rightMove.style.height = hpx;
        },
        _exec: function(str) {
            this._logCmd(str, 'cmd');
            try {
                this.log(eval.call(window, str.replace('\n', '')));
            } catch (e) {
                this._logError(e.name + ': ' + e.message);
                window.err = e;
                /*
                if (e.stack) {
                    this._logError(e.stack);
                }*/
            }
        },
        _appendLog: function(msg, type) {
            type = 'console-log-line-' + (type || 'log');
            var perLog = createEle('div', {
                className: 'console-log-line' + ' ' + type,
                innerHTML: msg.replace(/&/gm, '&amp;').replace(/</gm, '&lt')
            });
            this.UI.panelLog.appendChild(perLog);
        },
        _argType: function(arg) {
            return isSpecial(arg) ? 'special' : isBool(arg) ?
                'bool' : isString(arg) ?
                'string' : isArray(arg) ?
                'array' : isElement(arg) ?
                'node' : isObject(arg) ?
                'object' : 'other';
        },
        _render: function(obj) {
            var result = '',
                objType = this._argType(obj);

            switch (objType) {
                case 'special':
                    result += this._renderSpecial(obj);
                    break;
                case 'bool':
                    result += this._renderBoolean(obj);
                    break;
                case 'array':
                    result += this._renderArray(obj);
                    break;
                case 'string':
                    result += this._renderString(obj);
                    break;
                case 'node':
                    result += this._renderNode(obj);
                    break;
                case 'object':
                    result += this._renderObject(obj);
                    break;
                case 'other':
                default:
                    result += this._renderDefault(obj);
                    break;
            }
            return result;
        },
        _renderArray: function(arr) {
            var res = '[',
                l = arr.length,
                l1 = l - 1,
                i = 0,
                aRes = [];

            for (; i < l; i++) {
                aRes.push(this._render(arr[i]));
            }

            res += aRes.join(', ') + ']';
            return res;
        },
        _renderNode: function(node) {
            return outerHTML(node);
        },
        _renderObject: function(obj) {
            var res = '{',
                aRes = [];

            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    aRes.push(i + ': ' + this._render(obj[i]));
                }
            }

            res += aRes.join(', ') + '}';
            return res;
        },
        _renderBoolean: function(bool) {
            return bool ? 'true' : 'false';
        },
        _renderString: function(str) {
            return '"' + str + '"';
        },
        _renderSpecial: function(o) {
            return o === null ? 'null' : 'undefined';
        },
        _renderDefault: function(obj) {
            return obj.toString();
        },
        _logError: function(str) {
            this._appendLog(this._render(str), 'error');
        },
        _logCmd: function(str) {
            this._appendLog(this._render(str), 'cmd');
        },
        log: function() {
            try {
                var renderedArgs = [],
                    i = 0,
                    result = '';
                    il = arguments.length;

                for (; i < il; i += 1) {
                    renderedArgs.push(this._render(arguments[i]));
                }

                result = renderedArgs.join(this.argSeperator);
                this._appendLog(result);
            } catch (e) {
                this._appendLog(e.message, 'error');
            }
            this.UI.panelInner.scrollTop += 9999;
        }
    };

    window.console = new Console();
})(this);
