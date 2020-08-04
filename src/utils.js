const regedit = require('regedit');
const path = require('path');
exports.getCompilersPath = function () {
    return new Promise(async (resolve, reject) => {
        let compilersPath = [];
        let caliper = 'HKLM\\SOFTWARE\\Caliper Corporation';
        let result = await regeditList(caliper);
        for (let i = 0; i < result[caliper].keys.length; i++) {
            let software = caliper + '\\' + result[caliper].keys[i];
            let result1 = await regeditList(software);
            for (let j = 0; j < result1[software].keys.length; j++) {
                let version = software + '\\' + result1[software].keys[j];
                let result2 = await regeditList([version]);
                compilersPath.push(path.normalize(result2[version].values['Installed In'].value + '\\' + 'rscc.exe'));
            }
        }
        if (compilersPath.length > 0) {
            resolve(compilersPath);
        } else {
            resolve(undefined);
        }
    });
};

function regeditList(keys) {
    return new Promise((resolve, reject) => {
        regedit.list(keys, (err, result) => {
            if (err) {
                reject();
            } else {
                resolve(result);
            }
        });
    });
}