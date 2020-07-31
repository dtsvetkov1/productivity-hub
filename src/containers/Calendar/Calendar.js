import React, { useState, useEffect } from 'react';

import moment from 'moment-timezone';

import GridLayout from 'react-grid-layout';

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import {
	Link
} from "react-router-dom";

// import TaskInput from './components/TaskInput';
// import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { GET_TARGETS, GET_CATEGORIES, GET_TIMER_HISTORY, GET_TOTAL_TIME } from '../../qraphql/queries/tasks';
import typeDefs from '../../qraphql/definitions/definitions';


function App() {
    const hours = Array(10)
    // const layout = [
    //     {i: 'a', x: 0, y: 0, w: 2, h: 2,},
    //     {i: 'b', x: 0, y: 1, w: 3, h: 2, minW: 2, maxW: 4},
    //     {i: 'c', x: 0, y: 2, w: 2, h: 2}
    //   ];
    const layout = [...hours].map((item, index)=>{return  {i: index, x: 0, y: 0, w: 6, h: 2,}})

    return (
        <div style={{ width: '400px', margin: '0 auto' }} className="App">
            <div style={{ height: '100vh', border: '1px solid blue', display: 'flex', flexDirection: 'column' }}>
                <header className="App-header">
                <Link to="/">Main</Link>

                    <div style={{ margin: '30px 0' }}>CALENDARS</div>
                    <GridLayout  className="layout" layout={layout} cols={12} rowHeight={30} width={400}>
                    {[...Array(10)].map((item, index) => <div style={{backgroundColor:'gray', width:'100%'}}  key={index}>{index}</div>)}
                    </GridLayout>
                    {/* {Array.from(Array(10)).map((item, index) => <div>{index}</div>)} */}
                </header>
                
                <div style={{ height: '50px', border: '1px solid green' }}>ds</div>
            </div >
        </div>
    );
}

export default App;
