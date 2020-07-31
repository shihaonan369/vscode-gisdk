exports.getCompilerPath = function () {
    return new Promise((resolve, reject) => {
        let regedit = require('regedit');
        let installedIn = "";
        regedit.list(['HKLM\\SOFTWARE\\Caliper Corporation\\TransCAD'], (err, result) => {
            if (err) {
                reject();
            } else {
                if (result['HKLM\\SOFTWARE\\Caliper Corporation\\TransCAD'].keys.length > 0) {
                    let key = 'HKLM\\SOFTWARE\\Caliper Corporation\\TransCAD' + '\\' + result['HKLM\\SOFTWARE\\Caliper Corporation\\TransCAD'].keys[0];
                    regedit.list([key], (err1, result1) => {
                        if (err1) {
                            reject();
                        } else {
                            installedIn = result1[key].values['Installed In'].value + 'rscc.exe';
                            resolve(installedIn);
                        }
                    });
                }
            }
        });
    });
};