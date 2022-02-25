module.exports = {
    apps : [{
        name   : "app1",
        script : "./dist/index.js",
        log_date_format: "YYYY-MM-DD HH:mm Z",
        error_file: "./logs/logs-error",
        out_file: "./logs/logs-out"
        }]
} 