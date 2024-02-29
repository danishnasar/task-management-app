const baseUrl = 'http://localhost:5000/api/v1';

export const API_ROUTES = {
    AUTH: {
        REGISTER: `${baseUrl}/auth/register`,
        LOGIN: `${baseUrl}/auth/login`,
        LOGOUT: `${baseUrl}/auth/logout`,
        FORGOTPASSWORD: `${baseUrl}/auth/forgotPassword`,
        RESETPASSWORD: `${baseUrl}/auth/resetPassword`
    },
    PROJECTS: {
        GETPROJECTS: `${baseUrl}/projects`
    },
    TASKS: {
        GETTASKS: `${baseUrl}/tasks`
    }
}