import {React, useState} from "react";
import {Chart as ChartJS, LinearScale, PointElement, LineElement} from 'chart.js';
import {Scatter} from 'react-chartjs-2';
import KNN from 'ml-knn';

ChartJS.register(LinearScale, PointElement, LineElement);

function KNNDemo() {
    
    const [samplePoints, setSamplePoints] = useState([{x:-3 ,y:1, z:0},{x:-2, y:2, z:0},{x:-0.2, y:3, z:0}, {x:3, y:-1, z:1}, {x:4, y:-0.5, z:1}, {x:3.5, y:0,z:1}, {x:-0.5,y:1.5,z:0}, {x:2, y:0.5, z:1}, {x:4, y:1, z:1}, {x:3,y:1,z:1}]);
    const [newPoint, setNewPoint] = useState({x:0, y:0, z:0});
    const [predictPoint, setPredictPoint] = useState({x:0,y:0,z:0});
    const [K, setK] = useState(3);
    
    //Model
    var datasetXY = samplePoints.map((point) => [point.x, point.y]);
    var datasetZ = samplePoints.map((point) => point.z);
    var KNNModel = new KNN(datasetXY, datasetZ, {k: K});

    //Chart
    const pointsAtState0 = [];
    const pointsAtState1 = [];

    for (let i = 0; i < samplePoints.length; i++) {
        if (samplePoints[i].z === 0) {
            pointsAtState0.push(samplePoints[i]);
        }
        if (samplePoints[i].z === 1) {
            pointsAtState1.push(samplePoints[i]);
        }
    }

    const prediction_color = () => {
        if (predictPoint.z === 0)
        {
            return "#FF4040";
        }
        if (predictPoint.z === 1) {
            return "#4080FF";
        }
    }
    
    if (predictPoint.z === 0)
    {
        var Z_style_class = "Z0";
        
    }
    if (predictPoint.z === 1) {
        var Z_style_class = "Z1";
    }

    
    


    var sampleData = {
        datasets: [
            {
                label: 'Prediction',
                data: [{x:predictPoint.x, y:predictPoint.y}],
                showLine: true,
                pointStyle: 'cross',
                borderColor: prediction_color,
                borderWidth: 4,
                hoverBorderWidth: 4,
                pointRadius: 8,
                pointHoverRadius: 8
            },
            {
                label: 'Dependent Variable State 0',
                data: pointsAtState0,
                backgroundColor: '#FF4040',
                pointRadius: 5,
                pointHoverRadius: 7
            },
            {
                label: 'Dependent Variable State 1',
                data: pointsAtState1,
                backgroundColor: '#4080FF',
                pointRadius: 5,
                pointHoverRadius: 7
            },
        ]
    }



    var sampleOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Independent Variable 2',
                    color: 'black',
                    font: {
                        size: 20
                    }
                },
            },

            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Independent Variable 1',
                    color: 'black',
                    font: {
                        size: 20
                    }
                },
            },
        },

        maintainAspectRatio: false
    };

    
    //Menu

    const handleSubmit = (event) => {
        event.preventDefault();
        let newPointsArray = [...samplePoints, newPoint];
        console.log(samplePoints)
        console.log(newPointsArray)
        setSamplePoints(newPointsArray);
    }

    const handleChangeX = (event) => {
        setNewPoint({x:Number(event.target.value), y:Number(newPoint.y), z:Number(newPoint.z)})
    }

    const handleChangeY = (event) => {
        setNewPoint({x:Number(newPoint.x), y:Number(event.target.value), z:Number(newPoint.z)})
    }

    const handleChangeZ = (event) => {
        setNewPoint({x:Number(newPoint.x), y:Number(newPoint.y), z:Number(event.target.value)})
    }

    const handleChangePredictX = (event) => {
        setPredictPoint({x:Number(event.target.value), y:Number(predictPoint.y), z:KNNModel.predict([[Number(event.target.value), predictPoint.y]])[0]})

    }

    const handleChangePredictY = (event) => {
        setPredictPoint({x:Number(predictPoint.x), y:Number(event.target.value), z:KNNModel.predict([[predictPoint.x, Number(event.target.value)]])[0]})
    }

    const handleRemovePoint = () => {
        const newarray = [...samplePoints];
        newarray.pop()
        setSamplePoints(newarray);
    }

    const handleChangeK = (event) => {
        setK(event.target.value)
    }

    //Return Statement
    return (
            <div className="RegInterface">

                <div className="ChartDisplay">
                    <Scatter options={sampleOptions} data={sampleData} />
                </div>


                <div className="Menu">

                    <h className="MenuSubsection"> Predict
                        <form>
                            <label>
                                K: <input type="number" size={7} value={K} onChange={handleChangeK}></input>
                            </label>
                        </form>

                        <form>
                            (<label>
                                <input name="predict_x_coord" type="number" size={7} value={predictPoint.x} onChange={handleChangePredictX}></input>,
                            </label>

                            <label>
                                <input name="predict_y_coord" type="number" size={7} value={predictPoint.y} onChange={handleChangePredictY}></input>
                            </label>,
                            
                            <h className={Z_style_class}>{predictPoint.z}</h>)
                        </form>
                    </h>

                    <h className="MenuSubsection"> Dataset 
                        <form onSubmit={handleSubmit}>
                            <label>( 
                                <input name="x_coord" type="number" value={newPoint.x} size={5} onChange={handleChangeX}></input>
                            </label>
                            
                            <label id="label"> 
                                ,<input name="y_coord" type="number" value={newPoint.y} size={5} onChange={handleChangeY}></input>
                            </label>

                            <label>
                                ,<input input name="z_coord" type="number" value={newPoint.z} size={5} onChange={handleChangeZ}></input>)
                            </label>

                            <input type="submit" value="Add Data Point"/>

                        </form>

                        <button onClick={handleRemovePoint}>Remove Last Data Point</button>
                    </h>

                </div>
            </div>


    );
}

export default KNNDemo;