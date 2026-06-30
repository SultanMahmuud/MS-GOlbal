
const rootRoutes = '/api/v1';

const rootAuthRoute = `user`;
const rootDoctorRoute = `${rootRoutes}/users/doctor`;
const rootPatientRoute = `${rootRoutes}/users`;
const rootCourseRoute = `/course`;
const rootWebSiteInfoRoutes = `${rootRoutes}/website-info`;
const rootCanonicalRoutes = 'get-canonicalUrl';
const rootMailRoutes = `${rootRoutes}/mail/`;
export const websiteInfoRoutes = {
    get: rootWebSiteInfoRoutes
};

export const MAIL_ENDPOINTS = {
    SEND_CONTACT: `${rootMailRoutes}/send-contact`,
    VERIFY_EMAIL: `${rootMailRoutes}/verify-email`,
    SUBSCRIBE: `${rootMailRoutes}/subscribe`
};

export const rootCanonicalUrlRoutes = {
    get: `${rootCanonicalRoutes}`
};

export const authRoutes = {
    login: `${rootAuthRoute}/login`,
    register: `${rootAuthRoute}/signup`,
    registerTeacher: `${rootAuthRoute}/signup/teacher`,
    get_all_user: `${rootAuthRoute}/get-all-user`,
    delete_user: (id: string) => `${rootAuthRoute}/delete-user/${id}`,
    update_user: (id: string) => `${rootAuthRoute}`,
    getById: (id: string) => `${rootAuthRoute}/single-user/${id}`,  
    forgotPassword: `${rootAuthRoute}/passwordreset`,
};

export const courseRoutes = {
    getAll: `${rootCourseRoute}`,
    create: `${rootCourseRoute}`,
    delete: (id: string) => `${rootCourseRoute}/${id}`,
    getById: (id: string) => `${rootCourseRoute}/${id}`,
    update: (id: string) => `${rootCourseRoute}/${id}`
};
export const teacherRoutes = {
    create: `${rootRoutes}/teacherProfiles/createTeacherProfile`,

};
