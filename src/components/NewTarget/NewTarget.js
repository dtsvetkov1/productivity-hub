import React, { useState } from 'react';
// import logo from './logo.svg';
import './NewTarget.css';

import { BlockPicker, TwitterPicker } from 'react-color';

import MomentUtils from '@date-io/moment';
import moment from 'moment-timezone';
import {
    TimePicker,
    MuiPickersContext,
    LocalizationProvider,
    Day
    // MuiPickersUtilsProvider, 
} from "@material-ui/pickers";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { GET_CATEGORIES } from '../../qraphql/queries/tasks';
import { ADD_TARGET, ADD_CATEGORY, REMOVE_CATEGORY } from '../../qraphql/mutations/mutations';
import { withStyles } from '@material-ui/core/styles';

import { useQuery, useMutation, } from '@apollo/client';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        //   marginLeft: theme.spacing.unit,
        //   marginRight: theme.spacing.unit,
        width: 200,
    },

    cssLabel: {
        color: 'green',
        borderRadius: '10px'

    },

    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.primary.main} !important`,
        }
    },

    cssFocused: {},

    notchedOutline: {
        borderWidth: '1px',
        borderRadius: '5px 0 0 5px',
        borderColor: 'green !important'
    },

});


function TemplateTask({ title, onPress, }) {
    return <div style={{ backgroundColor: 'white', color: 'black', padding: '5px 10px', borderRadius: '10px', margin: '5px' }} onClick={onPress}>{title}</div>
}

function createDate({date, time}) {
    const hour = moment(time).get('hour')
    const minute = moment(time).get('minute')

    console.log(hour, minute)
    return moment(date).set({hour,minute})
}

function minTime(date) {
    return moment(date).startOf('day').isSame(moment().startOf('day'))?moment():moment().startOf('day')
}

function App({ onSubmitClick, stage, date, startTime, setStartTime, endTime, setEndTime }) {

    const { data } = useQuery(GET_CATEGORIES);

    const [addTarget] = useMutation(ADD_TARGET);
    const [addCategory] = useMutation(ADD_CATEGORY);
    const [removeCategory] = useMutation(REMOVE_CATEGORY);


    const [color, setColor] = useState('darkgreen')
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [filterSelectedOptions, setFilterSelectedOptions] = useState(true)
    const [task, setTask] = useState('')

    const categories = data.categories

    function onSubmit(e) {
        const category = document.getElementById('free-solo-demo').value
        console.log('categories ', category)
        addCategory({ variables: { title: category, color: color } })
        addTarget({
            variables: {
                list: stage !== 'day' ? stage : null, date: date, title: task, 
                start: createDate({date,time:startTime}), end: createDate({date,time:endTime}), 
                category: category, tasks: [{ title: '', checked: false }]
            }
        })
        let tmp = moment(startTime).add(1, 'hours')
        setStartTime(tmp);
        setEndTime(moment(tmp).add(1, 'hours'));

        setTask('')

        onSubmitClick(false)
    }

    return (
        <div style={{ width: '100%', borderRadius: 15 }}>
            <div style={{ margin: 10 }}>New Target - {stage}</div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <form style={{ backgroundColor: '#eee', borderRadius: '10px 10px 0 0', display: 'flex', flexDirection: 'row' }}
                        onSubmit={e => {
                            e.preventDefault();
                            if (task) { onSubmit(e) }
                        }}>
                        <input
                            style={{ backgroundColor: '#ddd', fontSize: 22, margin: '10px auto', border: '1px solid #bbb', borderRadius: 5, width: '60%', height: 40 }} placeholder={'Title'}
                            autoComplete="off" type="text" name="name" value={task} onChange={e => { setTask(e.target.value) }} />
                    </form>

                    <div style={{ backgroundColor: '#ddd', position: 'relative', borderRadius: '10px 10px 0 0 ', justifyContent: 'center', flexDirection: 'row', display: 'flex' }}>

                        <div style={{ display: 'flex', width: '60%', alignItems: 'center', margin: '10px auto', flexDirection: 'row', }}>
                            <Autocomplete
                                id="free-solo-demo"
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
                                    return (
                                        <React.Fragment>
                                            <span style={{ height: 10, width: 10, backgroundColor: category.color }} />
                                            <div onClick={()=> setFilterSelectedOptions(false) }>
                                                {category.title}
                                                <br />
                                            </div>
                                            <div onClick={()=>{console.log(1); removeCategory({variables:{title:category.title}})}} style={{ marginLeft: 100, }}>X</div>
                                        </React.Fragment>
                                    )
                                }}
                                style={{ flex: 1, margin: 0, padding: 0, border: 'none' }}
                                options={Object.keys(categories).map((option) => option)}
                                renderInput={(params) => (
                                    <TextField {...params} style={{ backgroundColor: '#bbb' }}
                                        // InputProps={{
                                        //     classes: {
                                        //         // root: classes.cssOutlinedInput,
                                        //         // focused: classes.cssFocused,
                                        //         notchedOutline: classes.notchedOutline,
                                        //     },
                                        //     inputMode: "numeric"
                                        // }}
                                        // InputLabelProps={{
                                        //     classes: {
                                        //         // root: classes.cssLabel,
                                        //         // focused: classes.cssFocused,
                                        //     },
                                        // }}
                                        // InputLabelProps={{ shrink: true, classes: {color:'red'} }}
                                        // InputProps={{ classes: {}, disableUnderline: true }}
                                        // FormHelperTextProps={{ classes: {} }}
                                        label="Category" margin="none" variant="outlined" />
                                )}
                            />
                            <div onClick={() => setDisplayColorPicker(!displayColorPicker)} style={{ borderRadius: '0 5px 5px 0', height: '56px', width: '40px', backgroundColor: color }}></div>
                            {displayColorPicker && <div style={{ position: 'absolute', zIndex: 4, top: '70%', left: '10%' }}><div style={{}}><TwitterPicker
                                color={color}
                                triangle={'top-right'}
                                onChange={(color, event) => { console.log('eeee', event); setColor(color.hex); }}
                            // onChangeComplete={(e)=>{console.log('eeee', e);setColor(e.hex);}}
                            /></div></div>}
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#ccc', display: 'flex', flex: 1, justifyContent: 'center', flexDirection: 'row', borderRadius: '10px 10px 0 0', }}>
                        <div style={{ width: '60%', flexDirection: 'row', display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                            <LocalizationProvider dateAdapter={MomentUtils} dateLibInstance={moment} >
                                <TimePicker
                                    ampmInClock
                                    clearable ampm={false} label="Start"
                                    minTime={minTime(date)}
                                    value={startTime} onChange={setStartTime}
                                    renderInput={props => <TextField {...props} style={{ backgroundColor: '#aaa', flex: 1, marginRight: 5, borderRadius: 5 }} />}
                                />
                                <TimePicker
                                    clearable ampm={false} label="End"
                                    minTime={startTime}
                                    value={endTime} onChange={setEndTime}
                                    renderInput={props => <TextField {...props} style={{ backgroundColor: '#aaa', flex: 1, marginLeft: 5, borderRadius: 5 }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>

                    <div style={{ padding: '10px 10px', backgroundColor: '#bbb', display: 'flex', borderRadius: '10px 10px 0 0', flexWrap: 'wrap' }}>
                        <TemplateTask title={'Training'} onPress={() => { }} />
                        <TemplateTask title={'Rest'} onPress={() => { }} />
                    </div>

                    <div style={{ backgroundColor: '#aaa', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'center' }}>
                        <input style={{ width: '60%', height: '50px', borderRadius: 5, margin: '40px auto' }}
                            onClick={() => task && document.getElementById('free-solo-demo').value ? onSubmit() : createDate({date, time:startTime})} type="submit" value="Отправить" />
                    </div>

                </div>

            </div>

        </div>

    );
}

export default withStyles(styles)(App);
