const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

/*  data array .
value follow index format : 
 building: "O1B"
 date: "2000-01-01T17:00:00.000Z"
 group: "A"
 id: 0
 information: "infor"
 number: "Encoder box number"
 time: "00:00:00"   */

const handleExport = (data) => {
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

export { handleExport };