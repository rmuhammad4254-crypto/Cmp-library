const { exec } = require("child_process");

function runSQL(sql) {
    return new Promise((resolve, reject) => {

        exec(
            `sqlite3 -header -json database/cmp.db "${sql}"`,
            (error, stdout, stderr) => {

                if (error) return reject(error);

                if (stderr) return reject(stderr);

                try {

                    resolve(JSON.parse(stdout || "[]"));

                } catch {

                    resolve([]);

                }

            }
        );

    });
}

module.exports = runSQL;
