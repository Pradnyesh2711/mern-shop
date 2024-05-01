module.exports = {
    apps: [
        {
            name: "client",
            script: "./index.js",
            instances: 4,
            exec_mode: "cluster",
            watch: true,
            increment_var: 'PORT',
            env: {
                "PORT": 5000,
                "NODE_ENV": "development"
            }
        }
    ]
}