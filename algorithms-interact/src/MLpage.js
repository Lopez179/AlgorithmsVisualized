import React, { useState } from 'react';
import './Components/SideBar.css';
import './MLpage.css'
import LinearRegressionDemo from './LinearRegression';
import LogisticRegressionDemo from './LogisticRegression';
import KNN from './KNN';


function MLpage() {
    const [demo, setDemo] = useState(0);
    

    return (
        <>
            <div className='SideBar'>
                <ul>
                    <li onClick={() => setDemo(0)}>Linear Regression</li>
                    <li onClick={() => setDemo(1)}>Logistic Regression</li>
                    <li onClick={() => setDemo(2)}>K Nearest Neighbours</li>
                    <li>More Comming Soon</li>
                </ul>
            </div>

            <DemoDisplay topic={demo}/>


        </>
    )
}

function DemoDisplay(props) {
    var Output;
    if (props.topic === 0)
    {
        Output = LinearRegressionDemo;
    }
    if (props.topic === 1)
    {
        Output = LogisticRegressionDemo;
    }
    if (props.topic === 2)
    {
        Output = KNN;
    }

    return (<Output/>);
}

export default MLpage;