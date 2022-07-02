// const longComputation = () => {
// 	let sum = 0;
// 	for (let i = 0; i < 1e10; i++) {
// 		sum += i;
// 	};
// 	return sum;
// };

// process.on('message', (msg) => {
// 	console.log("received ", msg)
// 	const sum = longComputation();
// 	process.send(sum);
// });


// const fs = require('fs');
// const path = require('path')
// const { spawn } = require('child_process');

// const child = spawn('g++', [req.file, '-o', '../objFiles/q1']);
// const wc = spawn('./q1')

// // child.stdout.on('data', (data) => {
// // 	console.log(`child stdout:\n${data}`);
// // });
// child.stderr.on('data', (data) => {
// 	console.error(`child stderr:\n${data}`);
// });

// child.stdout.pipe(wc.stdin)
// // find.stdout.pipe(wc.stdin);
// wc.stdout.on('data', (data) => {
// 	data = data.toString();
// 	console.log(data);
// 	// process.stdout.flush()
// });

const { execFile, exec, spawn } = require('child_process');
const path = require('path')
const { unlinkSync } = require('fs');
// const getSingleFile = async (req, res) => {
// 	try {
// 		const file = await gfs.files.findOne({ filename: req.params.filename });
// 		if (!file) {
// 			return res.status(404).json({ err: 'No file exists' });
// 		}
// 		// File exists
// 		return res.status(200).json(file);
// 	}
// 	catch (err) {
// 		console.log("error in exist function ", err);
// 		res.status(500).send("Internal Server Error");
// 	}

// }

// const updateOutput=(text)=>{
// 	const pattern = "^[0-9a-zA-Z]+$.cpp";
// 	let newText = text.replace(/`${pattern}`/g, "Solution.cpp");
// 	return newText
// }
const deleteFiles = async (files) => {
	// unlink('path/file.txt', (err) => {
	// 	if (err) throw err;
	// 	console.log('path/file.txt was deleted');
	//   });
	try {
		if ('input' in files) {
			let { input } = files
			unlinkSync(input[0].path)
		}
		let { code } = files
		let codefile = code[0].filename
		let execFilename = path.basename(codefile, '.cpp')
		unlinkSync(code[0].path)
		unlinkSync(`./executable/${execFilename}`)
	} catch (err) {
		console.error('there was an error:', err.message);
	}

}
const computeCpp17 = (req, res) => {
	// console.log("Inside computeCpp",req.files)
	if (!req.files)
		return res.status(404).json("File not found");
	// console.log(req.files)
	// return res.status(200).json({ CompileSuccess: "hello" });
	let { code } = req.files
	let codefile = code[0].filename
	let execFilename = path.basename(codefile, '.cpp')
	// console.log("hello")
	// console.log(codefile)
	// console.log(inputfile)
	// console.log(codefile.buffer)
	// return res.status(200).json({ CompileError: "hello" });
	let compileCommand = `g++ -std=c++17 ./uploads/${codefile} -o ./executable/${execFilename}`
	// let execCommand = `./executable/${execFilename}`
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

		let execCommand
		if ('input' in req.files) {
			let { input } = req.files
			inputfile = input[0].filename
			execCommand = `./executable/${execFilename} < ./uploads/${inputfile}`
		}
		else {
			execCommand = `./executable/${execFilename}`
		}
		exec(`timeout 5s ${execCommand}`, (err, stdout, stderr) => {
			if (stderr) {
				// console.log(err);
				res.status(200).
					json({
						errorMessage: stderr,
						errorType: "RuntimeError"
					});
				deleteFiles(req.files);
				return;
			}
			if (err) {
				if (err.code === 124) {
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
	})
	// execFile(execCommand, ['<', `./uploads/${inputfile}`], { shell: true, timeout: 5000 }, (err, stdout, stderr) => {
	// 	if (err) {
	// 		console.log(err)
	// 		res.status(500).send("Internal Server Error");
	// 		deleteFiles(req.files);
	// 		return;
	// 	}
	// 	if (stderr) {
	// 		// console.log(err);
	// 		res.status(200).json({ RuntimeError: stderr });
	// 		deleteFiles(req.files);
	// 		return;
	// 	}

	// 	// console.log("output is", stdout);
	// 	res.status(200).json({ Success: stdout });
	// 	deleteFiles(req.files);
	// 	return;
	// })
	// }
	// else {
	// 	execFile(execCommand, (err, stdout, stderr) => {
	// 		if (err) {
	// 			res.status(500).send("Internal Server Error");
	// 			deleteFiles(req.files);
	// 			return;
	// 		}
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
	// if ('input' in req.files) {
	// 	let { input } = req.files
	// 	let inputfile = input[0].filename
	// 	const cpp = spawn(execCommand, ['<', `./uploads/${inputfile}`], { timeout: 5000, shell: true });
	// 	cpp.on('error', (err) => {
	// 		res.status(500).json({ error: err });
	// 		deleteFiles(req.files)
	// 		return;
	// 	});
	// 	cpp.stdout.on('data', (data) => {
	// 		res.status(200).json({ Success: data.toString() });
	// 		deleteFiles(req.files)
	// 		return;
	// 	});

	// 	cpp.stderr.on('data', (data) => {
	// 		res.status(200).json({ Error: data.toString() });
	// 		deleteFiles(req.files)
	// 		return;
	// 	});
	// }
	// });


}

module.exports = { computeCpp17 }