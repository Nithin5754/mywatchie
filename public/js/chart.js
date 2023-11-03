//L ast 7day chart
const LastWeekChartOrder=document.getElementById('myChart-1')
const LastWeekChartRevenue=document.getElementById('myChart-2')

// last 30 day chART

const LastThirtyChartOrder=document.getElementById('myChart-3')
const LastThirtyChartRevenue=document.getElementById('myChart-4')





// last12 month th chART

const lastTwelveMonthOrder=document.getElementById('myChart-5')
const lastTwelveMonthRevenue=document.getElementById('myChart-6')




// last12 month th chART

const hourlyOrder=document.getElementById('myChart-7')
const hourlyRevenue=document.getElementById('myChart-8')








// last 7 days (one week ) order report and revenue report generated



//order report





async function fetchSevenData() {
  try {
    const response = await fetch('/adminChart/sevenDayChart');
    const data = await response.json();

    if(data){
    console.log(data.dailyData,":it ok");

    const xValues =['','','','','','','',]; 
const yValues =[0,0,0,0,0,0,0];  
const barColors = ["red", "green","blue","orange","brown"];
data.dailyData.map((item,index)=>yValues[index]=item.totalPrice)

data.dailyData.map((item,index)=>xValues[index]=item.date)
console.log(xValues,"my last week date");
console.log(yValues,"my total price");
new Chart(LastWeekChartOrder, {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label:'last 7 days revenue',
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Monthly Sales Data"
    }
  }
});




// TOTAL ORDERS 



var xValuesOrders = ['','','','','','','',];
var yValuesOrders = [0,0,0,0,0,0,0];
data.dailyData.map((item,index)=>xValuesOrders[index]=item.date)

data.dailyData.map((item,index)=>yValuesOrders[index]=item.count)



new Chart(LastWeekChartRevenue, {
  type: "bar",
  data: {
    labels: xValuesOrders,
    datasets: [{
      label:"no of orders (per day) last 7 days",
      backgroundColor: barColors,
      data: yValuesOrders
    }]
  },
  options: {

    legend: {display: false},
    title: {
      display: true,
      text: "World Wine Production 2018"
    }
  }
});


   



    }

    // Extract data from the JSON response
   
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchSevenData();







//FETCH THIRTY DAYS LAST



async function fetchThirtyData() {
  try {
    const response = await fetch('/adminChart/thirtyDayChart');
    const data = await response.json();

    if(data){
    console.log(data.dailyData,":it ok");

const xValues = [];
const yValues =[];
const barColors = ["red", "green","blue","orange","brown"];
 data.dailyData.forEach((item) => {
  yValues.push(item.totalPrice);
  xValues.push(item.date)
  
 });
console.log(xValues,"my last week date");
console.log(yValues,"my total price");
new Chart(LastThirtyChartOrder, {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label:'revenue last 30 days',
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Monthly Sales Data"
    }
  }
});




// TOTAL ORDERS 



// Initialize arrays without empty values
var xValuesOrders = [];
var yValuesOrders = [];

// Map the data from data.dailyData
data.dailyData.forEach((item) => {
  xValuesOrders.push(item.date);
  yValuesOrders.push(item.count);
});




new Chart(LastThirtyChartRevenue, {
  type: "bar",
  data: {
    labels: xValuesOrders,
    datasets: [{
      label:"no of orders (per day) lst 30 days",
      backgroundColor: barColors,
      data: yValuesOrders
    }]
  },
  options: {

    legend: {display: false},
    title: {
      display: true,
      text: "World Wine Production 2018"
    }
  }
});


   



    }

    // Extract data from the JSON response
   
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}





fetchThirtyData()







async function  twelveMonthData() {
  try {
    const response = await fetch('/adminChart/lastTwelveMonth');
    const data = await response.json();

    if(data){
    console.log(data.dailyData,":it ok");

const xValues = [];
const yValues =[];
const barColors = ["red", "green","blue","orange","brown"];
 data.dailyData.forEach((item) => {
  yValues.push(item.totalPrice);
  xValues.push(item.date)
  
 });
console.log(xValues,"my last week date");
console.log(yValues,"my total price");
new Chart(lastTwelveMonthOrder, {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label:'revenue last 12 month',
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Monthly Sales Data"
    }
  }
});




// TOTAL ORDERS 



// Initialize arrays without empty values
var xValuesOrders = [];
var yValuesOrders = [];

// Map the data from data.dailyData
data.dailyData.forEach((item) => {
  xValuesOrders.push(item.date);
  yValuesOrders.push(item.count);
});




new Chart(lastTwelveMonthRevenue, {
  type: "bar",
  data: {
    labels: xValuesOrders,
    datasets: [{
      label:"last 12 month no of orders",
      backgroundColor: barColors,
      data: yValuesOrders
    }]
  },
  options: {

    legend: {display: false},
    title: {
      display: true,
      text: "World Wine Production 2018"
    }
  }
});


   



    }

    // Extract data from the JSON response
   
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}




twelveMonthData()







//hourly data


async function  HourlyOrdersData() {
  try {
    const response = await fetch('/adminChart/lastHourlyData');
    const data = await response.json();

    if(data){
    console.log(data.dailyData,":it ok");

const xValues = [];
const yValues =[];
const barColors = ["red", "green","blue","orange","brown"];
 data.HourlyData.forEach((item) => {
  yValues.push(item.totalPrice);
  xValues.push(item.date)
  
 });
console.log(xValues,"my last week date");
console.log(yValues,"my total price");
new Chart(hourlyOrder, {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label:'revenue last Hour',
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Monthly Sales Data"
    }
  }
});




// TOTAL ORDERS 



// Initialize arrays without empty values
var xValuesOrders = [];
var yValuesOrders = [];

// Map the data from data.dailyData
data.HourlyData.forEach((item) => {
  xValuesOrders.push(item.date);
  yValuesOrders.push(item.count);
});




new Chart(hourlyRevenue, {
  type: "bar",
  data: {
    labels: xValuesOrders,
    datasets: [{
      label:"last Hour no of orders",
      backgroundColor: barColors,
      data: yValuesOrders
    }]
  },
  options: {

    legend: {display: false},
    title: {
      display: true,
      text: "World Wine Production 2018"
    }
  }
});

    }

    // Extract data from the JSON response
   
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

HourlyOrdersData()







const service=document.querySelector('.services')
const btns=document.querySelectorAll('.service-btn')
const hideSections=document.querySelectorAll('.hiddenSection-box')


service.addEventListener('click',(e)=>{
  const id=e.target.dataset.id

if(id){
  btns.forEach((btn)=>{
    btn.classList.remove('live')
  })
 e.target.classList.add('live')


 hideSections.forEach((hideSection)=>{
  hideSection.classList.remove('live')
 })

 const element= document.getElementById(id);
 element.classList.add('live')

}

})


