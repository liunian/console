describe('console', function() {
    describe('console._renderSpecial', function() {
        it('null should be renderd to string "null"', function() {
            expect(console._renderSpecial(null)).to.be('null');
        });
        it('undefined should be renderd to string "undefined"', function() {
            var undef;
            expect(console._renderSpecial(undef)).to.be('undefined');
        });
    });

    describe('console._renderBoolean', function() {
        it('true/false should be "true"/"false"', function() {
            expect(console._renderBoolean(true)).to.be('true');
            expect(console._renderBoolean(false)).to.be('false');
        });
    });

    describe('console._renderArray', function() {
        it('array should be with []', function() {
            var a = [],
                b = [1, 2, 3],
                c = ['a', 1],
                d = new Array();

            expect(console._renderArray(a)).to.be('[]');
            expect(console._renderArray(b)).to.be('[1, 2, 3]');
            expect(console._renderArray(c)).to.be('["a", 1]');
            expect(console._renderArray(d)).to.be('[]');
        });
    });

    describe('console._renderString', function() {
        it('string will be with "', function() {
            expect(console._renderString('')).to.be('""');
            expect(console._renderString('abc')).to.be('"abc"');
        });
    });

    describe('console._renderNode', function() {
        // use outerHTML
    });

    describe('console._renderObject', function() {
        it('obj should has {}', function() {
            var o1 = {},
                o2 = {a: 1},
                o3 = {'b': 1},
                o4 = {a:{}};
            expect(console._renderObject(o1)).to.be('{}');
            expect(console._renderObject(o2)).to.be('{a: 1}');
            expect(console._renderObject(o3)).to.be('{b: 1}');
            expect(console._renderObject(o4)).to.be('{a: {}}');
        });
    });

    describe('console._renderDefault', function() {
    });

    describe('console._render', function() {
        it('a complex struct', function() {
            var o = [1, 'a', {c: 3, d: [1, 2]}, [4, 5, true, false], null];
            var r = '[1, "a", {c: 3, d: [1, 2]}, [4, 5, true, false], null]';
            expect(console._render(o)).to.be(r);
        });
    });
});
