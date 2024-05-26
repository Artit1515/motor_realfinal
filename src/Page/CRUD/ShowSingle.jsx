import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../../component/NavigationBar/NavigationBar.jsx";
import { BarChartComponent, LineChartComponent, PieChartComponent,Linecharttemp } from "./Graph.jsx";
import { getMotorData, getMotorInfo, getLastData } from "../../component/APIs/ApiComponent.jsx";
import { addMotorDataById } from "../../slicers/userSlice.js";
import { useSelector, useDispatch } from "react-redux";
import './Graph.css';
import Swal from "sweetalert2";

const MotorDetail = () => {
  const [motorData, setMotorData] = useState([]);
  const [dataTable, setTable] = useState([]);
  const [motorInfo, setMotorInfo] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Update the parameter name to 'id'
  // const motorData = useSelector(state => state.user.motorData[id]);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useEffect called");
    async function fetchData(){
      try{
        // const data = await getMotorData(id);
        // setMotorData(data.data);
        const info = await getMotorInfo(id);
        setMotorInfo(info);
        getData();
      }catch(err){
        console.log(err);
      }
    }
    if (id) { // Update the condition to check for 'id'
      fetchData()
    } else {
      console.log("Motor ID not provided");
      setError("Motor ID not provided");
    }
  }, [id]); // Update the dependency to 'id'

  
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 7);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  async function getData(){
    try{
      const data = await getLastData(id);
      const timestamp = formatTimestamp(data.data.timestamp);
      data.data.timestamp = timestamp;
      setMotorData((prevData) => {
        const newData = [...prevData, data.data];
        if(newData.length > 100){ // Max length = 10 and FIFO
          const updateData = newData.slice(-10);
          return updateData;
        }
        
        return newData;
      });
      console.log(data)
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    const reversed = [...motorData].reverse();
    setTable(reversed);
  }, [motorData]);

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
      console.log("getData is working...", motorData);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  if (error) {
    return <p>Error: {error}</p>;
  }

  // if (motorData.length === 0) {
  //   return <p>No motor data available.</p>;
  // }

  return (
    <div className="graph-container">
      <NavigationBar />
      <div className="graph-page-text-header">
        <h2>Motor Name: {motorInfo.motor_name}</h2> 
        <h2>ID: {motorInfo.motor_id}</h2>
      </div>
      <div className="dashboard">
        <div className="dashboard-row">
          <Linecharttemp className="chart" data={motorData} dataKey="temperature" />
          <PieChartComponent className="chart" data={motorData} dataKey="temperature" />
          <LineChartComponent className="chart vibration" data={motorData} dataKey="vibration" />
        </div>
        <div className="dashboard-row">
          <BarChartComponent className="chart" data={motorData} dataKey="current" color="#F78F3F" />
          <BarChartComponent className="chart" data={motorData} dataKey="voltage"color="#BE32A8" />
        </div>
      </div>
      <div className="table-text-header">
        <h1>Data Log</h1>
      </div>
      <table className="monitor-table">
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Vibration</th>
            <th>Voltage</th>
            <th>Current</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {dataTable ? dataTable.map((sensor, index) => (
            <tr key={index}>
              <td>{sensor.temperature}</td>
              <td>{sensor.vibration}</td>
              <td>{sensor.voltage}</td>
              <td>{sensor.current}</td>
              <td>{sensor.timestamp}</td>
            </tr>
          )): null}
        </tbody>
      </table>
    </div>
  );
};

export default MotorDetail;
