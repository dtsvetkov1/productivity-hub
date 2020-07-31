import React, { useState, useEffect } from 'react';
// import './App.css';
import { Transition } from 'react-transition-group';

import { Motion, spring } from 'react-motion';

import { useQuery, useMutation } from '@apollo/client';

import CheckItem from '../CheckItem/CheckItem';

import { GET_CATEGORIES } from '../../qraphql/queries/tasks';
import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, } from '../../qraphql/mutations/mutations';

const duration = 1000
const defaultStyle = {
	transition: `background ${duration}ms ease-in-out`,
	opacity: 1,
}
const transitionStyles = {
	entering: () => { return { background: `linear-gradient(121deg, rgba(6,2,80,1) 0%, rgba(6,2,80,1) 0%, rgba(0,212,255,1) 100%)` } },
	entered: () => { return { background: `linear-gradient(121deg, rgba(6,2,80,1) 0%, rgba(6,2,80,1) 0%, rgba(0,212,255,1) 100%)` } },
	exiting: (val) => { return { background: `linear-gradient(121deg, rgba(6,2,80,1) 0%, rgba(6,2,80,1) ${val}%, rgba(0,212,255,1) 100%)` } },
	exited: (val) => { return { background: `linear-gradient(121deg, rgba(6,2,80,1) 0%, rgba(6,2,80,1) ${val}%, rgba(0,212,255,1) 100%)` } },
};

function setColor({ outdated, focus }) {
	if (outdated) return 'darkgray'
	return focus ? 'darkred' : 'darkgreen'
}

function App({ start, end, category, focus, timer, onDelete, tasks, onPlay, outdated, title, targetIndex, stage }) {
	const { data } = useQuery(GET_CATEGORIES);

	const [addTask] = useMutation(ADD_TASK);
	const [removeTask] = useMutation(REMOVE_TASK);
	const [updateTask] = useMutation(UPDATE_TASK);

	const [visible, setVisible] = useState(false)

	const categories = data.categories
	const completedTasks = tasks.filter(item => item.checked).length
	let progress = completedTasks / tasks.length

	function setTitle({ value, index, targetIndex, list }) {
		updateTask({ variables: { list, title: value, taskId: index, id: targetIndex } })
	}

	function setChecked({ value, index, list }) {
		updateTask({ variables: { list, checked: value, taskId: index, id: targetIndex } })
	}

	function getBackground({ outdated, focus, state, stage }) {
		if (stage === 'week') {
			return `linear-gradient(to right, #4776E6 0%, #8E54E9 ${state.x}%, #4776E6 100%)`
		}
		if (outdated) {
			return `linear-gradient(133deg, rgba(79,78,79,1) 0%, rgba(94,94,94,1) ${state.x}%, rgba(255,227,229,1) 98%)`
		}
		if (focus) {
			return `linear-gradient(133deg, rgba(244,39,132,1) 0%, rgba(241,129,129,1) ${state.x}%, rgba(255,211,213,1) 98%)`
		}
		return `linear-gradient(121deg, rgba(6,2,80,1) 0%, rgba(6,2,80,1) ${state.x}%, rgba(0,212,255,1) 100%)`
	}

	useEffect(() => {
		if (progress !== completedTasks / tasks.length) {
			console.log('NOT EQUAL')
		}
	}, [completedTasks, tasks])


	return (
		<Motion defaultStyle={{ x: 0 }}
			style={{ x: spring(100 * completedTasks / tasks.length) }}>
			{state => {
				return <div className={'target-animation'} style={{ display: 'flex', flex: 1, flexDirection: 'column', margin: '5px auto', }} >

					<div style={{
						userSelect: 'none',
						position: 'relative',
						backgroundColor: setColor({ outdated, focus }),
						borderRadius: '5px', padding: '0 5px',
						display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
						background: getBackground({ outdated, focus, state, stage })
					}}
						className={{ backgroundColor: 'red' }}
					>
						<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<div style={{ fontSize: 20, }}>
									<div style={{}}>{start}</div>
									<div style={{}}>{end}</div>
								</div>
								<div onClick={onPlay} style={{
									fontSize: 13, backgroundColor: timer ? 'red' : 'green', height: 25, width: 25, borderRadius: '50%',
									display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "0 5px"
								}}>A</div>
								{/* &#9654; */}
								<div style={{ paddingBottom: 4, }} onClick={() => {
									addTask({ variables: { list: stage, title: '', checked: false, id: targetIndex } })
									setVisible(true)
								}}>+</div>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
								{/* <div style={{ fontSize: 11 }}>{tasks.filter(item => item.checked).length}/{tasks.length}</div> */}
								<div style={{ margin: '2px 10px', float: 'left', maxWidth: 160, fontSize: 24, flex: 1, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
							</div>

							<div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
								<div onClick={() => setVisible(!visible)} style={{
									fontSize: 19, display: 'flex', justifyContent: 'center', alignItems: 'center',
									margin: '3px 0 5px',
								}}>&middot;&middot;&middot;</div>
								<div style={{ textAlign: 'center', fontSize: 18, }} onClick={onDelete}>x</div>
							</div>
						</div>
						<div style={{
							borderTop: '1px solid gray',
							flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
						}}>
							<div></div>
							<div style={{
								fontSize: 15, padding: "1px 5px", opacity: 0.5,
								whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
								backgroundColor: categories[category] ? categories[category].color : 'green'
							}}>{category}</div>
							<div style={{ fontSize: 11, color: 'black' }}>{tasks.filter(item => item.checked).length}/{tasks.length}</div>

						</div>
					</div>
					<div className={visible ? 'tasks-display' : 'tasks-display-none'}
						style={{
							margin: '0 auto', width: '95%', borderRadius: '0 0 10px 10px',
							background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
						}}>
						{
							tasks ? tasks.map((item, index) =>
								<CheckItem key={index} title={item.title} setTitle={value => setTitle({ list: stage, targetIndex, index, value })} checked={item.checked}
									setChecked={(value) => setChecked({ list: stage, targetIndex, index, value })}
									onDelete={() => {
										removeTask({ variables: { list: stage, id: targetIndex, taskId: index } })
									}} />
							) : null
						}
					</div>

				</div>
			}}
		</Motion>
	);
}

export default App;
