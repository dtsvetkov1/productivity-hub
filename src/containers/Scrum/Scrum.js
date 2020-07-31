import React, {} from 'react';
// import logo from './logo.svg';
// import './App.css';
import { Link } from "react-router-dom";

// import { gql, useQuery, useMutation } from "@apollo/client";

// import { GET_TASKS } from "../../qraphql/queries/tasks";
// import { ADD_TASK } from "../../qraphql/mutations/mutations";


function App() {

    return (
        <div style={{ width: '400px', margin: '0 auto' }} className="App">
            <header className="App-header">
                <div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flex: 0, }}>
                    <Link style={{ border: '1px solid black' }} to="/calendar">Calendar</Link>
                    <Link to="/scrum">Scrum</Link>
                    <Link to="/about">About</Link>
                </div>
                <div>
                  <div>current tiemr </div>
                </div>

                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
		</a>
            </header>
        </div>
    );
}

export default App;
