
const { execFile, exec, spawn } = require('child_process');
const path = require('path')
const { unlinkSync } = require('fs');
const deleteFiles = async (files) => {
	try {
		if ('input' in files) {
			let { input } = files
			unlinkSync(input[0].path)
		}
		let { code } = files
		let codefile = code[0].filename
		let execFilename = path.basename(codefile, '.c')
		unlinkSync(code[0].path)
		unlinkSync(`./executable/${execFilename}`)
	} catch (err) {
		console.error('there was an error:', error.message);
	}
}
const computeC = (req, res) => {
	// console.log("Inside computeCpp",req.files)
	if (!req.files)
		return res.status(404).json("File not found");
	// console.log(req.files)
	// return res.status(200).json({ CompileSuccess: "hello" });
	let { code } = req.files
	let codefile = code[0].filename
	let execFilename = path.basename(codefile, '.c')
	// console.log("hello")
	// console.log(codefile)
	// console.log(inputfile)
	// console.log(codefile.buffer)
	// return res.status(200).json({ CompileError: "hello" });
	let compileCommand = `g++ ./uploads/${codefile} -o ./executable/${execFilename}`
	let execCommand = `./executable/${execFilename}`
	exec(compileCommand, (err, stdout, stderr) => {
		if (err) {
			res.status(500).send("Internal Server Error");
			deleteFiles(req.files);
			return;
		}
		if (stderr) {
			res.status(200).json({ CompileError: stderr });
			deleteFiles(req.files);
			return;
		}

		// console.log(stdout);
		// console.log("checkpoint")
		// console.log("successfully executed")
		if ('input' in req.files) {
			let { input } = req.files
			let inputfile = input[0].filename
			const cpp = spawn('timeout',['5s', execCommand, '<', `./uploads/${inputfile}`], { shell: true });
			cpp.on('error', (err) => {
				res.status(500).json({ error: err });
				deleteFiles(req.files)
				return;
			});
			cpp.stdout.on('data', (data) => {
				res.status(200).json({ Success: data.toString() });
				deleteFiles(req.files)
				return;
			});

			cpp.stderr.on('data', (data) => {
				res.status(200).json({ Error: data.toString() });
				deleteFiles(req.files)
				return;
			});
		}
		// 	execFile(execCommand, ['<', `./uploads/${inputfile}`], { shell: true }, (err, stdout, stderr) => {
		// 		if (stderr) {
		// 			// console.log(err);
		// 			res.status(200).json({ RuntimeError: stderr });
		// 			deleteFiles(req.files);
		// 			return;
		// 		}

		// 		// console.log("output is", stdout);
		// 		res.status(200).json({ Success: stdout });
		// 	})
		// }
		// else {
		// 	execFile(execCommand, (err, stdout, stderr) => {
		// 		if (stderr) {
		// 			// console.log(err);
		// 			res.status(200).json({ RuntimeError: stderr });
		// 			deleteFiles(req.files);
		// 			return;
		// 		}
		// 		// console.log("output is", stdout);
		// 		res.status(200).json({ Success: stdout });
		// 	})
		// }
		// deleteFiles(req.files);
		// return;
	});


}

module.exports = { computeC }