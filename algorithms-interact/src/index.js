import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './homepage';
import MLpage from './MLpage';
import SortingPage from './Sortingpage';

function SubjectSelect() {
    const [subject, setSubject] = useState(0);

    return(
    <>
    <nav className='SubjectSelect'>
        <ul >
            <li className = {subject === 0 ? "in" : "notIn"} onClick={() => setSubject(0)}>Home</li>
            <li className = {subject === 1 ? "in" : "notIn"} onClick={() => setSubject(1)}>Machine Learning</li>
            <li className = {subject === 2 ? "in" : "notIn"} onClick={() => setSubject(2)}>Sorting</li>
        </ul>
    </nav>
    

    <DisplaySubject topic={subject}/>


    </>
    )
}

function DisplaySubject(props) {
    var Output;
    if (props.topic === 0) {
        Output = HomePage
    }
    if (props.topic === 1) {
        Output = MLpage;
    }
    if (props.topic === 2) {
        Output = SortingPage;
    }
    return(<Output/>);
}

function Display() {
    return(<SubjectSelect/>)
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(<Display />);
