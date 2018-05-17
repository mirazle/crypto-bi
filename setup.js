Function.prototype.getName = () => {
    const stack = new Error().stack;
    const d1 = stack.split('\n')[2].trim();
    const d2 = d1.split(' ');
    const d3 = d2[ 1 ].split('.');
    return d3[ 1 ];
}
