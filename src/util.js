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

export function applyMiddleware(middleware) {
	return createStore => (...args) => {
		const store = createStore(...args);
		let action = () => {
			throw new Error(
				`Executing an action while constructing your middleware is not allowed. ` +
				`Other middleware would not be applied to this action.`
			);
		};

		const middlewareAPI = {
			getState: store.getState,
			action: (...args) => action(...args)
		};
		action = middleware(middlewareAPI)(store.action); // use compose on chain

		return {
			...store,
			action
		};
	};
}