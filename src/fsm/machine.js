import { Machine, /*spawn, assign*/ } from 'xstate';
import * as actions from './actions';
import * as services from './services';
import * as guards from './guards';
import { fsm } from './fsm';
//import { send } from 'xstate/lib/actionTypes';


export const SCFSM = Machine(
    fsm,
    {
        actions,
        services,
        guards,
    },
);
