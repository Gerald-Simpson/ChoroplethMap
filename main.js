/** @format */

let dataSourceData =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let dataSourceMap =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

var DataMap = {};

fetch(dataSourceMap)
	.then((data) => data.json())
	.then((jsonDataMap) => {
		DataMap = jsonDataMap;
	})
	.then(
		fetch(dataSourceData)
			.then((data) => data.json())
			.then((DataData) => {
				var w = 1000,
					h = 600;

				let colors = [
					"#eff3ff",
					"#c6dbef",
					"#9ecae1",
					"#6baed6",
					"#4292c6",
					"#2171b5",
					"#084594",
				];

				let colorScale = d3
					.scaleThreshold()
					.domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
					.range(colors);

				var legendScale = d3
					.scaleLinear()
					.domain([2.6, 75.1])
					.rangeRound([550, 810]);

				var path = d3.geoPath();

				var svg = d3
					.select("#chart")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

				var legendAxis = d3
					.axisBottom(legendScale)
					.tickSize(15)
					.tickFormat(function (y) {
						return Math.round(y) + "%";
					})
					.tickValues(colorScale.domain());

				let legend = svg.append("g").attr("id", "legend");

				legend
					.selectAll("rect")
					.data(d3.range(2.6, 75.1, (75.1 - 2.6) / 8).slice(0, -1))
					.enter()
					.append("rect")
					.attr("class", "legendColor")
					.attr("fill", (d) => colorScale(d))
					.attr("width", (810 - 550) / 8 + 1)
					.attr("height", 10)
					.attr("x", function (d, i) {
						return legendScale(Math.round(d));
					})
					.attr("y", 0);

				console.log(legendScale(2.6));
				console.log(colorScale.invertExtent("#c6dbef"));

				legend
					.call(legendAxis)
					.attr("transform", "translate(0, 30)")
					.select(".domain")
					.remove();

				let tooltip = d3
					.select("#chart")
					.append("div")
					.attr("id", "tooltip")
					.html("testing")
					.style("opacity", 00);

				svg
					.append("g")
					.attr("class", "counties")
					.selectAll("path")
					.data(topojson.feature(DataMap, DataMap.objects.counties).features)
					.enter()
					.append("path")
					.attr("class", "county")
					.attr("data-fips", (d) => d.id)
					.attr("data-education", function (d) {
						var countyDataObject = DataData.find(
							(object) => object.fips === d.id
						);
						return countyDataObject.bachelorsOrHigher;
					})
					.attr("state", function (d) {
						var countyDataObject = DataData.find(
							(object) => object.fips === d.id
						);
						return countyDataObject.state;
					})
					.attr("areaName", function (d) {
						var countyDataObject = DataData.find(
							(object) => object.fips === d.id
						);
						return countyDataObject.area_name;
					})
					.attr("fill", (d) => {
						return colorScale(
							DataData.find((object) => object.fips === d.id).bachelorsOrHigher
						);
					})
					.attr("d", path)
					.attr("stroke", "black")
					.attr("stroke-width", 0)
					.on("mouseover", handleMouseOver)
					.on("mouseout", handleMouseOut);

				function handleMouseOver(event, d) {
					d3.select(this).attr("stroke-width", 1);
					d3.select("#tooltip")
						.style("left", event.pageX + 10 + "px")
						.style("top", event.pageY + -25 + "px")
						.style("opacity", 80)
						.attr("data-education", function () {
							var countyObj = DataData.find((object) => object.fips === d.id);
							return countyObj.bachelorsOrHigher;
						})
						.html(function () {
							var countyObj = DataData.find((object) => object.fips === d.id);
							return (
								countyObj.area_name +
								", " +
								countyObj.state +
								": " +
								countyObj.bachelorsOrHigher +
								"%"
							);
						});
				}

				function handleMouseOut(event, d) {
					d3.select(this).attr("stroke-width", 0);
					d3.select("#tooltip").style("opacity", 0);
				}

				svg
					.append("path")
					.datum(
						topojson.mesh(DataMap, DataMap.objects.states, function (a, b) {
							return a !== b;
						})
					)
					.attr("d", path)
					.attr("stroke", "white")
					.attr("fill", "none");

				svg.append("rect");
			})
	);
