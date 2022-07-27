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
				const w = 1000;
				const h = 600;

				const svg = d3
					.select("#chart")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

				svg
					.append("rect")
					.attr("width", w)
					.attr("height", h)
					.attr("fill", "pink");
			})
	);
