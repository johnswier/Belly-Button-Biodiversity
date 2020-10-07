// Read in data using d3  
d3.json("./data/samples.json").then(data => {
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
// display default bar chart
function init() {
    var data = [{
        x: samples[0].sample_values,
        y: samples[0].otu_ids,
        type: "bar"
    }];
    Plotly.newPlot("bar", data);
}

// create GLOBAL variable to hold demographic info card HTML element
demoCard = d3.select("#sample-metadata");

// create GLOBAL variable to hold dropdown menu HTML element 
dropdownMenu = d3.select("#selDataset");

// create function to handle the user selected ID from demo info card
function handleClick() {
    // clear card each time new ID is selected
    demoCard.html("");
    
    // create select variable on each ID's key-value pairs within dropdown menu
    key = d3.select(this).property('id');
    value = d3.select(this).property('value');
    
    // filter demographic info by whichever ID is selected
    filteredData = metaData.filter(obj => obj.id== value);
        
    // extract filtered info and add to demographic info card
    Object.entries(filteredData[0]).forEach(([k,v]) => {
        demoCard.append("h6").text(`${k}: ${v}`);
        });
    }; 

init();

// event listener for dropdown menu 
dropdownMenu.on("change", handleClick);