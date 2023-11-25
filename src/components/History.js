import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../css/history.module.css';


function History() {
    const [data, setData] = useState([]);
    const uniqueInformation = [...new Set(data.map(datavalue => datavalue.information))];
    const uniqueBuilding = [...new Set(data.map(datavalue => datavalue.building))];
    const uniqueGroup = [...new Set(data.map(datavalue => datavalue.group))];
    const uniqueNumber = [...new Set(data.map(datavalue => datavalue.number))];
    const [selectedOption, setSelectedOption] = useState({
        Period: '',
        to: '',
        information: '',
        building: '',
        group: '',
        number: '',
    });
    const [userrole, setUserrole] = useState('');
    const token = localStorage.token;
    
    const getuser = async () => {
        try{
          const userresponse = await axios.post('http://localhost:3001/getuserdata',
          { token:token }, 
          {withCredentials: true});
  
          // console.log(userresponse.data.result[0]);
          if(userresponse.data.result.length > 0){
            setUserrole(userresponse.data.result[0].role);
          }
          else{
            alert("token time out!!!");
            localStorage.removeItem('token');
            window.location.href = '/';
          }
        }
        catch(err){
          console.log(err);
        }
    }

    const getData = async () => {
        try {
          let response;
          if (userrole === 'hotel_3') {
            response = await axios.get('http://localhost:3001/gethistoryh3');
          } else {
            response = await axios.get('http://localhost:3001/gethistory');
          }
          setData(response.data.result);
        } catch (err) {
          console.log(err);
        }
    };
    
    useEffect(() => {
        getuser();
      }, []);
      
    useEffect(() => {
        if (userrole) {
          getData();
        }
    }, [userrole]);

    const handleSelectinfoChange = (event) => {
        event.preventDefault();
        const selectedInformation = event.target.value;
        setSelectedOption((prevSelectedOption) => ({
            ...prevSelectedOption,
            information: selectedInformation,
        }));
    };

    const handleSelectbuildChange = (event) => {
        event.preventDefault();
        const selectedBuilding = event.target.value;
        setSelectedOption((prevSelectedOption) => ({
            ...prevSelectedOption,
            building: selectedBuilding,
        }));
    };

    const handleSelectgroupChange = (event) => {
        event.preventDefault();
        const selectedGroup = event.target.value;
        setSelectedOption((prevSelectedOption) => ({
            ...prevSelectedOption,
            group: selectedGroup,
        }));
    };

    const handleSelectnumChange = (event) => {
        event.preventDefault();
        const selectedNumber = event.target.value;
        setSelectedOption((prevSelectedOption) => ({
            ...prevSelectedOption,
            number: selectedNumber,
        }));
    };

    const formatTime = (timeString) => {
        const time = new Date(`1970-01-01T${timeString}`);
        return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const handleFilter = () => {
        // console.log(selectedOption)
        const filteredData = data.filter(datavalue => {
            const dateData = new Date(datavalue.date).toLocaleDateString('en-GB');
            const startDate = new Date(selectedOption.Period).toLocaleDateString('en-GB');
            const endDate = selectedOption.to ? new Date(selectedOption.to).toLocaleDateString('en-GB') : null;
    
            // Check conditions for Period
            const dateCondition = endDate ? dateData >= startDate && dateData <= endDate : dateData === startDate;
    
            // Check conditions for other attributes if they are not empty
            const informationCondition = selectedOption.information !== '' ? datavalue.information === selectedOption.information : true;
            const buildingCondition = selectedOption.building !== '' ? datavalue.building === selectedOption.building : true;
            const groupCondition = selectedOption.group !== '' ? datavalue.group === selectedOption.group : true;
            const numberCondition = selectedOption.number !== '' ? datavalue.number === selectedOption.number : true;
    
            // Return true only if all conditions are met
            return dateCondition && informationCondition && buildingCondition && groupCondition && numberCondition;
        });
    
        setData(filteredData);
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
          "Date,Time,Building,Group,Number,Information\n" +
          data.map(datavalue =>
            `${new Date(datavalue.date).toLocaleDateString('en-GB')},${formatTime(datavalue.time)},${datavalue.building},${datavalue.group},${datavalue.number},${datavalue.information}`
          ).join("\n");
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "history.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // console.log(selectedOption);
    // console.log(data);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const lastpage = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    
    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

  return (
    <div className={style.container}>
        <div className={style.header}>History</div>
        <div className={style.filter}>
            <div className={style.column}>
                <div className={style.date}>
                    Period:
                    <input
                        type='date'
                        value={selectedOption.Period}
                        onChange={(e) => {
                            const valuePeriod = e.target.value;
                            setSelectedOption((prevSelectedOption) => ({
                                ...prevSelectedOption,
                                Period: valuePeriod,
                            }));
                        }}
                    />
                    to
                    <input
                        type='date'
                        value={selectedOption.to}
                        onChange={(e) => {
                            const valueto = e.target.value;
                            setSelectedOption((prevSelectedOption) => ({
                                ...prevSelectedOption,
                                to: valueto,
                            }));
                        }}
                    />
                </div>
                <div className={style.info}>
                    Information:
                    <select value={selectedOption.information} onChange={handleSelectinfoChange}>
                        <option value="All">All</option>
                        {uniqueInformation.map((info, index) => (
                            <option key={index} value={info}>
                                {info}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={style.column}>
                <div className={style.build}>
                    Building:
                    <select value={selectedOption.building} onChange={handleSelectbuildChange}>
                        <option value="All">All</option>
                        {uniqueBuilding.map((build, index) => (
                            <option key={index} value={build}>
                                {build}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={style.group}>
                    Group:
                    <select value={selectedOption.group} onChange={handleSelectgroupChange}>
                        <option value="All">All</option>
                        {uniqueGroup.map((group, index) => (
                            <option key={index} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={style.number}>
                    Number:
                    <select value={selectedOption.number} onChange={handleSelectnumChange}>
                        <option value="All">All</option>
                        {uniqueNumber.map((num, index) => (
                            <option key={index} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={style.column}>
                <div className={style.btnfilter} onClick={() => handleFilter()}> Filter </div>
                <div className={style.btnexport} onClick={() => handleExport()}> Export </div>
            </div>
        </div>

        <div className={style.datatable}>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Building</th>
                        <th>Group</th>
                        <th>Number</th>
                        <th>Information</th>
                    </tr>
                </thead>

                <tbody>
                {currentItems.map((datavalue, index) => (
                    <tr key={index}>
                        <td>{new Date(datavalue.date).toLocaleDateString('en-GB')}</td>
                        <td>{formatTime(datavalue.time)}</td>
                        <td>{datavalue.building}</td>
                        <td>{datavalue.group}</td>
                        <td>{datavalue.number}</td>
                        <td>{datavalue.information}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

        <div className={style.pagination}>
            <button 
                onClick={handlePreviousPage} 
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span>{currentPage}/{lastpage}</span>
            <button 
                onClick={handleNextPage} 
                disabled={indexOfLastItem >= data.length}
            >
                Next
            </button>
        </div>
    </div>
  )
}

export default History