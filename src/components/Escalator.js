import React, { useEffect, useState } from 'react';
import style from '../css/escalator.module.css';
import axios from 'axios';

function Escalator() {
  const [data, setData] = useState([]);
  const [encoderdata, setEncoderdata] = useState([]);
  const [groupa, setGroupa] = useState([]);
  const [groupb, setGroupb] = useState([]);
  const [groupc, setGroupc] = useState([]);
  const [detectedgroupA, setDetectedgroupA] = useState([]);
  const [detectedgroupB, setDetectedgroupB] = useState([]);
  const [detectedgroupC, setDetectedgroupC] = useState([]);

  const getData = async () =>{
    try{
        const response = await axios.get('http://localhost:3001/getbuilding');
        const encoderesponse = await axios.get('http://localhost:3001/getencoderInput');
        setData(response.data.result);
        // console.log(encoderesponse.data.result);
        setEncoderdata(encoderesponse.data.result);
    }
    catch(err){
        console.log(err);
    }
  }

  useEffect(() => {
    getData();
  },[]);

  useEffect(() => {
    const groupAData = encoderdata.filter((item) => item.ip.endsWith('A'));
    setGroupa(groupAData);
    const highestNoMapA = new Map();

    for (let a = 0; a < groupAData.length; a++) {
      const key = `${groupAData[a].building}_${groupAData[a].floor}`;
      if (!highestNoMapA.has(key) || groupAData[a].no > highestNoMapA.get(key).no) {
        highestNoMapA.set(key, groupAData[a]);
      }
    }
    setDetectedgroupA(Array.from(highestNoMapA.values()));
    
    const groupBData = encoderdata.filter((item) => item.ip.endsWith('B'));
    setGroupb(groupBData);
    const highestNoMapB = new Map();

    for (let a = 0; a < groupBData.length; a++) {
      const key = `${groupBData[a].building}_${groupBData[a].floor}`;
      if (!highestNoMapB.has(key) || groupBData[a].no > highestNoMapB.get(key).no) {
        highestNoMapB.set(key, groupBData[a]);
      }
    }
    setDetectedgroupB(Array.from(highestNoMapB.values()));

    const groupCData = encoderdata.filter((item) => item.ip.endsWith('C'));  
    setGroupc(groupCData);
    const highestNoMapC = new Map();

    for (let a = 0; a < groupCData.length; a++) {
      const key = `${groupCData[a].building}_${groupCData[a].floor}`;
      if (!highestNoMapC.has(key) || groupCData[a].no > highestNoMapC.get(key).no) {
        highestNoMapC.set(key, groupCData[a]);
      }
    }
    setDetectedgroupC(Array.from(highestNoMapC.values()));
  }, [encoderdata]);

  const [togglebuildingsensor, setToglebuildingsensor] = useState(false);
  const [buildingsensor, setBuildingsensor] = useState([]);
  const [buildingtitle, setBuildingtitle] = useState('');
  
  const handlebuildingsensor = async (building) => {
    try {
      const response = await axios.post('http://localhost:3001/getbuildingsensor', { building: building });
  
      const uniqueBuildingsensorMap = new Map();
  

      response.data.result.forEach((item) => {
        const key = `${item.building}_${item.number}`;
  
        if (!uniqueBuildingsensorMap.has(key) || item.no > uniqueBuildingsensorMap.get(key).no) {
          uniqueBuildingsensorMap.set(key, item);
        }
      });

      const newBuildingsensor = Array.from(uniqueBuildingsensorMap.values());
  
      setBuildingtitle(building);
      setBuildingsensor(newBuildingsensor);
    } catch (err) {
      console.log(err);
    }

    setToglebuildingsensor(true);
  }

  const handleClosebuildingsensor = () => {
    setToglebuildingsensor(false);
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.header}>Escalator System</div>
        <div className={style.datatable}>
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Floor</th>
                <th>GroupA</th>
                <th>GroupB</th>
                <th>GroupC</th>
              </tr>
            </thead>

            <tbody>
            {data.map((value, index, array) => {
              const buildingCount = array.filter(
                (item) => item.building === value.building
              ).length;

              const floorCount = array.filter(
                (item) => item.building === value.building && item.floor === value.floor
              ).length;

              // Find matching groupA,B,C for the current building and floor
              const matchinggroupA = detectedgroupA.find(
                (item) => item.building === value.building && item.floor === value.floor
              );
              const matchinggroupB = detectedgroupB.find(
                (item) => item.building === value.building && item.floor === value.floor
              );
              const matchinggroupC = detectedgroupC.find(
                (item) => item.building === value.building && item.floor === value.floor
              );

              return (
                <tr key={index}>
                  {index === 0 || value.building !== array[index - 1].building ? (
                    <th 
                      rowSpan={buildingCount} 
                      onClick={() => handlebuildingsensor(value.building)}
                      className={style.buildingcolumn}
                    >
                      {value.building}
                      </th>
                  ) : null}
                  {index === 0 || value.floor !== array[index - 1].floor ? (
                    <React.Fragment>
                      <th rowSpan={floorCount}>{value.floor}</th>
                      <td className={style.tablevalue} rowSpan={floorCount}>
                        {matchinggroupA ? 'IP: '+matchinggroupA.ip : ''}<br/>
                        {matchinggroupA ? 'DIR: '+matchinggroupA.dir : ''}<br/>
                        {matchinggroupA ? 'STATUS: '+matchinggroupA.status : ''}
                      </td>
                      <td className={style.tablevalue} rowSpan={floorCount}>
                        {matchinggroupB ? 'IP: '+matchinggroupB.ip : ''}<br/>
                        {matchinggroupB ? 'DIR: '+matchinggroupB.dir : ''}<br/>
                        {matchinggroupB ? 'STATUS: '+matchinggroupB.status : ''}
                      </td>
                      <td className={style.tablevalue} rowSpan={floorCount}>
                        {matchinggroupC ? 'IP: '+matchinggroupC.ip : ''}<br/>
                        {matchinggroupC ? 'DIR: '+matchinggroupC.dir : ''}<br/>
                        {matchinggroupC ? 'STATUS: '+matchinggroupC.status : ''}
                      </td>
                    </React.Fragment>
                  ) : null}
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
      { togglebuildingsensor &&(
        <div className={style.buildingdetails}>
          <div className={style.btnclose} onClick={() => handleClosebuildingsensor()}>X</div>
          <div className={style.buildingtable}>
            <table>
              <thead>
                <tr>
                  <th colSpan={buildingsensor.length}>{buildingtitle}</th>
                </tr>
                <tr>
                  {buildingsensor.map((value, index) => (
                    <th key={index} className={style.sensornumber}>
                      {value.number}
                    </th>
                  ))}
                </tr>
                <tr>
                  {buildingsensor.map((value, index) => (
                    <th key={index} 
                    className={`${value.status === 'NORM' ? style.sensorstatusNORM : ''}
                    ${value.status === 'ERR' ? style.sensorstatusERR : ''}
                    ${value.status === 'COMM' ? style.sensorstatusCOMM : ''}
                    ${value.status === 'STOP' ? style.sensorstatusSTOP : ''}`}
                    >
                      {value.status}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Escalator