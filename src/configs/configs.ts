interface Config {
    API_URI_DEV: string;
    API_STATIC_FILES_URI_DEV: string;
    
    API_URI_PROD: string;
    API_STATIC_FILES_URI_PROD: string;
}

export const config: Config = {
    // API_URI_DEV: "http://localhost:5279/api",
    // API_STATIC_FILES_URI_DEV: "http://localhost:5279",
    API_URI_DEV: "/api",
    API_STATIC_FILES_URI_DEV: "/",
    API_URI_PROD: "http://10.111.104.56:5000/api",
    API_STATIC_FILES_URI_PROD: "http://10.111.104.56:5000"
};