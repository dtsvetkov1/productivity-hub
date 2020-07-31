import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './Tasks.css';

import {
    Link,
    Route,
    Switch,
    useRouteMatch
} from "react-router-dom";

import moment from 'moment-timezone';

import { BlockPicker } from 'react-color';
// import TasksHeader from '../../components/Tasks/TasksHeader/TasksHeader';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Task from '../../components/TaskBlock/TaskBlock';
import Target from '../../components/Target/Target';

import { GET_TARGETS, GET_WEEK_TARGETS, GET_CATEGORIES } from '../../qraphql/queries/tasks';
import { ADD_TARGET, REMOVE_TARGET } from '../../qraphql/mutations/mutations';
import { useQuery, useMutation } from '@apollo/client';
import { getLists } from '../../api/google-tasks/tasks';

import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root')

function NewTarget({ addTarget }) {

    const { data } = useQuery(GET_CATEGORIES);
    const categories = data.categories

    const [target, setTarget] = useState('')
    const [color, setColor] = useState('darkgreen')
    const [displayColorPicker, setDisplayColorPicker] = useState(false)

    // const [target, setTarget] = useState('')
    function onSubmit(e) {
        const category = document.getElementById('new-target-demo').value;

        addTarget({ variables: { list: 'week', title: target, category, color:color, tasks: [] } })
    }

    return <div style={{ display: 'flex', flexDirection: 'row', }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
            <form style={{ display: 'flex', flexDirection: 'row' }}
                onSubmit={e => {
                    e.preventDefault();
                    if (target) {
                        onSubmit(e)
                        // addTarget({ variables: { list: 'week', title: 'task', category: 'category', tasks: [] } })
                    }
                }}>
                <div>
                    <label>
                        <input type="text" name="name" value={target} onChange={e => { setTarget(e.target.value) }} />
                    </label>
                </div>
            </form>

            <div style={{ position: 'relative', flexDirection: 'row', display: 'flex' }}>
                <Autocomplete
                    id="new-target-demo"
                    freeSolo
                    onChange={(event, newValue) => {
                        // setPendingValue(newValue);
                        console.log('newValue', newValue)
                        categories[newValue] ? setColor(categories[newValue].color) : setColor('darkgreen')
                    }}
                    onBlur={(e) => {
                        console.log('BLUS SONG @', e.target.value)
                        const newValue = e && e.target && e.target.value
                        categories[newValue] ? setColor(categories[newValue].color) : setColor('darkgreen')
                    }}
                    renderOption={(option, { selected }) => {
                        const category = categories[option]
                        // const category = document.getElementById('free-solo-demo').value
                        return (
                            <React.Fragment>
                                <span style={{ height: 10, width: 10, backgroundColor: category.color }} />
                                <div>
                                    {category.title}
                                    <br />
                                </div>
                                <div
                                    style={{ marginLeft: 100, visibility: selected ? 'visible' : 'hidden' }}
                                >X</div>
                            </React.Fragment>
                        )
                    }}
                    style={{ width: '80%', backgroundColor: 'white' }}
                    options={Object.keys(categories).map((option) => option)}
                    renderInput={(params) => (
                        <TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
                    )}
                />
                <div onClick={() => setDisplayColorPicker(!displayColorPicker)} style={{ height: '40px', width: '40px', backgroundColor: color }}></div>
                {displayColorPicker && <div style={{ position: 'absolute', zIndex: 2, top: 50, left: '50%', }}>
                    <div style={{}}>
                        <BlockPicker color={color} onChange={(color, event) => { console.log('eeee', event); setColor(color.hex); }} />
                    </div>
                </div>}
            </div>

        </div>
        <input onClick={() => target && document.getElementById('new-target-demo').value ? onSubmit() : null} type="submit" value="Отправить" />
    </div>
}



function Tasks() {

    let match = useRouteMatch();

    const [taskList, setTaskList] = useState([{ title: '1' }])
    const [tasks, setTasks] = useState([])
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const [addTarget] = useMutation(ADD_TARGET);
    const [removeTarget] = useMutation(REMOVE_TARGET);


    const { data: { weekTargets } } = useQuery(GET_WEEK_TARGETS);
    const weekTargetsList = weekTargets[moment().endOf('week')]

    // console.log('weekTargets ', weekTargets)
    // console.log("moment().endOf('week') - ", moment().endOf('week'))

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div style={{ width: '400px', margin: '0 auto' }} className="App">
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                closeTimeoutMS={300}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div style={{ margin: '10px 0' }}>Select or create new:</div>
                {taskList.map((item, index) => { return <div key={index} onClick={() => { }}>{item.title}</div> })}
                <div style={{ margin: '10px 0' }}>+ Create new TaskList</div>
            </Modal>
            <div style={{ height: '100vh', border: '1px solid blue', display: 'flex', flexDirection: 'column' }}>
                <header >
                    {/* <TasksHeader></TasksHeader> */}
                    <div
                        // onClick={() => { handleAuthClick() }}  
                        style={{ backgroundColor: 'white', padding: '10px', color: 'black' }}>Google Tasks</div>
                    <div>
                        <div style={{ flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                            <div>Weekly: {}</div>
                            <div>Monthly: {}</div>
                            <div>Other: {}</div>
                        </div>

                        <div style={{ flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                            {['Week', 'Month', 'Other'].map((item, index) => <div key={index} style={{ flexDirection: 'row', display: 'flex' }}>
                                <div onClick={async () => { const list = await getLists(); setTaskList(list); setIsOpen(!modalIsOpen) }} style={{ backgroundColor: 'green' }}>Create</div>
                                <Link to={`${match.url}/${item}`}><div onClick={() => { }} style={{ backgroundColor: 'lightblue' }}>Open</div></Link>
                            </div>)}
                        </div>

                        {/* <div onClick={async () => { const list = await getLists(); setTaskList(list) }}>Get google task list</div> */}

                        {tasks.map(item => { return <div key={item}>{item.toString()}</div> })}
                    </div>

                    <div style={{ marginTop: 10, border: '1px solid red', height: '40px' }}>
                        <Link to="/calendar">Calendar</Link>
                        <Link to="/scrum">Scrum</Link>
                        <Link to="/">About</Link>
                    </div>

                    <NewTarget addTarget={addTarget} />

                    <Switch>
                        <Route path={`${match.path}/week`}>
                            <div>Weekly</div>
                            <div>{(weekTargetsList && weekTargetsList.length) ? 
                            weekTargetsList.map((item, index) => <Target key={index}
                                targetIndex={index}
                                tasks={item.tasks}
                                onDelete={()=>{console.log('remoe'); removeTarget({variables:{id:index, list:'week'}})}}
                                category={item.category}>{item.title}</Target>) : 
                            <div>No tasks</div>}</div>
                            <div onClick={() => {
                                addTarget({ variables: { list: 'week', title: 'task', category: 'category', tasks: [] } })
                            }}>+ Add task</div>
                        </Route>
                        <Route path={`${match.path}/month`}>
                            <h3>Monthly</h3>
                        </Route>
                        <Route path={`${match.path}/other`}>
                            <h3>Other</h3>
                        </Route>
                    </Switch>
                </header>
            </div >
        </div>

    );
}

export default Tasks;
