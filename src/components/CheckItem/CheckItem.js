import React, { } from 'react';

import './CheckItem.css'

import Checkbox from '@material-ui/core/Checkbox';
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';



function App({ onDelete, title, setTitle, checked, setChecked, index }) {

    return (
        <div style={{ width: '90%', margin: '5px auto', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {/* <div class="round">
            <input className={'CheckItem-checkbox'} style={{borderRadius:'50%', backgroundColor:'transparent'}} onChange={() => setChecked(!checked)} type="checkbox" checked={checked} />
            <label for="CheckItem-checkbox"></label>
        </div> */}
            <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleChecked style={{ color: 'green' }} />}
                onChange={() => setChecked(!checked)} checked={checked}
            />
            {/* <input className={'CheckItem-checkbox'} style={{borderRadius:'50%', backgroundColor:'transparent'}} onChange={() => setChecked(!checked)} type="checkbox" checked={checked} /> */}
            <input className={'CheckItem-title-input'} style={{
                width: '90%', backgroundColor: 'transparent', borderRadius: '10px', border: '1px solid rgba(0,0,255,0.2)',
                boxShadow: '0 0 1pt 1pt rgba(0,0,255,0.2)'
            }} type="text" value={title} onChange={e => setTitle(e.target.value)} />
            <div style={{ fontSize: 15, marginLeft: 5, marginBottom: 3 }} onClick={onDelete}>X</div>
        </div>
    );
}

export default App;
