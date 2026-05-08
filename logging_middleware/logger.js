const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

const VALID_STACKS = ["frontend", "backend"];

const VALID_LEVELS = [
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
];

const BACKEND_PACKAGES = [
    "cache",
    "controller",
    "cron_job",
    "db",
    "handler",
    "repository",
    "route",
    "service",
];

const FRONTEND_PACKAGES = [
    "api",
    "component",
    "hook",
    "page",
    "state",
    "style",
];

const COMMON_PACKAGES = [
    "auth",
    "config",
    "middleware",
    "utils",
];

async function Log(stack, level, package, message){
    try{
        if(!VALID_STACKS.includes(stack)){
            throw new Error(`Invalid Stack:${stack}`);
        }
        if(!VALID_LEVELS.includes(level)){
            throw new Error(`Invalid Level:${level}`)
        }

        let allowed_packages = [...COMMON_PACKAGES];
        if(stack == "backend"){
            allowed_packages.push(...BACKEND_PACKAGES);
        }

        if(stack == "frontend"){
            allowed_packages.push(...FRONTEND_PACKAGES);
        }
        
        if(!package.includes(allowed_packages)){
            throw new Error(`Invalid package:${package} for stack:${stack}`);
        }

        const payload = {
            stack,
            level,
            package: packageName,
            message,
        };

        const response = await fetch(LOG_API_URL, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Log API Error:", data);
            return;
        }

        console.log("Log created successfully:", data);

        return data;

    }catch (error) {
        console.error("Logging Failed:", error.message);
    }
}