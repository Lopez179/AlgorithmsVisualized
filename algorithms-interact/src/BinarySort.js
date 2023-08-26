
import React, { useState, StrictMode, useRef } from 'react';
import {Chart as ChartJS, CategoryScale, BarElement, LinearScale} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, BarElement, LinearScale);

class Quicksort {
    constructor(init) {
        this.array = [...init];
        this.callstack = [[0, this.array.length - 1]];
        this.current_pivot_index = null;
        this.leftpointer = null;
        this.rightpointer = null;
    }

    swap(index1, index2) {
        let newval1 = this.array[index2];
        let newval2 = this.array[index1];

        this.array[index1] = newval1;
        this.array[index2] = newval2;
    }

    insert_element(element) {
        this.array.push(element);
        this.callstack[0][1] = this.array.length - 1;
    }

    //these functions are to be used outside this class

    //this has yet to be tested
    check_base_case() {
        if (this.callstack.length === 0) {
            return 1; //sorting complete
        }
        if (this.callstack[this.callstack.length - 1][0] + 1 === this.callstack[this.callstack.length - 1][1])
        {
            if (this.array[this.callstack[this.callstack.length - 1][0]] > this.array[this.callstack[this.callstack.length - 1][1]]) {
                this.swap(this.callstack[this.callstack.length - 1][0], this.callstack[this.callstack.length - 1][1]);
            }
            this.callstack.pop(); 
            return 0; //sort next index in call stack
        }
        else if (this.callstack[this.callstack.length - 1][0] === this.callstack[this.callstack.length - 1][1])
        {
            this.callstack.pop();
            return 0; //sort next index in call stack
        }
        return 2; //sort as usual
    }

    select_pivot() {
        
        let left_bound = this.callstack[this.callstack.length - 1][0];
        let right_bound = this.callstack[this.callstack.length - 1][1];
        let random_selection_indices = [left_bound, left_bound+1, right_bound];
        let random_selection = random_selection_indices.map((value) => this.array[value]);
        random_selection.sort((a,b) => {return a - b});
        let selection = random_selection[1];
        let pivot_index = random_selection_indices[random_selection_indices.findIndex((value) => this.array[value] === selection)];
        
        this.current_pivot_index = pivot_index;

        return 3; //move pivot to right
    }

    pivot_to_right() {
        this.swap(this.current_pivot_index, this.callstack[this.callstack.length - 1][1]);
        this.current_pivot_index = this.callstack[this.callstack.length - 1][1];

        return 4; //establish pointers
    }

    establish_pointers() {
        this.leftpointer = this.callstack[this.callstack.length-1][0];
        this.rightpointer = this.callstack[this.callstack.length - 1][1] - 1;

        return 5; //move left pointer
    }

    find_misplaced_item_left() {
        if ((this.array[this.leftpointer] > this.array[this.current_pivot_index]) && (this.leftpointer < this.callstack[this.callstack.length - 1][1])) {
            return 6; //start moving right pivot
        }
        else if ((this.leftpointer === this.callstack[this.callstack.length - 1][1])) {
            return 6;
        }
        else {
            this.leftpointer++;
            return 5; //moving left pivot again
        }
    }

    find_misplaced_item_right() {
        if (this.rightpointer === this.callstack[this.callstack.length - 1][0]) {
            return 8;
        }

        if (this.array[this.rightpointer] < this.array[this.current_pivot_index]) {
            if (this.leftpointer > this.rightpointer) {
                return 8; //return pivot
            }
            else {
                return 7; //swap with left pointer
            }
        }
        else {
            this.rightpointer--;
            return 6; //move right pivot again
        }
    }

    swap_misplaced_items() {
        this.swap(this.leftpointer, this.rightpointer);
        return 5; //move left pivot
    }

    //hasn't been tested yet
    return_pivot() {
        this.swap(this.leftpointer, this.current_pivot_index);
        this.current_pivot_index = this.leftpointer;
        this.leftpointer = null;
        return 9; //add the two sides of the pivot to the call stack
    }

    //this hasn't been tested yet
    add_to_callstack() {
        this.rightpointer = null;
        let lastcall = this.callstack.pop();

        let rightside_left_bound = this.current_pivot_index + 1;
        let rightside_right_bound = lastcall[1];
        this.callstack.push([rightside_left_bound,rightside_right_bound]);

        let leftside_left_bound = lastcall[0];
        let leftside_right_bound = this.current_pivot_index - 1;
        this.callstack.push([leftside_left_bound, leftside_right_bound]);

        return 0; //check for base case
    }

}

//when you return, rewrite implementation of pointer functions so that they are in a cycle, when right follows left, followed by a check if left is higher than right


