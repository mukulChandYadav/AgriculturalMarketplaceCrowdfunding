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



//import { todoMachine } from './todoMachine';

// export const SCMachines = Machine({
//     // ...
//     id: 'SupplychainFSMController ',
//     initial: 'acceptSCAddRequest',
//     context: {
//         fsmList: [],

//     },
//     states: {
//         acceptSCAddRequest: {

//             on: {
//                 'NEW_SC_FSM.ADD': {
//                     actions: assign({
//                         fsmList: (context, event) => [
//                             ...context.fsmList,
//                             {
//                                 scfsm: event.upc,
//                                 // add a new scmachine actor with a unique name
//                                 ref: spawn(SCFSM, `scfsm-${event.upc}`,{sync:true})
//                             }
//                         ]
//                     })
//                 },
//                 'SET_CONTEXT':{
//                     actions: send()
//                 }
//                 // ...
//             }
//         }
//     }
// });



