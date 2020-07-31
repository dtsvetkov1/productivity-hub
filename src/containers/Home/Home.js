
import React from 'react';
import { Link } from "react-router-dom";

import Targets from '../../components/Targets/Targets';


function Home({ currentTime }) {
    return <div className={''} style={{ backgroundColor: 'darkgray', height: '98vh', border: '1px solid blue', display: 'flex', flex: 1, flexDirection: 'column' }}>
        {/* <header className="App-header" > */}
        <Targets currentTime={currentTime} />
        {/* </header> */}
        <div style={{ border: '1px solid green', display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <div style={{}}>Some relevant info:</div>
            <div><textarea style={{ resize: 'none' }} name="relevant-info" id="relevant-info" cols="30" rows="9"></textarea></div>
        </div>
        <div style={{
            display: 'flex', height: '40px', flexDirection: 'row', width: '100%', justifyContent: 'space-around',
        }}>
            {/* <Link to="/calendar">Calendar</Link> */}
            {/* <Link to="/scrum">Scrum</Link> */}
            {/* <Link to="/tasks">Targets</Link> */}
            <Link to="/projects">Projects</Link>
            <Link to="/Settings">Settings</Link>
            <Link to="/">About</Link>
        </div>
    </div>
}

export default Home;