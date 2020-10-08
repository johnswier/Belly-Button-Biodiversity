// Read in data using d3  
d3.json("./data/samples.json").then((data) => {
    // print dataset for reference 
    console.log(data);
    
    // collect metadata info
    metaData = data.metadata;
    
    // collect ID's
    idList = data.names;
    
    // collect samples
    samples = data.samples;
    
    // Loop through ID's and add each one to dropdown menu
    for (let i = 0; i < idList.length; i++) {
        dropdownMenu = d3.select("#selDataset");
        dropdownMenu.append("option").text(idList[i]);
    };
});
// create GLOBAL variable to hold demographic info card HTML element
demoCard = d3.select("#sample-metadata");

// create GLOBAL variable to hold dropdown menu HTML element 
dropdownMenu = d3.select("#selDataset");

//create variable to hold bar chart HTML element
barChart = d3.select("#bar");

// create function to handle the user selected ID and display appropriate plots
function updatePlots() {
    // clear demographics data and plots each time new ID is selected
    demoCard.html("");
    barChart.html("");
    
    // create select variable on each ID's key-value pairs within dropdown menu
    key = d3.select(this).property('id');
    value = d3.select(this).property('value');
    
    // filter demographic info by whichever ID is selected
    filteredDemo = metaData.filter(obj => obj.id== value);
    
    // filter barchart 
    filteredBar = samples.filter(x => x.id == value);
    console.log(filteredBar[0].otu_ids.slice(0,10));
    
    // extract filtered demographic info and update HTML element
    Object.entries(filteredDemo[0]).forEach(([k,v]) => {
        demoCard.append("h6").text(`${k}: ${v}`);
        });
    
    // extract filtered barchart values and update plot
    var barData = [{
        x: [filteredBar[0].sample_values.slice(0,10)],
        y: [filteredBar[0].otu_ids.slice(0, 10)],
        text: filteredBar[0].otu_labels.slice(0,10),
        type: "bar"
    }];
    
    Plotly.restyle("bar", barData);
};

// event listener for dropdown menu 
dropdownMenu.on("change", updatePlots);

// display default bar chart
function init() {
    var data = [{
        x: samples[0].sample_values.slice(0, 10),
        y: samples[0].otu_ids.slice(0, 10),
        text: samples[0].otu_labels.slice(0,10),
        type: "bar"
    }];
Plotly.newPlot("bar", data);
};

// event listener for when page loads -- run the init function to display default plot
window.addEventListener('load', (event) => {
    init();
});