function reducer(state = null, action) {
	switch(action.type) {
        case 'SET_CURRENT_DOC_ID':
            return action.payload
        default:
        	return state;
	}
}

export default reducer;