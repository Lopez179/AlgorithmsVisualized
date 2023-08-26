import {React, useState} from "react";
import {Chart as ChartJS, LinearScale, PointElement, LineElement} from 'chart.js';
import {Scatter} from 'react-chartjs-2';
import {Matrix} from 'ml-matrix';
import LogisticRegression from 'ml-logistic-regression';

function several_points(left_bound, right_bound,resolution) {
    const section = (right_bound - left_bound)/resolution;
    const points = [];
    for (let i = left_bound; i < right_bound; i+=section) {
        points.push(i);
    }
    return [...points, right_bound];
}

ChartJS.register(LinearScale, PointElement, LineElement);

function LogisticRegressionDemo() {
    
    const [samplePoints, setSamplePoints] = useState([{x:-3,y:1},{x:-2,y:1},{x:-0.2, y:1},{x:0.5,y:1}, {x:-1, y:1}, {x:1, y:0}, {x:0, y:0}, {x:3, y:0}, {x:4, y:0}]);
    const [newPoint, setNewPoint] = useState({x:0, y:0});
    const [predictx, setPredictX] = useState(samplePoints[0].x);
    
    //Model
    const x_values = samplePoints.map((point) => [point.x]);
    const x_values_not_matrix = samplePoints.map((point) => point.x);

    const y_values = samplePoints.map((point) => point.y);
    
    const X = new Matrix(x_values);
    const Y = Matrix.columnVector(y_values);

    const LogRegModel = new LogisticRegression({ numSteps: 1000, learningRate: 5e-3 });
    LogRegModel.train(X, Y);

    const model_x_values = several_points(Math.min(...x_values_not_matrix), Math.max(...x_values_not_matrix), 50);
    const x_values_matrix = new Matrix(model_x_values.map((value) => [value]));

    const score0 = LogRegModel.classifiers[0].testScores(x_values_matrix);


    //Chart
    var sampleData = {
        datasets: [
            {
                label: 'Prediction',
                data: [{x: predictx, y:LogRegModel.classifiers[0].testScores(new Matrix([[predictx]]))}, {x: predictx, y:LogRegModel.predict(new Matrix([[predictx]]))}],
                showLine: true,
                backgroundColor: 'black',
                pointRadius: 6,
                pointHoverRadius: 6
            },
            {
                label: 'Sample Data',
                data: samplePoints,
                backgroundColor: 'aqua',
                pointRadius: 5,
                pointHoverRadius: 7
            },
            {
                label: 'Model',
                pointRadius: 0,
                showLine: true,
                borderColor: '#008484',
                data: model_x_values.map((xvalue, i) => {return {x:xvalue, y:score0[i]}}),
            }
        ]
    }

    var sampleOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Dependent Variable (Boolean)',
                    color: 'black',
                    font: {
                        size: 20
                    }
                },
                ticks: {
                    display: true,
                    beginAtZero: true,
                    stepSize: 1
                },
                min: -0.2,
                max: 1.2
            },

            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Independent Variable',
                    color: 'black',
                    font: {
                        size: 20
                    }
                },
                min: Math.min(...x_values_not_matrix),
                max: Math.max(...x_values_not_matrix)
            },
        },

        maintainAspectRatio: false
    };

    

    



    //Menu
    const handleChangePredictX = (event) => {
        setPredictX(Number(event.target.value));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let newPointsArray = [...samplePoints, newPoint];
        console.log(samplePoints)
        console.log(newPointsArray)
        setSamplePoints(newPointsArray);
    }

    const handleChangeX = (event) => {
        setNewPoint({x:Number(event.target.value), y:Number(newPoint.y)})
    }

    const handleChangeY = (event) => {
        setNewPoint({x:Number(newPoint.x), y:Number(event.target.value)})
    }

    const handleRemovePoint = () => {
        const newarray = [...samplePoints];
        newarray.pop()
        setSamplePoints(newarray);
    }


    //Return Statement
    return (
            <div className="RegInterface">
                <div className="ChartDisplay">
                    <Scatter options={sampleOptions} data={sampleData} />
                </div>


                <div className="Menu">
                    <h>Predict</h>
                    <form className="Predict">
                        <label>
                            Independent Variable:
                            <input name="x_coord_predict" type="number" value={predictx} onChange={handleChangePredictX}></input>
                        </label>

                    </form>

                    <div className="Predict">
                        <p>Probability: {LogRegModel.classifiers[0].testScores(new Matrix([[predictx]]))}</p>
                        <p>Prediction: {LogRegModel.predict(new Matrix([[predictx]]))}</p>
                    </div>

                    <h>Dataset</h>
                    <form onSubmit={handleSubmit}>
                        <label>( 
                            <input name="x_coord" type="number" value={newPoint.x} size={7} onChange={handleChangeX} className="menuxcoord"></input>
                        </label>
                        
                        <label id="label"> 
                            ,<input name="y_coord" type="number" value={newPoint.y} size={7} onChange={handleChangeY} className="menuycoord" max={1} min={0}></input>)
                        </label>

                        <input type="submit" value="Add Data Point"/>
                    </form>

                    <button onClick={handleRemovePoint}>Remove Last Data Point</button>
                    

                </div>
            </div>


    );
}


export default LogisticRegressionDemo;