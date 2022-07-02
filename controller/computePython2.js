const { spawn,exec } = require('child_process');
const { unlinkSync } = require('fs');

const deleteFiles = async (files) => {
	try {
		if ('input' in files) {
			let { input } = files
			unlinkSync(input[0].path)
		}
		let { code } = files
		unlinkSync(code[0].path)
		console.log("hello")
	} catch (err) {
		console.error('there was an error:', error.message);
	}
}

const computePython2 = (req, res) => {
	if (!req.files)
		return res.status(404).json("File not found");
	// console.log(req.files)
	// return res.status(200).json({ CompileSuccess: "hello" });
	let { code } = req.files
	let codefile = code[0].filename
	// let { input } = req.files
	// let inputfile = input[0].filename
	// let execCommand = `python3 ./uploads/${codefile}`
	// exec(execCommand,['<',`./uploads/${inputfile}`], (err, stdout, stderr) => {
	// 	// ['<', `./uploads/${inputfile}`],
	// 	if (err) {
	// 		console.log(err)
	// 		res.status(500).json({ RuntimeError: err });
	// 		// deleteFiles(req.files);
	// 		return;
	// 	}
	// 	if (stderr) {
	// 		// console.log(err);
	// 		res.status(401).json({ RuntimeError: stderr });
	// 		// deleteFiles(req.files);
	// 		return;
	// 	}
	// 	// console.log("output is", stdout);
	// 	res.status(200).json({ Success: stdout });
	// 	return;
	// });

	// const python = spawn('python2',[`./uploads/${codefile}`, '<', `./uploads/${inputfile}`],{shell:true});

	// python.stdout.on('data', (data) => {
	// 	res.status(200).json({ Success: data.toString() });
	// 	deleteFiles(req.files)
	// 	return;
	// });

	// python.stderr.on('data', (data) => {
	// 	res.status(200).json({ Error: data.toString() });
	// 	deleteFiles(req.files)
	// 	return;
	// });
	// python.on('error', (err) => {
	// 	res.status(500).json({ error: err });
	// 	deleteFiles(req.files)
	// 	return;
	// });
	let execCommand
	if ('input' in req.files) {
		let { input } = req.files
		inputfile = input[0].filename
		execCommand = `python2 ./uploads/${codefile} < ./uploads/${inputfile}`
	}
	else {
		execCommand = `python2 ./uploads/${codefile}`
	}

	exec(`${execCommand}`, { timeout: 5000 }, (err, stdout, stderr) => {
		if (stderr) {
			// console.log(err);
			res.status(200).
				json({
					errorMessage: stderr,
					errorType: "Error"
				});
			deleteFiles(req.files);
			return;
		}
		if (err) {
			if (err.signal === 'SIGTERM') {
				res.status(200).json({
					errorMessage: "Time Limit Exceeded, Please Optimised Your Code",
					errorType: "Time Limit Exceeded"
				});
			}
			else {
				console.log(err)
				res.status(500).send("Internal Server Error");
			}
			deleteFiles(req.files);
			return;
		}
		res.status(200).json({ Success: stdout });
		deleteFiles(req.files);
		return;
	})
}


module.exports = { computePython2 }