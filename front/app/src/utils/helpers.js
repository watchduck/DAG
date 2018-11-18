const strictUriEncode = require('strict-uri-encode');

export const helpers = {
    arraysEqual(a, b) {
        // https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    },
    findArrayInArray(haystack, needle) {
        for (let i in haystack) {
            if (helpers.arraysEqual(haystack[i], needle)) {
                return i
            }
        }
        return -1
    },
    removeArrayFromArray(arr, rem) {
        let i = helpers.findArrayInArray(arr, rem);
        if (i != -1) {
            arr.splice(i, 1)
        }
    },
    range(n) {
        return [...Array(n).keys()]
    },
    edges_arr_to_str(arr_of_pairs) {
        if (!arr_of_pairs) {
            return ''
        }
        let arr_of_strs = [];
        for (let pair of arr_of_pairs) {
            arr_of_strs.push(pair.join('-'));
        }
        return arr_of_strs.join('~')
    },
    edges_str_to_arr(str) {
        if (!str) {
            return []
        }
        let arr_of_pairs = [],
            arr_of_strs = str.split('~');
        for (let pairstr of arr_of_strs) {
            let pair_of_strings = pairstr.split('-');
            let pair = [Number(pair_of_strings[0]), Number(pair_of_strings[1])];
            arr_of_pairs.push(pair);
        }
        return arr_of_pairs
    },
    names_arr_to_str(raw_names) {
        if (!raw_names) {
            return ''
        }
        let encoded_names = [];
        for (let raw_name of raw_names) {
            let encoded_name1 = strictUriEncode(raw_name);
            let encoded_name2 = encoded_name1.split('~').join('%7E');  // encode tildas
            encoded_names.push(encoded_name2);
        }
        return encoded_names.join('~')
    },
    names_str_to_arr(str) {
        if (!str) {
            return ['']
        }
        let encoded_names = str.split('~'),
            decoded_names = [];
        for (let encoded_name of encoded_names) {
            decoded_names.push(decodeURI(encoded_name))
        }
        return decoded_names
    },
    renumber_edges(oldEdges, r) {
        let newEdges = [];
        for (let oldEdge of oldEdges) {
            if (!oldEdge.includes(r)) {
                let newEdge = [];
                for (let i in [0, 1]) {
                    if (oldEdge[i] > r) {
                        newEdge.push(oldEdge[i] - 1)
                    } else {
                        newEdge.push(oldEdge[i])
                    }
                }
                newEdges.push(newEdge)
            }
        }
        return newEdges
    }
};
