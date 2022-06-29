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

const { execFile, exec } = require('child_process');
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
	try{
	if ('input' in files) {
		let { input } = files
		unlinkSync(input[0].path)
	}
	let { code } = files
	let codefile = code[0].filename
	let execFilename = path.basename(codefile, '.cpp')
	unlinkSync(code[0].path)
	unlinkSync(`./executable/${execFilename}`)
}catch(err){
	console.error('there was an error:', error.message);
}

}
const computeFile = (req, res) => {
	// console.log("Inside uploadImageVideo",req.file)
	// if (!req.file)
	// 	return res.status(404).json("File not found");
	console.log(req.files)
	// return res.status(200).json({ CompileSuccess: "hello" });
	let { code } = req.files
	code = code[0]
	let codefile = code.filename
	let execFilename = path.basename(codefile, '.cpp')
	// console.log("hello")
	// console.log(codefile)
	// console.log(inputfile)
	// console.log(codefile.buffer)
	// return res.status(200).json({ CompileError: "hello" });
	let compileCommand = `g++ ./uploads/${codefile} -o ./executable/${execFilename}`
	let execCommand = `./executable/${execFilename}`
	exec(compileCommand, (err, stdout, stderr) => {
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
			const exec_file = execFile(execCommand, ['<', `./uploads/${inputfile}`], { shell: true }, (err, stdout, stderr) => {
				if (stderr) {
					// console.log(err);
					res.status(200).json({ RuntimeError: stderr });
					deleteFiles(req.files);
					return;
				}

				// console.log("output is", stdout);
				res.status(200).json({ Success: stdout });
			})
		}
		else {
			const exec_file = execFile(execCommand, (err, stdout, stderr) => {
				if (stderr) {
					// console.log(err);
					res.status(200).json({ RuntimeError: stderr });
					deleteFiles(req.files);
					return;
				}
				// console.log("output is", stdout);
				res.status(200).json({ Success: stdout });
			})
		}
		deleteFiles(req.files);
		return;
	});


}

const sendHello = (req, res) => {
	return res.send("hello world")
}



module.exports = { computeFile, sendHello }