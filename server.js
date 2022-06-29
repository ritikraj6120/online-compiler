const express = require('express')
const cluster = require("cluster");
const Router  = require('./router/router.js');
const morgan=require('morgan');
const totalCPUs = require("os").cpus().length;
const port = process.env.PORT || 5000;
if (cluster.isMaster) {
	console.log(`Number of CPUs is ${totalCPUs}`);
	console.log(`Master ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < totalCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
		console.log("Let's fork another worker!");
		cluster.fork();
	});
} else {
	const app = express();
	console.log(`Worker ${process.pid} started`);

	// app.get("/", (req, res) => {
	// 	res.send("Hello World!");
	// });

	// app.get("/compute", (req, res) => {
		
	// });
	app.use(morgan('dev'));
	app.use(express.json());
	app.use('/',Router);

	app.listen(port, () => {
		console.log(`App listening on port ${port}`);
	});
}
// app.get('/compute', (req, res) => {
// 	const compute = fork('compute.js');
// 	compute.send('start');
// 	compute.on('message', sum => {
// 		res.send(`Sum is ${sum}`);
// 	});
// });

// app.get('/compute', (req, res) => {
// 	const compute = fork('compute.js');
// 	compute.send('start');
// 	compute.on('message', sum => {
// 		res.send(`Sum is ${sum}`);
// 	});
// })

// app.listen(3000, function (err) {
// 	if (err) console.log("Error in server setup")
// 	console.log("Server listening on Port", 3000);
// })