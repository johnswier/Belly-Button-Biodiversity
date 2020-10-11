// function to create metadata 
function buildMetadata(selection) { 
    // read in data
    d3.json("./data/samples.json").then((data) => {
        // print dataset for reference 
        // console.log(data);
    
        // collect metadata info
        var metaData = data.metadata;

        // filter demographic info by whichever ID is selected
        var filteredDemo = metaData.filter(obj => obj.id == selection);
        
        // create var to hold demographic info card HTML element
        var demoCard = d3.select("#sample-metadata");
        
        // clear demographics data each time new ID is selected
        demoCard.html("");
        
        // extract filtered demographic info and update HTML element
        Object.entries(filteredDemo[0]).forEach(([k,v]) => {
        demoCard.append("h6").text(`${k}: ${v}`);
        });
    });
};

// function to create plots
function buildPlots(selection) {
    d3.json("./data/samples.json").then((data) => {
    
        // collect samples
        var samples = data.samples;

        // filter out the sample that matches user selection
        var filteredSample = samples.filter(obj => obj.id == selection);

        // index into the sample 
        var sample = filteredSample[0];
    
        // extract data necessary for plots
        var otuIDs = sample.otu_ids;
        var otuLabels = sample.otu_labels;
        var sampleValues = sample.sample_values

        // create bar chart using first 10 data points
        var barData = [{
            x: sampleValues.slice(0,10).reverse(),
            y: otuIDs.slice(0,10).map(otuIDs => `OTU ${otuIDs}`).reverse(),
            text: otuLabels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        var barLayout = {
            title: "OTU IDs",
        };
        Plotly.newPlot("bar", barData, barLayout);

        // create a bubble chart using the first 10 data points
        var bubbleData = [{
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Earth"
            }
        }];
        var bubbleLayout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            title: "Cultures for each OTU Sample",
            margin: {t:0},
            margin: {t:30}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);    
    });
};
            

// build dropdown menu selection list and initial plots
function init() {
    // var to hold dropdown menu HTML element
    var dropdownMenu = d3.select("#selDataset");
    
    d3.json("./data/samples.json").then((data) => {
        
        // collect ID's
        var idList = data.names;
    
        // Loop through ID's and add each one to dropdown menu
        for (let i = 0; i < idList.length; i++) {
            dropdownMenu.append("option")
                        .text(idList[i])
                        .property("value", idList[i]);
        };

        // initial plots
        buildMetadata(idlist[0]);
        buildPlots(idlist[0]);
    });
};

// function to run when new ID is selected
function optionChanged(selection) {
    buildMetadata(selection);
    buildPlots(selection);
};

init();