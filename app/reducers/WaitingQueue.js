function waitingQueue(state = 0, action) {
	switch(action.type) {
		case 'SET_WAITING_QUEUE':
            return action.payload;
        case 'REMOVE_WAITING_QUEUE':
            return 0;
        case 'TO_DISCOUNT_A_WAITING_QUEUE':
            return state > 0 ? state - 1 : 0
        case 'INCREASE_WAITING_QUEUE':
            return state+1
        default:
        	return state;
	}
}

export default waitingQueue;