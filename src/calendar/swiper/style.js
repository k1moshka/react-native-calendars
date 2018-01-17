function calc(...styles) {
	const final = [];
	for (const style of styles) {
		if (typeof style === 'object') {
			final.push(style);
		}
		else if (Array.isArray(style)) {
			for (const s of style) {
				if (typeof s === 'object') {
					final.push(s);
				}
			}
		}
	}

	return final;
}

export default {
	container: {
        flex: 1,
        flexDirection: 'row',
	},
	indicatorWrapper: {
		
	},
    block: (translateX = 0, style) => calc({
        height: '100%',
        width: '100%',
        transform: [{ translateX }]
    }, style),
	calc
}
