/** @format */

let dataSource =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

fetch(dataSource)
	.then((data) => data.json())
	.then((jsonData) => {
		const w = 1000;
		const h = 600;

		const svg = d3
			.select("#chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		svg.append("rect").attr("width", w).attr("height", h).attr("fill", "pink");
	});
