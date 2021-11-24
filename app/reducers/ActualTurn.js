function reducer(state = 0, action) {
	switch(action.type) {
		case 'SET_ACTUAL_TURN':
            return action.payload
        case 'REMOVE_ACTUAL_TURN':
            return state > 0 ? state -1 : 0
        case 'REFRESH_TURNS':
            return 0
        default:
        	return state;
	}
}

export default reducer;