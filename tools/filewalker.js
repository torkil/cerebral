
var fs = require('fs')

function filewalker(root, options, fileCb, doneCb) {
    fs.readdir(root, function processDir(err, files) {
        if (err) {
            fileCb(err);
        } else {
            if (files.length > 0) {
                var filename = files.shift();
                var file = root + '/' + filename
                fs.stat(file, function processStat(err, stat) {
                    if (err) {
                        doneCb(err);
                    } else {
                        if( options.ignore.match(filename) ) {
                            processDir(false, files);
                        } else if (stat.isFile()) {
                            fileCb(null, root, filename, function(err) {
                                if (err) {
                                    doneCb(err);
                                } else {
                                    processDir(false, files);
                                }
                            });
                        } else {
                            filewalker(file, options, fileCb, function(err) {
                                if (err) {
                                    doneCb(err);
                                } else {
                                    processDir(false, files);
                                }
                            });
                        }
                    }
                });
            } else {
                doneCb(false);
            }
        }
    });
}

module.exports.filewalker = filewalker