function BinarySortDemo() {
    const [phase, setPhase] = useState(1);
    const [DisplayArray, setDisplayArray] = useState([4,9,14,5,12,1,7,20,8,6,13]);
    const [colors, setColors] = useState(DisplayArray.map((value) => 'aqua'));
    const [explain, setExplain] = useState("Quicksort will be used to sort the elements in ascending order, where smaller elements are on the left, and larger elements are on the right. Click on \"Sort\" to begin, and click \"Next\" to continue.");
    const labelsState = useRef(DisplayArray.map((value) => ' '));
    const sortingstate = useRef(new Quicksort(DisplayArray));
    const [newElementState, setNewElementState] = useState(1);

    function newColorArray(left_pointer, rightpointer, pivot) {
        let template = DisplayArray.map((value) => 'aqua');
        if (left_pointer != null) {
            template[left_pointer] = 'rgb(200,40,255)';
        }
        if (rightpointer != null) {
            template[rightpointer] = 'red';
        }
        template[pivot] = 'yellow';
        return template;
    }


    //Sorting
    var SO = sortingstate.current;
    const handleSort = () => {
        SO = new Quicksort(DisplayArray)
        setPhase(2);

    }

    const labels = labelsState.current;
    var message_indicator = 0;
    const handleNext = () => {
        switch(phase) {
            case 0:
                message_indicator = SO.check_base_case();
                setPhase(message_indicator)
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                if (message_indicator === 0) {
                    setExplain("Base case is checked, small sections (two elements or less) are solved using the trivial solution.");

                    if (!(SO.callstack.length === 0)) {
                        for (let i = 0; i < labels.length; i++) {
                            if ((i >= SO.callstack[SO.callstack.length - 1][0]) &&  (i <= SO.callstack[SO.callstack.length - 1][1])) {
                                labels[i] = '^';
                            }
                            else {
                                labels[i] = '';
                            }
                        }
                    }
                }
                else if (message_indicator === 1) {
                    setExplain("Base case is checked, sorting is now complete");
                    for (let i = 0; i < labels.length; i++) {
                        labels[i] = '';
                    }
                    setColors('aqua');
                }
                else if (message_indicator === 2) {
                    setExplain("Base case is checked, remainder of the elements will be sorted");
                    for (let i = 0; i < labels.length; i++) {
                        if ((i >= SO.callstack[SO.callstack.length - 1][0]) &&  (i <= SO.callstack[SO.callstack.length - 1][1])) {
                            labels[i] = '^';
                        }
                        else {
                            labels[i] = '';
                        }
                    }
                }
                break;
            case 1:
                break;
            case 2:

                if (SO.callstack.length === 0) {
                    break;
                }

                setPhase(SO.select_pivot());
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                setExplain("A pivot (yellow) is randomly selected");
                break;
            case 3:
                setPhase(SO.pivot_to_right());
                setDisplayArray(SO.array);
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                setExplain("The pivot is swappped with the right most element to get it out of the way");
                break;
            case 4:
                setPhase(SO.establish_pointers());
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                setExplain("Imagine two \"searchers\", the left searcher (lilac) looks for elements larger than the pivot, the right searcher (red) looks for elements smaller than the piviot");
                break;
            case 5:
                message_indicator = SO.find_misplaced_item_left()
                setPhase(message_indicator);
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                switch(message_indicator) {
                    case 5:
                        setExplain("Left searcher moved because its previous element was smaller than the pivot (If you can't see it that is because it is overlapped by the right searcher)");
                        break;
                    case 6:
                        setExplain("Left searcher stayed in place because its element is larger than the pivot");
                        break;
                    default:
                }
                break;
            case 6:
                message_indicator = SO.find_misplaced_item_right();
                setPhase(message_indicator);
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                setExplain("The right searcher will do a check, if its element is smaller than the pivot, it will stay, other wise it will move towards the left");
                if (message_indicator === 6) {
                    setExplain("The right searcher moved left because it's previous element was larger than the pivot");
                }
                else if (message_indicator === 7) {
                    setExplain("The right searcher stayed in place because it found an element that is smaller than the pivot");
                }
                else if (message_indicator === 8) {
                    setExplain("The right searcher stayed in place because it found an element that is smaller than the pivot");
                }
                break;
            case 7:
                setPhase(SO.swap_misplaced_items());
                setDisplayArray(SO.array);
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                setExplain("Both searchers swap elements. Though the elements are likely still in the wrong position, they will be in the right position relative to the pivot if the pivot is placed between them");
                break;
            case 8:
                setPhase(SO.return_pivot());
                setDisplayArray(SO.array);
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                setExplain("Because the searchers have crossed eachother, the pivot is swapped with the element of the left searcher, this places the pivot in the correct position relative to all other elements");
                break;
            case 9:
                setPhase(SO.add_to_callstack());
                setColors(newColorArray(SO.leftpointer, SO.rightpointer, SO.current_pivot_index));
                setExplain("The pivot is in the right spot, and all elements are in the correct side of the pivot, both sides of the pivot still need to be sorted, this will be done using the same method");
                break;
            default:
        }
    }

    const handleChange = (event) => {
        setNewElementState(Number(event.target.value));
    }

    const handleAddElement = (event) => {
        event.preventDefault();
        if (phase === 1) {
            setColors([...colors, 'aqua']);
            labelsState.current.push('');
            setDisplayArray([...DisplayArray, newElementState]);


            SO.insert_element(newElementState);
        }
    }

    //Chart
    
    const demoData = {
        labels,
        datasets: [
            {
            label: "Sample Sequence",
            data: DisplayArray,
            backgroundColor: colors,
            barPercentage: 0.98,
            categoryPercentage: 0.98
            }
        ]
    }
    const demoOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        }
    }

    //Reutrn Statement
    return(
        <StrictMode>
            <div className='SortInterface'>
                <div className="Chart">
                    <Bar data={demoData} options={demoOptions} />
                    <h className="Description">{explain}</h>
                </div>

                <div className='Menu'>
                    <button onClick={() => handleSort()}>Sort</button>
                    <button onClick={() => handleNext()}>Next</button>

                    <form onSubmit={handleAddElement}>
                        <label>
                            <input name='NewElement' type='number' onChange={handleChange} value={newElementState} min={0.1}></input>
                        </label>
                        <input type='submit' value='Add Element' ></input>
                    </form>
                </div>

            </div>
        </StrictMode>
    );
}

export default BinarySortDemo