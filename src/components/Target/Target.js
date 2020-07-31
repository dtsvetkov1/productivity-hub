import React, { useState } from 'react';
// import './App.css';
import { useQuery, useMutation } from '@apollo/client';


import CheckItem from '../CheckItem/CheckItem';

import { GET_CATEGORIES } from '../../qraphql/queries/tasks';

import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, } from '../../qraphql/mutations/mutations';



function setColor({ outdated, focus }) {
	if (outdated) return 'darkgray'
	return focus ? 'darkred' : 'darkgreen'
}

function App({ category, focus, onDelete, tasks, outdated, children, targetIndex }) {
	// console.log('FOCUSD', children, focus)
	// const [tasks, setTasks] = useState([])
	const [visible, setVisible] = useState(false)

	// const [tasks, setTasks] = useState([])
	const { data } = useQuery(GET_CATEGORIES);
	const categories = data.categories

	const [addTask] = useMutation(ADD_TASK);
	const [removeTask] = useMutation(REMOVE_TASK);
	const [updateTask] = useMutation(UPDATE_TASK);

	// let tasks = data.tasks 

	function setTitle({ value, index, targetIndex }) {
		updateTask({ variables: { title: value, taskId: index, id: targetIndex, list:'week' } })

		// setTasks(tasks.map((item, localIndex) => localIndex === index ? { ...item, title: value } : item))
	}

	function setChecked({ value, index }) {
		updateTask({ variables: { checked: value, taskId: index, id: targetIndex , list:'week'} })

		// setTasks(tasks.map((item, localIndex) => localIndex === index ? { ...item, checked: value } : item))
	}

	return (
		<div style={{margin:'5px auto'}} >

			<div style={{ backgroundColor: 'lightblue', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				
				<div onClick={() => {
					console.log('start')
					addTask({ variables: { title: '', checked: false, id: targetIndex, list:'week' } })
					// setTasks([...tasks, { title: '', checked: false }]); 
					setVisible(true)
				}}>+</div>

				<div style={{ margin: '0 10px' }}>{children}</div>

				<div style={{ alignSelf: 'flex-end', fontSize: 19, backgroundColor:'lightgray' }}>{category}</div>
				<div onClick={() => setVisible(!visible)} style={{ fontSize: 19 }}>...</div>

				<div onClick={onDelete}>x</div>
			</div>
			{visible ?
				tasks ? tasks.map((item, index) =>
					<CheckItem key={index} title={item.title} setTitle={value => setTitle({ targetIndex, index, value })} checked={item.checked}
						setChecked={(value) => setChecked({ targetIndex, index, value })}
						onDelete={() => {
							removeTask({ variables: { id: targetIndex, taskId: index, list:'week' } })

							// setTasks(tasks.filter((localItem, localIndex) => { return localIndex !== index })) 
						}} />
					// <div style={{flexDirection:'row', display:'flex'}}>{item}<div onClick={()=>{setTasks(tasks.filter((localItem, localIndex)=>index!==localIndex))}}>X</div></div>
				) : null
				: null}

		</div>
	);
}

export default App;
