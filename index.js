const countyURL =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationURL =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

const colors = [
	'#addfad',
	'#90EE90',
	'#77dd77',
	'#32cd32',
	'#4cbb17',
	'#009000',
	'#00693e',
	'#004225',
];

let tooltip = d3.select('#tooltip');
const canvas = d3.select('#canvas');
const legend = d3.select('#legend');

const drawMap = () => {
	canvas
		.selectAll('path')
		.data(countyData)
		.enter()
		.append('path')
		.attr('d', d3.geoPath())
		.attr('class', 'county')
		.attr('fill', (countyDataItem) => {
			let id = countyDataItem['id'];
			let county = educationData.find((item) => item['fips'] === id);
			let percentage = county['bachelorsOrHigher'];

			if (percentage <= 3) {
				return colors[0];
			} else if (percentage <= 12) {
				return colors[1];
			} else if (percentage <= 21) {
				return colors[2];
			} else if (percentage <= 30) {
				return colors[3];
			} else if (percentage <= 39) {
				return colors[4];
			} else if (percentage <= 48) {
				return colors[5];
			} else if (percentage <= 57) {
				return colors[6];
			} else {
				return colors[7];
			}
		})
		.attr('data-fips', (countyDataItem) => {
			return countyDataItem['id'];
		})
		.attr('data-education', (countyDataItem) => {
			let id = countyDataItem['id'];
			let county = educationData.find((item) => item['fips'] === id);
			let percentage = county['bachelorsOrHigher'];
			return percentage;
		})
		.on('mouseover', (event, countyDataItem) => {
			tooltip
				.transition()
				.duration(1)
				.style('visibility', 'visible')
				.style('opacity', 0.8)
				.style('left', event.pageX + 'px')
				.style('top', event.pageY + 'px');

			let id = countyDataItem['id'];
			let county = educationData.find((item) => item['fips'] === id);

			tooltip
				.text(
					county['fips'] +
						' - ' +
						county['area_name'] +
						', ' +
						county['state'] +
						' : ' +
						county['bachelorsOrHigher'] +
						'%'
				)
				.attr('data-education', county['bachelorsOrHigher']);
		})
		.on('mouseout', (countyDataItem) => {
			tooltip.transition().duration(1).style('visibility', 'hidden');
		});
};

d3.json(countyURL).then((data, err) => {
	if (err) {
		console.log(err);
	} else {
		countyData = topojson.feature(data, data.objects.counties).features;
		console.log(countyData);
		d3.json(educationURL).then((data, err) => {
			if (err) {
				console.log(err);
			} else {
				educationData = data;
				console.log(educationData);
				drawMap();
			}
		});
	}
});
