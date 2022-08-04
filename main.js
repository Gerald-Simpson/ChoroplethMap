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

				let colorScale = d3.scaleQuantize().domain([3, 66]).range(colors);

				var path = d3.geoPath();

				var svg = d3
					.select("#chart")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

				/*svg
					.append("rect")
					.attr("width", w)
					.attr("height", h)
					.attr("fill", colorScale(65));*/

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
					.attr("stroke", "none")
					.attr("stroke-width", 0);

				console.log(
					Math.max(...DataData.map((value) => value.bachelorsOrHigher))
				);
				console.log(
					Math.min(...DataData.map((value) => value.bachelorsOrHigher))
				);

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
			})
	);
