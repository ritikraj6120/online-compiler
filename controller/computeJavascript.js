const {  exec } = require('child_process');
const { unlinkSync} = require('fs');

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

const computeJavascript = (req, res) => {
	console.log("hi")
	if (!req.files)
		return res.status(404).json("File not found");
	let { code } = req.files
	let codefile = code[0].filename
	let execCommand
	if ('input' in req.files) {
		let { input } = req.files
		inputfile = input[0].filename
		execCommand = `node ./uploads/${codefile} < ./uploads/${inputfile}`
	}
	else {
		execCommand = `node ./uploads/${codefile}`
	}


	console.log("hi again")
	exec(`${execCommand}`, { timeout: 5000 }, (err, stdout, stderr) => {
		console.log(err)
		console.log("inside exec")
		if (stderr) {
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


module.exports = { computeJavascript }