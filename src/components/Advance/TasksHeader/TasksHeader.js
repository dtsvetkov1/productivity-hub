import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import './App.css';

import { Link } from "react-router-dom";

import moment from 'moment-timezone';
import Modal from 'react-modal';

import { useQuery } from '@apollo/client';

import { GET_TOTAL_TIME, GET_WEEK_TARGETS } from '../../../qraphql/queries/tasks';
import gapi, { getLists, handleAuthClick, createList } from '../../../api/google-tasks/tasks'

const customStyles = {
    content: {
        top: '20%',
		left: '50%',
		width:'360px',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

// console.log('gapi  ',gapi)

function TargetModal({title, index}) {
	return <div key={index} onClick={() => { }}>{title}</div>
} 

function App() {
	const [isSignedIn, setSignedIn] = useState(undefined)
	const [modalVisible, setModalVisible] = useState(false)
	const [targets, setTargets] = useState([])

	const { data: { weekTargets } } = useQuery(GET_WEEK_TARGETS);
    const weekTargetsList = weekTargets[moment().endOf('week')] || []

	function closeModal() {
		setModalVisible(false)
	}

	useEffect(() => {
		const GoogleAuth = gapi.auth2.getAuthInstance()
		// console.log('GoogleAuth ', GoogleAuth.isSignedIn)
		GoogleAuth && GoogleAuth.isSignedIn.listen((a) => { console.log('aaa', a); setSignedIn(a) })
		// GoogleAuth.isSignedIn.listen()
	}, [])


	return (
		<div style={{ width:'100%', margin: '0 auto' }} >
			<Modal
				isOpen={modalVisible}
				// onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				closeTimeoutMS={300}
				style={customStyles}
				contentLabel="Example Modal"
			>
				<div style={{ margin: '10px 0' }}>Week Targets</div>
				{weekTargetsList.map((item, index) => { return <TargetModal {...item} key={index} /> })}
				<div style={{ margin: '10px 0' }}>+ add</div>
			</Modal>
				<div >
					<Link to={'/tasks'}>
						<div
						// onClick={() => { handleAuthClick() }}  
						style={{ backgroundColor: 'white', padding: '10px', color: 'black' }}>Google Tasks</div></Link>
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between`' }}>
						<div onClick={()=>{setModalVisible(true)}} style={{ flex: 1 }}>Week</div>
						<div style={{ flex: 1 }}>Month</div>
						<div style={{ flex: 0 }}>Other</div>
					</div>
				</div>
		</div>

	);
}

export default App;
