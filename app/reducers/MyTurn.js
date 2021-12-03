function reducer(state = 0, action) {
	switch(action.type) {
        case 'SET_MY_TURN':
            return action.payload
        default:
        	return state;
	}
}

export default reducer;