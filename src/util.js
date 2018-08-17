// Bind an object/factory of actions to the store and wrap them.
export function mapActions(actions, store) {
	if (typeof actions==='function') actions = actions(store);
	let mapped = {};
	for (let i in actions) {
		mapped[i] = store.action(actions[i]);
	}
	return mapped;
}


// select('foo,bar') creates a function of the form: ({ foo, bar }) => ({ foo, bar })
export function select(properties) {
	if (typeof properties==='string') properties = properties.split(/\s*,\s*/);
	return state => {
		let selected = {};
		for (let i=0; i<properties.length; i++) {
			selected[properties[i]] = state[properties[i]];
		}
		return selected;
	};
}


// Lighter Object.assign stand-in
export function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
	return obj;
}

// Borrowed from https://github.com/reduxjs/redux/blob/master/src/compose.js
export function compose(...funcs) {
	if (funcs.length === 0) return arg => arg;
	if (funcs.length === 1) return funcs[0];

	return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

/* Borrowed from https://github.com/reduxjs/redux/blob/master/src/applyMiddleware.js
   Allows for composable middlewares.
*/
export function applyMiddleware(...middlewares) {
	return createStore => (...args) => {
		const store = createStore(...args);
		let action = () => {
			throw new Error(
				`Actions while constructing your middleware are not allowed. ` +
				`Other middleware would not be applied to this action.`
			);
		};

		const middlewareAPI = {
			getState: store.getState,
			action: (...args) => action(...args)
		};
		const chain = middlewares.map(middleware => middleware(middlewareAPI));
		action = compose(...chain)(store.action);

		return {
			...store,
			action
		};
	};
}
