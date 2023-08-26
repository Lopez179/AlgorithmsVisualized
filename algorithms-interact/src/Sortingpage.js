import React, { useState } from 'react';
import './Components/SideBar.css';
import BinarySortDemo from './BinarySort';
import './Sortingpage.css'

function SortingPage() {
    const [demo, setDemo] = useState(0);
    return(
        <>
            <div className='SideBar'>
                <ul>
                    <li onClick={() => setDemo(0)}>Quick Sort (Binary Sort)</li>
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
        Output = BinarySortDemo;
    }

    return (<Output/>);
}
export default SortingPage;