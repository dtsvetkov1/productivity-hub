import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './Settings.css';

import { Link } from "react-router-dom";

import moment from 'moment-timezone';

// import { GET_TOTAL_TIME } from '../qraphql/queries/tasks';
import { useQuery, useMutation } from '@apollo/client';

import Checkbox from '@material-ui/core/Checkbox';

import  { handleAuthClick, handleSignoutClick } from '../../api/google-tasks/tasks';

import { GET_WEEK_TARGETS, GET_COLOR_THEME } from '../../qraphql/queries/tasks';
import { SET_COLOR_THEME } from '../../qraphql/mutations/mutations';

const gapi = window.gapi;

function Settings() {
    const { data: { colorTheme } } = useQuery(GET_COLOR_THEME);

    const [setColorTheme] = useMutation(SET_COLOR_THEME);

	const [isSignedIn, setSignedIn] = useState(false)
	const [checked, setChecked] = useState(colorTheme==='dark'?true:false)

	console.log('colorTheme ', colorTheme)

	useEffect(() => {
		gapi.auth2.getAuthInstance().isSignedIn.listen((val) => { console.log('goolge tasks status ', val); setSignedIn(val) });

	}, [])

	return (
		<div className={`settings-${colorTheme}`} style={{ height: '100vh', }}>
			<div style={{ marginTop: 20, fontSize: 22 }}>SETTINGS</div>

			<div style={{ marginTop: 20 }}>Main Settings:</div>
			<div style={{ justifyContent: 'center', margin: '20px auto', display: 'flex', flexDirection: 'row' }}>
				<div>
					Dark Mode
					</div>
				<Checkbox
					checked={checked}
					onChange={e=>{ setColorTheme({variables:{theme:e.target.checked?'dark':'light'}}); setChecked(e.target.checked)}}
					inputProps={{ 'aria-label': 'primary checkbox' }}
				/>
			</div>


			<div>
				<div style={{ margin: '10px auto' }}>Sync with other services:</div>

				<div onClick={() => { }} style={{ flexDirection: 'row', display: 'flex', alignItems:'center', justifyContent: 'center', }}>
					<label htmlFor="google-tasks-checkbox">Google Tasks</label>
					<div>
						{/* <input id="google-tasks-checkbox" type="checkbox" /> */}
						{isSignedIn ?
							<div onClick={() => handleSignoutClick()} style={{ margin: 10, borderRadius: 10, backgroundColor: 'darkblue', padding: 10 }}>Log Out</div> :
							<div onClick={() => handleAuthClick()} style={{ margin: 10, backgroundColor: 'white', borderRadius: 10, color: 'gray', padding: 10 }}>Log In</div>}
					</div>
				</div>
			</div>

			<div style={{  justifyContent: 'center', alignItems:'center', margin: '20px auto', display: 'flex', flexDirection: 'row' }}>
				<div>
					Show clock on main screen
					</div>
				<input disabled={true} type="checkbox" />
			</div>
			<div >
				<Link to={'/'}><div style={{ backgroundColor: 'white', padding: '10px', color: 'black' }}>Home</div></Link>
			</div>
		</div>

	);
}

export default Settings;
