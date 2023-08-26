import {React, useState} from "react";
import {Chart as ChartJS, LinearScale, PointElement, LineElement} from 'chart.js';
import {Scatter} from 'react-chartjs-2';
import SimpleLinearRegression from "ml-regression-simple-linear";

ChartJS.register(LinearScale, PointElement, LineElement);

function LinearRegressionDemo() {
    
    const [samplePoints, setSamplePoints] = useState([ {x:1, y:3}, {x:2, y:3}, {x:2, y:5}, {x:2,y:6},{x:3,y:5}, {x:3, y:6}, {x:3, y:7}, {x:4, y:6}, {x:4, y:9}, {x:5,y:6}, {x: 5, y:8}, {x:5, y:9}, {x:6, y:10}, {x:6, y:8}, {x:6,y:9}, {x:7,y:11}]);
    const [newPoint, setNewPoint] = useState({x:0, y:0});
    const [predictx, setPredictX] = useState(samplePoints[0].x);
    
    //Model
    var x_values = samplePoints.map((point) => point.x);
    var y_values = samplePoints.map((point) => point.y);
    const LinRegModel = new SimpleLinearRegression(x_values, y_values);
    var left_most_x = Math.min(...x_values);
    var right_most_x = Math.max(...x_values);

    //Chart
    var sampleData = {
        datasets: [
            {
                label: 'Model Prediction',
                data :[{x:predictx, y:LinRegModel.predict(predictx)}],
                pointRadius: 6,
                backgroundColor: 'black',
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
                data: [{x:predictx, y:LinRegModel.predict(predictx)} ,{x:left_most_x, y:LinRegModel.predict(left_most_x)}, {x:right_most_x,y:LinRegModel.predict(right_most_x)}],
                pointRadius: 0,
                pointHoverRadius: 0,
                showLine: true,
                borderColor: '#008484'
            },
            
        ]
    }

    var sampleOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Dependent Variable',
                    color: 'black',
                    font: {
                        size: 20
                    }
                }

                
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
                }
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

                    <p className="Predict">
                        Prediction: {LinRegModel.predict(predictx)}
                    </p>

                    <h>Dataset</h>
                    <form onSubmit={handleSubmit}>
                        <label>( 
                            <input name="x_coord" type="number" value={newPoint.x} size={7} onChange={handleChangeX} className="menuxcoord"></input>
                        </label>
                        
                        <label id="label"> 
                            ,<input name="y_coord" type="number" value={newPoint.y} size={7} onChange={handleChangeY} className="menuycoord"></input>)
                        </label>

                        <input type="submit" value="Add Data Point"/>    
                    </form>

                    <button onClick={handleRemovePoint}>Remove Last Data Point</button>
                </div>
            </div>


    );
}



export default LinearRegressionDemo;