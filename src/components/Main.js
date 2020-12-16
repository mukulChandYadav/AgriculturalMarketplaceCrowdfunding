/*jshint esversion: 9 */

import React, { Component } from 'react';
//import { Machine } from "xstate";
//import { useMachine } from "@xstate/react";
import * as supplychainFSM from '../fsm/machine';
import { useState, useRef, useEffect } from 'react';
import {
  interpret,
} from 'xstate';
import toaster from 'toasted-notes';
import App from './App';
import { MainContext } from './MainContext';
import ContractProvider from './utils/ContractProvider';
//export const Main = () => {
class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.dumpState = this.dumpState.bind(this);
    this.useMachineExHelper = this.useMachineExHelper.bind(this);
    this.notify = this.notify.bind(this);
  }

  async componentDidMount() {
    let machine = supplychainFSM.SCMachines;
    let machineRef = useRef(machine.withContext({
      ...machine.context,
      notify, // passing side effect command to fsm
    }));
    let machineState, machineSend;
    [machineState, machineSend] =
      this.useMachineExHelper(machineRef.current, { debug: true, name: 'Parent' });
    
    this.setState({machine, machineState, machineSend});

  }


  notify(msg) {
    toaster.notify(msg, {
      position: 'bottom-right',
    });
  }


  //
  //Configure supplychain state machine
  //const [state, send] = useMachine(supplychainFSM.machine);
  // const active = state.matches("active");
  //console.log(state, send);
  // updateContext(key, value){

  // }

  render() {
    return (
      <div>
        <MainContext.Provider value={{
          'state': this.state
        }}><ContractProvider>
            <App />
          </ContractProvider>
        </MainContext.Provider>
      </div >
    );
  }

  // machine is raw state machine, will run it with the interpreter
  useMachineExHelper(machine, { debug = false, name = '', interpreterOptions = {} }) {
    // eslint-disable-next-line
    const [_, force] = useState(0)
    const machineRef = useRef(null)
    const serviceRef = useRef() // started Interpreter

    if (machineRef.current !== machine) {

      machineRef.current = machine

      serviceRef.current = interpret(machineRef.current, interpreterOptions)
        .onTransition(state => {

          if (state.event.type === 'xstate.init') {
            // debugger	//
            return
          }
          //
          if (state.changed === false && debug === true) {
            console.error(
              `\n\n💣💣💣 [UNHANDLED EVENT][useMachine]💣💣💣\nEvent=`,
              state.event,

              '\nState=',
              state.value, state,

              '\nContext=',
              state.context,
              '\n\n')

            return
          }

          if (debug === true) {
            console.group(`%c[useMachine ${name}]`, 'color: darkblue')
            this.dumpState(state.value)
            //dumpState(state.context)
            this.dumpState(state.event)
            console.log('ctx=', state.context)
            console.log('evt=', state.event)
            console.log('\n',)
            console.groupEnd()
          }

          // re-render if the state changed
          force(x => x + 1)
        })

      // start immediately, as it's in the constructor
      serviceRef.current.start()
    }

    // didMount
    useEffect(() => {
      return () => {
        console.log('useMachine unload')
        serviceRef.current.stop()
      }
    }, [])

    return [serviceRef.current.state, serviceRef.current.send, serviceRef.current];
  }



  // dump state tree in string format
  dumpState(item, depth = 1) {
    // if (depth == 1) console.log('\n')

    const MAX_DEPTH = 100
    depth = depth || 0
    let isString = typeof item === 'string'
    let isDeep = depth > MAX_DEPTH

    if (isString || isDeep) {
      console.log(item)
      return
    }

    for (var key in item) {
      console.group(key)
      this.dumpState(item[key], depth + 1)
      console.groupEnd()
    }
  }
}

export default Main;