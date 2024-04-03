import React from 'react';
import { PieChart, Pie, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar ,Cell,Label, LabelList,Text} from 'recharts';
export function PieChartComponent({ data, dataKey, maxValue = 120 }) {
    const lastDataValue = data.length > 0 ? data[data.length - 1][dataKey] : 0;
    const maxAngle = 180; // Maximum angle for the gauge (180 degrees)
    const endAngle = lastDataValue > maxValue ? 0 : 180 - (lastDataValue / maxValue) * maxAngle;
    const gaugeColor = lastDataValue > 70 ? "#ff0000" : "#008000"; // Red if data > 70, green if data <= 70
    let pieData = [{ [dataKey]: lastDataValue }];
    const unit = dataKey === 'temperature' ? '°C' : 'RPM';
  
    if (lastDataValue < maxValue) {
      pieData.push({ [dataKey]: maxValue - lastDataValue });
    }
  
    const renderCustomizedLabel = () => {
      return (
        <div className='pie-data'>
          {lastDataValue === 0 ? `No ${dataKey} data` : `${lastDataValue} ${unit}`}
        </div>
      );
    };
  
    return (
      <div className="chart-radial-gauge">
        <PieChart width={400} height={400}>
          <Pie
            dataKey={dataKey}
            data={pieData}
            cx={200}
            cy={200}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
          >
            <Cell fill={gaugeColor} />
            {lastDataValue < maxValue && <Cell fill="#808080" />}
          </Pie>
          <Tooltip />
        </PieChart>
        {renderCustomizedLabel()}
      </div>
    );
  }
  
export function LineChartComponent({ data, dataKey }) {
    return (
        <div className="line-chart">
        <LineChart width={500} height={300} data={data.slice(-5)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="5 2" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
        </div>
    );
}

export function BarChartComponent({ data, dataKey }) {
    const lastData = data.slice(-1);

    return (
        <div className="chart-bar-chart">
        <BarChart
            width={500}
            height={300}
            layout="vertical"
            data={lastData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 120]} />
            <YAxis dataKey="time" type="category" />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#8884d8" name={dataKey} />
            <Legend verticalAlign="middle" align="left" layout="vertical" />
        </BarChart>
        </div>
    );
}