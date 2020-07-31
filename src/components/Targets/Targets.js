import React, { useState } from 'react';
// import logo from './logo.svg';
import './Targets.css';
import { Transition } from 'react-transition-group';

import MomentUtils from '@date-io/moment';
import moment from 'moment-timezone';
import {
    DatePicker,
    LocalizationProvider
} from "@material-ui/pickers";

import Modal from 'react-modal';

import TextField from '@material-ui/core/TextField';

import Task from '../TaskBlock/TaskBlock';
import NewTarget from '../NewTarget/NewTarget';

import { GET_TARGETS, GET_TOTAL_TIME, GET_TIMER_HISTORY, GET_WEEK_TARGETS, GET_CATEGORIES, GET_COLOR_THEME } from '../../qraphql/queries/tasks';

import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_TARGET, UPDATE_TOTAL_TIME, ADD_TIMER } from '../../qraphql/mutations/mutations';

const duration = 1500;

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: '400px',
        right: 'auto',
        bottom: 'auto',
        opacity: 0.8,
        borderRadius: '15px 15px 0 0',
        padding: 0,
        margin: 0,
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

function StageButton({ onClick, title, active }) {
    return <div className={'stage-button'} style={{
        fontSize: active ? 22 : 16, justifyContent: 'center', alignItems: 'center', display: 'flex',
        backgroundColor: active ? 'red' : 'darkgray', borderRadius: 15, padding: active ? '0 25px' : '0 5px', margin: '5px 5px 0'
    }} onClick={onClick}>{title}</div>

}

function App({ currentTime }) {
    let { data: { colorTheme } } = useQuery(GET_COLOR_THEME);
    let { data: { targets } } = useQuery(GET_TARGETS);
    const { data: { weekTargets } } = useQuery(GET_WEEK_TARGETS);
    // const { data: { timerHistory } } = useQuery(GET_TIMER_HISTORY);
    const { data: { totalTime } } = useQuery(GET_TOTAL_TIME);

    const [removeTarget] = useMutation(REMOVE_TARGET);
    const [addTimer] = useMutation(ADD_TIMER);
    const [updateTotalTime] = useMutation(UPDATE_TOTAL_TIME);

    const [day, setDay] = useState(moment())
    const [showTarget, setShowTarget] = useState('day')
    const [timer, setTimer] = useState(-1)
    const [currentStart, setCurrentStart] = useState(moment())
    const [newTargetVisible, setNewTargetVisible] = useState(false);

    const [startTime, setStartTime] = useState(moment())
    const [endTime, setEndTime] = useState(moment().add(1, 'hours'))

    targets = [...targets[moment(day).endOf('day')] || []].sort((a, b) => moment(a.start) > moment(b.start) ? 1 : -1)

    function startTimer(index) {
        console.log('index startTimer ', index)
        setCurrentStart(moment())
        if (timer === -1) {
            setTimer(index)
        }
        else if (index !== timer) {
            setTimer(index)
            addTimer({ variables: { duration: calculateTimer(), ...targets[index] } })
            updateTotalTime({ variables: { duration: calculateTimer() } })
        }
        else {
            setTimer(-1)
            addTimer({ variables: { duration: calculateTimer(), ...targets[index], start: (currentStart).format() } })
            updateTotalTime({ variables: { duration: (calculateTimer()) } })
        }
    }

    function displayTimer() {
        let ms = moment(currentTime, "DD/MM/YYYY HH:mm:ss").diff(moment(currentStart, "DD/MM/YYYY HH:mm:ss"));
        let d = moment.duration(ms);
        let s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        return s
    }

    function calculateTimer() {
        let ms = moment(currentTime, "DD/MM/YYYY HH:mm:ss").diff(moment(currentStart, "DD/MM/YYYY HH:mm:ss"));
        let d = moment.duration(ms);
        console.log('d FINAL ', d.asSeconds())
        return d.asSeconds()
    }

    return (

        <div className={`Targets-${colorTheme}`}>
            <div className={"calendar-block-container"}>
                <div style={{ width: '100%', flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>Prev</div>
                    <LocalizationProvider dateAdapter={MomentUtils} dateLibInstance={moment} >
                        <DatePicker
                            minDate={moment()}
                            label="Date"
                            value={day}
                            format="DD MMM yyyy"
                            onChange={setDay}
                            animateYearScrolling
                            renderInput={props => <TextField style={{ backgroundColor: 'transparent', color: 'red' }} {...props} color='primary' />}
                        />
                    </LocalizationProvider>
                    <div>Next</div>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {['day', 'week', 'month', 'other'].map((item, index) => {
                        return <StageButton key={item} onClick={() => { setShowTarget(item) }} title={item.toUpperCase()} active={showTarget === item} />
                    })}
                </div>

            </div>

            <div style={{ fontSize: 20, flexDirection: 'row', display: 'flex', justifyContent: 'space-around' }}>
                <div><div>Total time: </div>
                    <div>{parseFloat(totalTime).toFixed(3)}</div></div>
                <div><div>Current timer: </div>
                    <div>{timer !== -1 ? displayTimer() : 'not started'}</div>
                </div>
            </div>


            <div style={{ backgroundColor: 'gray', width: '90%', margin: '0 auto', padding: '5px 10px', borderRadius: '10px' }}>
                {showTarget === 'day' && (targets && targets.length ?
                    <div className='targets-container'>
                        {targets
                            .map((item, index) => <Task key={index}
                                // stage={'day'}
                                timer={timer !== -1 && timer === index}
                                onPlay={() => { startTimer(index); }}
                                onDelete={() => { removeTarget({ variables: { id: index, date: moment(day).endOf('day') } }) }}
                                targetIndex={index}
                                outdated={moment(currentTime).isAfter(moment(item.end))}
                                tasks={item.tasks}
                                title={item.title}
                                focus={moment(currentTime).isAfter(moment(item.start)) && moment(currentTime).isBefore(moment(item.end))}
                                start={moment(item.start).format('H:mm')} end={moment(item.end).format('H:mm')}
                                category={item.category}></Task>)}</div>
                    : <div>no tasks</div>)
                }


                {showTarget === 'week' && (weekTargets[moment().endOf('week')] && weekTargets[moment().endOf('week')].length ?
                    <div style={{ width: '100%' }} className={showTarget === 'week' && 'targets-container'}>
                        {weekTargets[moment().endOf('week')]
                            .map((item, index) => <Task key={index}
                                timer={timer}
                                stage={'week'}
                                onPlay={() => { startTimer(index); }}
                                onDelete={() => { removeTarget({ variables: { list: 'week', id: index } }) }}
                                targetIndex={index}
                                tasks={item.tasks}
                                title={item.title}
                                category={item.category}></Task>)}
                    </div>
                    : <div>no tasks</div>)
                }
                {/* </div> */}
            </div>
            <div style={{ position: 'absolute', alignSelf: 'center', left: '50%', transform: 'translate(-50%,0)', bottom: '230px' }}>
                <Modal
                    isOpen={newTargetVisible}
                    onRequestClose={() => setNewTargetVisible(false)}
                    closeTimeoutMS={300}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <NewTarget date={moment(day).endOf('day')} onSubmitClick={setNewTargetVisible} stage={showTarget}
                        startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} />
                </Modal>
                <div style={{ fontSize: 19, width: 90, textAlign:'center', backgroundColor: 'rgba(200,0,0,1)', borderRadius: 15, padding: '0 10px', height: 25,}}
                    onClick={() => { console.log('dsjlsdf'); setNewTargetVisible(true) }}>+ {showTarget}</div>
            </div>
        </div>
    );
}

export default App;
