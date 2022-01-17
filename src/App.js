import React, { useState } from 'react';
import Test from './Test';
import data_nn from './resources/data.json';
import data_pravo from './resources/data_2.json';
import cs from './App.module.css';


export default function App() {
    const [data, setData] = useState('');

    return (
        <>
            {
                data !== ''
                    ? <Test data={data}></Test>
                    : <div className={cs.containerCourses}>
                        <div className={cs.course} onClick={() => setData(data_nn)}>Нейронные сети</div>
                        <div className={cs.course} onClick={() => setData(data_pravo)}>Право</div>
                    </div>
            }
        </>
    );
}
